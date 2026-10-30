import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./audit.mjs", import.meta.url));
for (const [name, environment, message] of [
  [
    "unknown locale",
    { AUDIT_LOCALES: "not-a-locale", AUDIT_PAGES: "home" },
    /AUDIT_LOCALES contains unknown locale IDs/,
  ],
  [
    "unknown page",
    { AUDIT_LOCALES: "en", AUDIT_PAGES: "not-a-page" },
    /AUDIT_PAGES contains unknown page names/,
  ],
]) {
  test(`audit rejects ${name} instead of silently skipping checks`, () => {
    const result = spawnSync(process.execPath, [script], {
      encoding: "utf8",
      env: { ...process.env, ...environment },
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
  });
}
