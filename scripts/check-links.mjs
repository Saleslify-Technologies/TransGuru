import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const outputDirectory = path.join(projectDirectory, "dist");
const pagesBasePath = "/TransGuru/";

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  }));
  return nested.flat();
}

export function extractHtmlReferences(html) {
  const values = [];
  const attributePattern = /\b(?:href|src)\s*=\s*(["'])([\s\S]*?)\1/gi;
  for (const match of html.matchAll(attributePattern)) values.push(match[2]);

  const srcsetPattern = /\bsrcset\s*=\s*(["'])([\s\S]*?)\1/gi;
  for (const match of html.matchAll(srcsetPattern)) {
    for (const candidate of match[2].split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) values.push(url);
    }
  }
  return values;
}

function extractCssUrls(css) {
  const values = [];
  const urlPattern = /url\(\s*(["']?)(.*?)\1\s*\)/gi;
  for (const match of css.matchAll(urlPattern)) values.push(match[2]);
  return values;
}

function isExternal(value) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
}

async function checkReference(sourceFile, value, htmlIds, errors, publishedDirectory, basePath) {
  if (!value || isExternal(value) || value.startsWith("data:") || value.startsWith("mailto:") || value.startsWith("tel:")) return;

  let pathname = value;
  let fragment = "";
  const hashIndex = pathname.indexOf("#");
  if (hashIndex >= 0) {
    try {
      fragment = decodeURIComponent(pathname.slice(hashIndex + 1));
    } catch {
      errors.push(`${path.relative(publishedDirectory, sourceFile)}: invalid URL encoding: ${value}`);
      return;
    }
    pathname = pathname.slice(0, hashIndex);
  }
  pathname = pathname.split("?")[0];

  let targetFile = sourceFile;
  if (pathname) {
    if (pathname.startsWith("/")) {
      if (!pathname.startsWith(basePath)) {
        errors.push(`${path.relative(publishedDirectory, sourceFile)}: root-relative URL will break on GitHub Pages: ${value}`);
        return;
      }
      pathname = pathname.slice(basePath.length);
      targetFile = path.join(publishedDirectory, pathname || "index.html");
    } else {
      try {
        targetFile = path.resolve(path.dirname(sourceFile), decodeURIComponent(pathname));
      } catch {
        errors.push(`${path.relative(publishedDirectory, sourceFile)}: invalid URL encoding: ${value}`);
        return;
      }
    }
    if (pathname.endsWith("/")) targetFile = path.join(targetFile, "index.html");
  }

  const relativeTarget = path.relative(publishedDirectory, targetFile);
  if (relativeTarget.startsWith("..") || path.isAbsolute(relativeTarget)) {
    errors.push(`${path.relative(publishedDirectory, sourceFile)}: reference escapes the published site: ${value}`);
    return;
  }

  try {
    const targetStat = await stat(targetFile);
    if (!targetStat.isFile()) throw new Error("Not a file");
  } catch {
    errors.push(`${path.relative(publishedDirectory, sourceFile)}: missing target: ${value}`);
    return;
  }

  if (fragment && path.extname(targetFile).toLowerCase() === ".html") {
    let ids = htmlIds.get(targetFile);
    if (!ids) {
      const targetHtml = await readFile(targetFile, "utf8");
      ids = new Set(Array.from(targetHtml.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi), (match) => match[2]));
      htmlIds.set(targetFile, ids);
    }
    if (!ids.has(fragment)) {
      errors.push(`${path.relative(publishedDirectory, sourceFile)}: missing fragment #${fragment} in ${path.relative(publishedDirectory, targetFile)}`);
    }
  }
}

export async function checkPublishedDirectory(publishedDirectory, basePath = pagesBasePath) {
  const errors = [];
  const files = await collectFiles(publishedDirectory);
  const htmlIds = new Map();
  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    if (extension !== ".html" && extension !== ".css") continue;
    const content = await readFile(file, "utf8");
    const references = extension === ".html" ? extractHtmlReferences(content) : extractCssUrls(content);
    for (const reference of references) {
      await checkReference(file, reference, htmlIds, errors, publishedDirectory, basePath);
    }
  }
  return { errors, fileCount: files.length };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  const { errors, fileCount } = await checkPublishedDirectory(outputDirectory);
  if (errors.length > 0) {
    console.error(`Static link check failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Checked ${fileCount} published file(s); all local links resolve.`);
  }
}
