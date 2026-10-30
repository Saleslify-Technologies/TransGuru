import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { checkPublishedDirectory } from "./check-links.mjs";

test("checks every candidate in a multiline picture srcset", async (context) => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "transguru-links-"));
  context.after(() => rm(fixture, { recursive: true, force: true }));

  await mkdir(path.join(fixture, "assets"));
  await writeFile(path.join(fixture, "assets", "hero-640.webp"), "fixture");
  await writeFile(
    path.join(fixture, "index.html"),
    `<picture>
      <source
        type="image/webp"
        srcset="
          assets/hero-640.webp 640w,
          assets/hero-1448.webp 1448w
        "
      >
      <img src="assets/hero-640.webp" alt="">
    </picture>`,
  );

  const missingResult = await checkPublishedDirectory(fixture);
  assert.deepEqual(missingResult.errors, [
    "index.html: missing target: assets/hero-1448.webp",
  ]);

  await writeFile(path.join(fixture, "assets", "hero-1448.webp"), "fixture");
  const validResult = await checkPublishedDirectory(fixture);
  assert.deepEqual(validResult.errors, []);
});
