import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { siteLocales } from "./site-locales.mjs";

const projectDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const localesDirectory = path.join(projectDirectory, "locales");
const catalogNames = ["app", "home", "privacy", "terms"];
const requestedLocaleIds = [
  "ar",
  "de",
  "en",
  "es",
  "fr",
  "hi",
  "id",
  "it",
  "ms",
  "nl",
  "pt",
  "ru",
  "tr",
  "zh-CN",
  "zh-TW",
];
const protectedAttributes = [
  "href",
  "src",
  "id",
  "class",
  "width",
  "height",
  "datetime",
];
const bidiControlPattern = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u;

async function readCatalog(localeId, catalogName) {
  const file = path.join(
    localesDirectory,
    localeId,
    `${catalogName}.json`,
  );
  return JSON.parse(await readFile(file, "utf8"));
}

function visitStrings(value, visitor, location = "") {
  if (typeof value === "string") {
    visitor(value, location);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      visitStrings(item, visitor, `${location}[${index}]`),
    );
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    visitStrings(child, visitor, location ? `${location}.${key}` : key);
  }
}

function compareShape(reference, localized, location) {
  if (Array.isArray(reference)) {
    assert.ok(Array.isArray(localized), `${location} must remain an array`);
    assert.equal(
      localized.length,
      reference.length,
      `${location} array length changed`,
    );
    reference.forEach((item, index) =>
      compareShape(item, localized[index], `${location}[${index}]`),
    );
    return;
  }

  if (reference !== null && typeof reference === "object") {
    assert.ok(
      localized !== null &&
        typeof localized === "object" &&
        !Array.isArray(localized),
      `${location} must remain an object`,
    );
    assert.deepEqual(
      Object.keys(localized).sort(),
      Object.keys(reference).sort(),
      `${location} keys changed`,
    );
    for (const key of Object.keys(reference)) {
      compareShape(reference[key], localized[key], `${location}.${key}`);
    }
    return;
  }

  assert.equal(
    typeof localized,
    typeof reference,
    `${location} value type changed`,
  );
}

function flattenStrings(value, location = "", result = new Map()) {
  if (typeof value === "string") {
    result.set(location, value);
    return result;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      flattenStrings(item, `${location}[${index}]`, result),
    );
    return result;
  }
  for (const [key, child] of Object.entries(value)) {
    flattenStrings(child, location ? `${location}.${key}` : key, result);
  }
  return result;
}

function htmlTagSequence(value) {
  return [...value.matchAll(/<(\/)?([a-z][\w-]*)\b[^>]*>/giu)].map(
    (match) => `${match[1] ?? ""}${match[2].toLowerCase()}`,
  );
}

function attributeValues(value, attribute) {
  const pattern = new RegExp(
    `\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`,
    "giu",
  );
  return [...value.matchAll(pattern)].map((match) => match[2]);
}

function matches(value, pattern) {
  return [...value.matchAll(pattern)].map((match) => match[0]);
}

function protectedTokens(value) {
  return {
    urls: matches(value, /https?:\/\/[^\s"'<>]+/giu),
    paths: matches(value, /Download\/\.transguru\//gu),
    emails: matches(
      value,
      /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}/giu,
    ),
    dates: matches(value, /\b\d{4}-\d{2}-\d{2}\b/gu),
    placeholders: matches(value, /\{count\}/gu),
  };
}

function visibleText(value) {
  return value.replace(/<[^>]+>/gu, " ").replace(/\s+/gu, " ").trim();
}

const catalogs = new Map();
await Promise.all(
  requestedLocaleIds.flatMap((localeId) =>
    catalogNames.map(async (catalogName) => {
      catalogs.set(
        `${localeId}/${catalogName}`,
        await readCatalog(localeId, catalogName),
      );
    }),
  ),
);

test("registry and catalog directories contain the exact requested locales", async () => {
  assert.deepEqual(
    siteLocales.map((locale) => locale.id).sort(),
    [...requestedLocaleIds].sort(),
  );

  const localeDirectories = (await readdir(localesDirectory, {
    withFileTypes: true,
  }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(localeDirectories, [...requestedLocaleIds].sort());

  for (const localeId of requestedLocaleIds) {
    const files = (await readdir(path.join(localesDirectory, localeId)))
      .filter((file) => file.endsWith(".json"))
      .sort();
    assert.deepEqual(
      files,
      catalogNames.map((name) => `${name}.json`).sort(),
      `${localeId} catalog files changed`,
    );
  }
});

for (const localeId of requestedLocaleIds) {
  for (const catalogName of catalogNames) {
    test(`${localeId}/${catalogName} matches the English catalog contract`, () => {
      const reference = catalogs.get(`en/${catalogName}`);
      const localized = catalogs.get(`${localeId}/${catalogName}`);
      compareShape(reference, localized, `${localeId}/${catalogName}`);

      const referenceStrings = flattenStrings(reference);
      const localizedStrings = flattenStrings(localized);
      for (const [location, referenceValue] of referenceStrings) {
        const localizedValue = localizedStrings.get(location);
        const valueLocation = `${localeId}/${catalogName}:${location}`;

        assert.deepEqual(
          htmlTagSequence(localizedValue),
          htmlTagSequence(referenceValue),
          `${valueLocation} HTML tag sequence changed`,
        );
        for (const attribute of protectedAttributes) {
          assert.deepEqual(
            attributeValues(localizedValue, attribute),
            attributeValues(referenceValue, attribute),
            `${valueLocation} ${attribute} attributes changed`,
          );
        }
        assert.deepEqual(
          protectedTokens(localizedValue),
          protectedTokens(referenceValue),
          `${valueLocation} protected tokens changed`,
        );
      }
    });
  }
}

test("localized catalogs contain no bidi controls or Beta status copy", () => {
  for (const localeId of requestedLocaleIds) {
    for (const catalogName of catalogNames) {
      visitStrings(
        catalogs.get(`${localeId}/${catalogName}`),
        (value, location) => {
          const valueLocation = `${localeId}/${catalogName}:${location}`;
          assert.doesNotMatch(
            value,
            bidiControlPattern,
            `${valueLocation} contains an invisible bidi control character`,
          );
          assert.doesNotMatch(
            value,
            /\bbeta\b/iu,
            `${valueLocation} still presents a feature as Beta`,
          );
        },
      );
    }
  }
});

test("non-English catalogs do not copy long English prose", () => {
  for (const localeId of requestedLocaleIds.filter((id) => id !== "en")) {
    for (const catalogName of catalogNames) {
      const referenceStrings = flattenStrings(
        catalogs.get(`en/${catalogName}`),
      );
      const localizedStrings = flattenStrings(
        catalogs.get(`${localeId}/${catalogName}`),
      );

      for (const [location, referenceValue] of referenceStrings) {
        const referenceText = visibleText(referenceValue);
        const localizedText = visibleText(localizedStrings.get(location));
        const englishWordCount =
          referenceText.match(/[a-z]+(?:[-'][a-z]+)*/giu)?.length ?? 0;
        const isLongProse = referenceText.length >= 60 && englishWordCount >= 8;

        if (isLongProse) {
          assert.notEqual(
            localizedText,
            referenceText,
            `${localeId}/${catalogName}:${location} copies long English prose`,
          );
        }
      }
    }
  }
});
