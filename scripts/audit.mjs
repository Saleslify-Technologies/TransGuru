import { mkdir, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { siteLocales, sitePages } from "./site-locales.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const reportDirectory = path.join(projectDirectory, ".lighthouse");
const lighthouseBinary = path.join(
  projectDirectory,
  "node_modules",
  ".bin",
  "lighthouse",
);
const basePath = "/TransGuru/";
const minimumScore = 0.95;
const categories = ["performance", "accessibility", "best-practices", "seo"];
const modes = [
  { name: "mobile", flags: [] },
  { name: "desktop", flags: ["--preset=desktop"] },
];

function selectAuditLocales(value) {
  if (value === undefined || value.trim() === "") return siteLocales;

  const localeIds = value.split(",").map((localeId) => localeId.trim());
  const knownLocaleIds = new Set(siteLocales.map((locale) => locale.id));
  const unknownLocaleIds = [
    ...new Set(localeIds.filter((localeId) => !knownLocaleIds.has(localeId))),
  ];

  if (unknownLocaleIds.length > 0) {
    throw new Error(
      `AUDIT_LOCALES contains unknown locale IDs: ${unknownLocaleIds.join(", ")}`,
    );
  }

  const requestedLocaleIds = new Set(localeIds);
  return siteLocales.filter((locale) => requestedLocaleIds.has(locale.id));
}

function createAuditPages(locales) {
  return locales.flatMap((locale) => {
    const localePath = locale.outputDirectory
      ? `${locale.outputDirectory}/`
      : "";
    const localeReportPrefix =
      locale.id === "en"
        ? ""
        : locale.id === "zh-CN"
          ? "zh-"
          : `${locale.outputDirectory}-`;

    return sitePages.map((page) => ({
      name: `${locale.id} ${page.name}`,
      pageName: page.name,
      path:
        page.file === "index.html" ? localePath : `${localePath}${page.file}`,
      reportPrefix: `${localeReportPrefix}${page.name === "home" ? "" : `${page.name}-`}`,
    }));
  });
}

function selectAuditPageNames(value) {
  if (value === undefined || value.trim() === "")
    return new Set(sitePages.map((page) => page.name));
  const requested = new Set(value.split(",").map((name) => name.trim()));
  const unknown = [...requested].filter(
    (name) => !sitePages.some((page) => page.name === name),
  );
  if (unknown.length)
    throw new Error(
      `AUDIT_PAGES contains unknown page names: ${unknown.join(", ")}`,
    );
  return requested;
}
const auditLocales = selectAuditLocales(process.env.AUDIT_LOCALES);
const auditPageNames = selectAuditPageNames(process.env.AUDIT_PAGES);
const pages = createAuditPages(auditLocales).filter((page) =>
  auditPageNames.has(page.pageName),
);

function run(command, argumentsList, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, argumentsList, {
      stdio: "inherit",
      ...options,
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else
        reject(new Error(`${command} exited with ${signal ?? `code ${code}`}`));
    });
  });
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Preview server did not become ready at ${url}`);
}

function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        probe.close();
        reject(new Error("Could not select a local audit port."));
        return;
      }
      probe.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

await mkdir(reportDirectory, { recursive: true });
const port = process.env.PORT
  ? Number.parseInt(process.env.PORT, 10)
  : await findAvailablePort();
const siteUrl = `http://127.0.0.1:${port}${basePath}`;
const server = spawn(
  process.execPath,
  [path.join(scriptDirectory, "serve.mjs")],
  {
    cwd: projectDirectory,
    env: { ...process.env, BASE_PATH: basePath, PORT: String(port) },
    stdio: "inherit",
  },
);

try {
  await waitForServer(siteUrl);
  const failures = [];

  for (const page of pages) {
    const auditUrl = new URL(page.path, siteUrl).href;
    try {
      await waitForServer(auditUrl);
    } catch (error) {
      failures.push(`${page.name} page could not load: ${error.message}`);
      continue;
    }

    for (const mode of modes) {
      const reportPath = path.join(
        reportDirectory,
        `${page.reportPrefix}${mode.name}.json`,
      );
      const label = `${page.name} ${mode.name}`;
      try {
        await run(
          lighthouseBinary,
          [
            auditUrl,
            "--quiet",
            "--output=json",
            `--output-path=${reportPath}`,
            `--only-categories=${categories.join(",")}`,
            "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage",
            ...mode.flags,
          ],
          { cwd: projectDirectory },
        );

        const report = JSON.parse(await readFile(reportPath, "utf8"));
        const scores = Object.fromEntries(
          categories.map((category) => [
            category,
            report.categories[category]?.score ?? 0,
          ]),
        );
        console.log(
          `${label}: ${categories.map((category) => `${category}=${Math.round(scores[category] * 100)}`).join(" ")}`,
        );

        for (const [category, score] of Object.entries(scores)) {
          if (score < minimumScore) {
            failures.push(
              `${label} ${category} score ${Math.round(score * 100)} is below 95`,
            );
          }
        }
      } catch (error) {
        failures.push(`${label} audit could not complete: ${error.message}`);
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(`Lighthouse gate failed:\n- ${failures.join("\n- ")}`);
  }
} finally {
  server.kill("SIGTERM");
}

console.log(
  `Lighthouse gate passed: all ${auditLocales.map((locale) => locale.id).join(", ")} pages score at least 95 in every mobile and desktop category.`,
);
