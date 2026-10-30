import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";
import {
  siteLocales,
  sitePages,
  localePageUrl,
  localePagePath,
  createSitemap,
} from "./site-locales.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultProjectDirectory = path.resolve(scriptDirectory, "..");
const pages = sitePages;
const locales = siteLocales;

const sharedRootFiles = [
  ".nojekyll",
  "404.html",
  "app.js",
  "favicon.ico",
  "language.js",
  "motion.js",
  "legal.css",
  "robots.txt",
  "site.webmanifest",
  "sitemap.xml",
  "styles.css",
];
const sharedDirectories = ["assets"];

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function assertNoSymbolicLinks(directory) {
  if (!(await exists(directory))) return;
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Refusing to publish symbolic link: ${entryPath}`);
    }
    if (entry.isDirectory()) await assertNoSymbolicLinks(entryPath);
  }
}

function assertFlatStringDictionary(dictionary, dictionaryPath) {
  if (
    !dictionary ||
    Array.isArray(dictionary) ||
    typeof dictionary !== "object"
  ) {
    throw new Error(`${dictionaryPath} must contain a JSON object.`);
  }
  for (const [key, value] of Object.entries(dictionary)) {
    if (typeof value !== "string") {
      throw new Error(`${dictionaryPath} value ${key} must be a string.`);
    }
  }
}

function valueShape(value, prefix = "") {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) =>
      valueShape(entry, `${prefix}[${index}]`),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, entry]) =>
      valueShape(entry, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [`${prefix}:${typeof value}`];
}

function assertMatchingKeys(reference, candidate, label) {
  const expected = Object.keys(reference).sort();
  const actual = Object.keys(candidate).sort();
  if (JSON.stringify(expected) === JSON.stringify(actual)) return;
  const missing = expected.filter((key) => !actual.includes(key));
  const extra = actual.filter((key) => !expected.includes(key));
  throw new Error(
    `${label} locale keys differ. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`,
  );
}

function assertMatchingConfigShape(reference, candidate) {
  if (
    JSON.stringify(valueShape(reference).sort()) !==
    JSON.stringify(valueShape(candidate).sort())
  ) {
    throw new Error("TransGuru app config structure differs between locales.");
  }
}

function assertEnglishIsTranslated(value, sourceName, keyPath = "") {
  if (typeof value === "string") {
    if (/[\u3400-\u9fff]/u.test(value)) {
      throw new Error(
        `${sourceName} still contains Chinese text at ${keyPath}.`,
      );
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      assertEnglishIsTranslated(
        entry,
        sourceName,
        keyPath ? `${keyPath}.${key}` : key,
      );
    }
  }
}

function safeJson(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

export function renderTemplate(template, values, label = "template") {
  const tokenPattern = /{{([^{}]+)}}/g;
  const missing = new Set();
  const output = template.replace(tokenPattern, (_match, key) => {
    if (!Object.hasOwn(values, key)) {
      missing.add(key);
      return "";
    }
    return values[key];
  });
  if (missing.size > 0) {
    throw new Error(
      `${label} has missing values: ${[...missing].sort().join(", ")}.`,
    );
  }
  const unresolved = [...output.matchAll(tokenPattern)].map(
    (match) => match[1],
  );
  if (unresolved.length > 0) {
    throw new Error(
      `${label} has unresolved tokens: ${unresolved.join(", ")}.`,
    );
  }
  return output;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function languageLinks(locale, file) {
  return locales
    .map((target) => {
      const active = target.id === locale.id;
      return `<li><a data-language-switch href="${escapeHtml(localePagePath(locale, target, file))}" lang="${target.lang}" hreflang="${target.hreflang}" dir="${target.dir}"${active ? ' aria-current="page"' : ""}><span class="locale-native" lang="${target.lang}" dir="${target.dir}">${escapeHtml(target.name)}</span>${active ? '<img src="assets/icons/check.svg" width="16" height="16" alt="">' : ""}</a></li>`;
    })
    .join("");
}

function languagePicker(locale, file) {
  return `<details class="language-picker" data-language-picker><summary aria-label="${escapeHtml(locale.label + ": " + locale.name)}"><img src="assets/icons/translate.svg" width="17" height="17" alt=""><span lang="${locale.lang}" dir="${locale.dir}">${escapeHtml(locale.name)}</span><img src="assets/icons/caret-down.svg" width="13" height="13" alt=""></summary><nav class="language-options" aria-label="${escapeHtml(locale.label)}"><ul>${languageLinks(locale, file)}</ul></nav></details>`;
}

function extraFontPreload(locale) {
  const fonts = {
    ar: "noto-sans-arabic-arabic-wght.woff2",
    hi: "noto-sans-devanagari-devanagari-wght.woff2",
  };
  return fonts[locale.id]
    ? `<link rel="preload" href="assets/fonts/${fonts[locale.id]}" as="font" type="font/woff2" crossorigin>`
    : "";
}

function seoLinks(locale, file) {
  const english = localePageUrl(locales[0], file);
  return [
    `<link rel="canonical" href="${localePageUrl(locale, file)}">`,
    ...locales.map(
      (target) =>
        `<link rel="alternate" hreflang="${target.hreflang}" href="${localePageUrl(target, file)}">`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${english}">`,
  ].join("\n    ");
}

