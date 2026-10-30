import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildSite, renderTemplate } from "./build.mjs";
import { checkPublishedDirectory } from "./check-links.mjs";
import { siteLocales, sitePages } from "./site-locales.mjs";

async function fixture(context, untranslated = false) {
  const project = await mkdtemp(path.join(os.tmpdir(), "transguru-i18n-"));
  context.after(() => rm(project, { recursive: true, force: true }));
  await mkdir(path.join(project, "templates"), { recursive: true });
  await mkdir(path.join(project, "assets", "icons"), { recursive: true });
  for (const name of ["translate", "caret-down", "check"])
    await writeFile(
      path.join(project, "assets", "icons", name + ".svg"),
      "fixture",
    );
  const template = `<html lang="{{locale}}" dir="{{direction}}"><head>{{seoLinks}}</head><body>
    {{languagePicker}}
    <h1 id="scope">{{page.title}}</h1><a href="privacy.html#scope">{{page.link}}</a>
    <script type="application/json" id="app-config">{{appConfig}}</script>
  </body></html>`;
  for (const page of sitePages)
    await writeFile(path.join(project, "templates", page.file), template);
  for (const locale of siteLocales) {
    const directory = path.join(project, "locales", locale.id);
    await mkdir(directory, { recursive: true });
    for (const page of sitePages)
      await writeFile(
        path.join(directory, page.name + ".json"),
        JSON.stringify({
          "page.title":
            untranslated && locale.id === "en"
              ? "尚未翻译"
              : `Title ${locale.id}`,
          "page.link": `Privacy ${locale.id}`,
        }),
      );
    await writeFile(
      path.join(directory, "app.json"),
      JSON.stringify({ closeMenu: `Close ${locale.id}` }),
    );
  }
  return project;
}

test("renderer rejects a missing localized value", () => {
  assert.throws(
    () =>
      renderTemplate("<h1>{{title}}</h1><p>{{body}}</p>", { title: "Title" }),
    /missing values: body/,
  );
});

test("build rejects untranslated Chinese copy in the English locale", async (context) => {
  const project = await fixture(context, true);
  await assert.rejects(
    buildSite({ projectDirectory: project }),
    /home English locale still contains Chinese text/,
  );
});

test("build emits 45 pages, reciprocal language links, RTL, and valid fragments", async (context) => {
  const project = await fixture(context);
  const output = path.join(project, "dist");
  await buildSite({ projectDirectory: project });
  for (const locale of siteLocales)
    for (const page of sitePages) {
      const html = await readFile(
        path.join(output, locale.outputDirectory, page.file),
        "utf8",
      );
      assert.ok(html.includes(`lang="${locale.lang}" dir="${locale.dir}"`));
      assert.equal((html.match(/data-language-switch/g) || []).length, 15);
      assert.equal((html.match(/hreflang="x-default"/g) || []).length, 1);
      assert.ok(html.includes('href="privacy.html#scope"'));
      assert.doesNotMatch(html, /{{[^}]+}}/);
    }
  const arabic = await readFile(
    path.join(output, "ar", "privacy.html"),
    "utf8",
  );
  assert.ok(arabic.includes('href="../de/privacy.html"'));
  assert.ok(arabic.includes('src="../assets/icons/translate.svg"'));
  const english = await readFile(path.join(output, "index.html"), "utf8");
  assert.ok(english.includes('<html lang="en" dir="ltr">'));
  const sitemap = await readFile(path.join(output, "sitemap.xml"), "utf8");
  assert.equal((sitemap.match(/<url>/g) || []).length, 45);
  assert.deepEqual((await checkPublishedDirectory(output)).errors, []);
});

test("build fails on a missing locale entry before publishing", async (context) => {
  const project = await fixture(context);
  await writeFile(
    path.join(project, "locales", "fr", "privacy.json"),
    JSON.stringify({ "page.title": "Titre" }),
  );
  await assert.rejects(
    buildSite({ projectDirectory: project }),
    /fr\/privacy locale keys differ.*page.link/,
  );
});