function rewriteSharedPaths(html, prefix) {
  if (!prefix) return html;
  return html
    .replace(/(["'(\s,])assets\//g, `$1${prefix}assets/`)
    .replace(
      /(["'])((?:styles|legal|experience|international)\.css|app\.js|language\.js|motion\.js)([?#][^"']*)?\1/g,
      (_match, quote, file, suffix = "") =>
        `${quote}${prefix}${file}${suffix}${quote}`,
    );
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Could not read ${filePath}: ${error.message}`);
  }
}

async function loadLocale(projectDirectory, locale) {
  const localeDirectory = path.join(projectDirectory, "locales", locale.id);
  const dictionaries = {};
  for (const page of pages) {
    const filePath = path.join(localeDirectory, `${page.name}.json`);
    dictionaries[page.name] = await readJson(filePath);
    assertFlatStringDictionary(dictionaries[page.name], filePath);
  }
  return {
    dictionaries,
    appConfig: await readJson(path.join(localeDirectory, "app.json")),
  };
}

export async function buildSite({
  projectDirectory = defaultProjectDirectory,
  outputDirectory = path.join(projectDirectory, "dist"),
} = {}) {
  const localeData = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => [
        locale.id,
        await loadLocale(projectDirectory, locale),
      ]),
    ),
  );

  for (const locale of locales) {
    for (const page of pages) {
      assertMatchingKeys(
        localeData.en.dictionaries[page.name],
        localeData[locale.id].dictionaries[page.name],
        `${locale.id}/${page.name}`,
      );
    }
    assertMatchingConfigShape(
      localeData.en.appConfig,
      localeData[locale.id].appConfig,
    );
  }
  for (const page of pages) {
    assertEnglishIsTranslated(
      localeData.en.dictionaries[page.name],
      `${page.name} English locale`,
    );
  }
  assertEnglishIsTranslated(localeData.en.appConfig, "app English locale");

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });

  for (const fileName of sharedRootFiles) {
    const source = path.join(projectDirectory, fileName);
    if (!(await exists(source))) continue;
    const output = path.join(outputDirectory, fileName);
    const extension = path.extname(fileName);
    if (extension === ".css" || extension === ".js") {
      const cssBundles = {
        "styles.css": ["styles.css", "experience.css", "international.css"],
        "legal.css": [
          "styles.css",
          "experience.css",
          "legal.css",
          "international.css",
        ],
      };
      const input = cssBundles[fileName]
        ? (
            await Promise.all(
              cssBundles[fileName].map((file) =>
                readFile(path.join(projectDirectory, file), "utf8"),
              ),
            )
          ).join("\n")
        : await readFile(source, "utf8");
      const result = await transform(input, {
        loader: extension === ".css" ? "css" : "js",
        minify: true,
        target: "es2020",
        legalComments: "none",
        charset: "utf8",
      });
      await writeFile(output, result.code);
    } else {
      await cp(source, output);
    }
  }
  for (const directoryName of sharedDirectories) {
    const source = path.join(projectDirectory, directoryName);
    if (await exists(source)) {
      await assertNoSymbolicLinks(source);
      await cp(source, path.join(outputDirectory, directoryName), {
        recursive: true,
      });
    }
  }

  for (const locale of locales) {
    const localeOutput = locale.outputDirectory
      ? path.join(outputDirectory, locale.outputDirectory)
      : outputDirectory;
    await mkdir(localeOutput, { recursive: true });
    for (const page of pages) {
      const templatePath = path.join(projectDirectory, "templates", page.file);
      const template = await readFile(templatePath, "utf8");
      const canonicalUrl = localePageUrl(locale, page.file);
      const values = {
        ...localeData[locale.id].dictionaries[page.name],
        locale: locale.lang,
        assetPrefix: locale.outputDirectory ? "../" : "",
        canonicalUrl,
        direction: locale.dir,
        languagePicker: languagePicker(locale, page.file),
        localeFontPreload: extraFontPreload(locale),
        seoLinks: seoLinks(locale, page.file),
        ogLocale: locale.ogLocale,
        appConfig: safeJson(localeData[locale.id].appConfig),
      };
      const rendered = renderTemplate(
        template,
        values,
        `${locale.id}/${page.file}`,
      );
      const html = rewriteSharedPaths(
        rendered,
        locale.outputDirectory ? "../" : "",
      );
      await writeFile(path.join(localeOutput, page.file), html);
    }
  }

  await writeFile(path.join(outputDirectory, "sitemap.xml"), createSitemap());
  return { outputDirectory };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  const { outputDirectory } = await buildSite();
  console.log(
    `Built 15-language static site in ${path.relative(defaultProjectDirectory, outputDirectory)}/`,
  );
}
