# TransGuru website

A static product website for TransGuru. It introduces WhatsApp transfer routes and helps users prepare their devices.

## Local development

Use Node.js 24 and Chrome.

```sh
npm ci
npm run check
npm run preview
```

Open `http://127.0.0.1:4173/TransGuru/`. The preview serves `dist/`. Run `npm run build` and reload after source changes. `npm run check` also tests multiline responsive image references to prevent missing high-density assets.

```sh
npm run audit
```

This runs Lighthouse against the built site with mobile and desktop profiles. All four categories must score at least 95. Reports are saved under `.lighthouse/`. Chrome uses a temporary profile. The audit does not use an existing browser session.

## Project files

- `templates/`: shared HTML templates for the homepage, Privacy Policy, and Terms of Use.
- `locales/`: complete copy and dynamic route data for 15 languages. English is the default.
- `scripts/site-locales.mjs`: language registry shared by the build, language menu, sitemap and audits.
- `international.css`: language menu, long-text layouts, complex-script typography and Arabic RTL.
- `language.js`: native language links that preserve the page, section, and selected transfer route.
- `styles.css`: shared responsive styles and design tokens.
- `experience.css`: premium marketing layout, local font, layered product scene, and motion styles.
- `motion.js`: progressive scroll reveals, bounded parallax, page visibility handling, and reduced-motion support.
- `legal.css`: shared layout for the source-grounded legal pages. The build emits `privacy.html` and `terms.html` in each language.
- `app.js`: transfer route tabs, full steps, checklist state, and mobile navigation.
- `assets/`: local brand, generated images, and Phosphor icons.
- `scripts/`: allowlist build, local server, link check, and Lighthouse gate.
- `docs/`: design evidence and product claim sources. These files are not published.

No framework, external runtime dependency, remote font, analytics script, cookie, form submission, or cloud API is needed. Production CSS is bundled into one entry per page type; CSS and JavaScript are minified with esbuild during the static build. Checklist state stays in memory and resets on reload. Desktop artwork floats once for four seconds and respects the system reduced-motion setting. Phone-sized viewports use a stable scene without parallax observers or automatic animation. Desktop motion pauses while the page is hidden.

## Languages and content

The site supports the same 15 languages listed on famiguru.com on 2026-10-30: English, Arabic, German, Spanish, French, Hindi, Indonesian, Italian, Malay, Dutch, Portuguese (Brazil), Russian, Turkish, Simplified Chinese, and Traditional Chinese.

- English remains at `/TransGuru/`. Other languages use folders defined in `scripts/site-locales.mjs`.
- Existing Simplified Chinese URLs remain under `/TransGuru/zh/`; Traditional Chinese uses `/TransGuru/zh-hant/`.
- Every language has a homepage, Privacy Policy and Terms of Use, for 45 pages total. Dynamic guides, preparation checklists, accessibility labels and status messages are localized too.
- The root always opens in English. No location detection, automatic language redirect, language cookie or browser-storage preference is used.
- Native language links point to the same page. JavaScript also preserves the section and selected transfer direction. Native details menus and language links work without JavaScript.
- All localized page text is rendered at build time. Search engines do not need a translation overlay or client API.
- Each page has its own canonical and reciprocal `hreflang` links for all 15 languages; English is `x-default`. The sitemap is generated from the registry.
- Arabic is rendered with `dir="rtl"`; identifiers, email addresses and transfer selectors are isolated where they need LTR order. Arabic and Hindi use local Noto fonts. Small self-name fonts keep language menus readable without loading full script fonts on every page. Turkish uses a matching local Latin Extended font.

Edit markup in `templates/` and copy in the matching locale catalog. Keep dictionary keys stable and synchronized across languages. Catalogs contain trusted HTML fragments; preserve links, tag structure, IDs, placeholders and product facts. `app.json` supplies interactive route data and status messages. Do not edit generated `dist/` files. Review the font coverage/rebuild instructions in `assets/fonts/SOURCE.md` after changing Arabic or Hindi text.

`npm run check` verifies translation coverage, shapes, protected markup/URLs, default-language output, RTL metadata and local links. It prevents long English paragraphs from being copied as fallback translations and rejects stale Beta wording for Android-to-Android.

The full audit runs 45 pages in both device profiles, for 90 Lighthouse runs. Use scoped checks while investigating a known failure:

```sh
AUDIT_LOCALES=ar,hi AUDIT_PAGES=home npm run audit
```

Unknown filter values fail before starting Chrome. With no filters, every language and page is checked. CI uses a 15-language matrix after shared validation, and deployment requires every matrix job to pass the same 95-point gate.

## Publish to GitHub Pages

Repository: `git@github.com:Saleslify-Technologies/TransGuru.git`

Website URL: `https://saleslify-technologies.github.io/TransGuru/`

1. Enable **Settings → Pages → Build and deployment → Source → GitHub Actions** in the repository.
2. Commit and push the reviewed website to `main`.
3. The `Validate and deploy website` workflow installs locked dependencies, builds the site, checks local links and responsive image candidates, and audits both device profiles on all 45 localized pages.
4. Deployment runs only after all quality gates pass. Per-language Lighthouse JSON reports are retained as workflow artifacts for 14 days, including failed runs.

The build publishes only the listed site files and `assets/`. It excludes app source, `docs/`, dependencies, and audit results. All site asset paths work under the `/TransGuru/` project path. If the domain or repository name changes, update the canonical URL, Open Graph URLs, sitemap, robots file, and preview/audit base paths together.

## Release content

- No public store listing was verified. The site clearly states that public downloads are being prepared and links to this repository's releases page.
- Replace the release status with the verified store URL when the app is published. Update the FAQ and preparation dialog together.
- Android-to-Android is supported alongside iPhone-to-Android and Android-to-iPhone.
- Transfer is not advertised as merging existing destination chats. The Android-to-iPhone route explicitly describes replacement.
- The legal pages name Saleslify Technologies and `devs.pesafy@gmail.com`, supplied by the owner. They describe current app permissions, local retention, ML Kit diagnostics, GitHub Pages logs, and support requests.
- Connect the app's existing privacy, terms, and support callbacks to these public URLs after deployment; the app was not modified in this website task.
- Keep the policy, in-app disclosures, release build behavior, and store data declarations consistent when the app changes.

## Assets

Brand marks come from the supplied app design. Raster artwork was generated for this website and served as responsive AVIF with high-quality WebP fallbacks. The hero uses two transparent phone compositions, with 480- and 900-pixel exports made from 1024 × 1536 masters. Image descriptions identify these as interface concepts. Phosphor icons use the MIT license; see `assets/icons/LICENSE`. See `docs/assets.md` for source and generation details.

## Validation limits

Lighthouse scores describe controlled local lab runs, not production field data or a guarantee for all networks and devices. Run the audits against the public URL after deployment. The website review does not validate the app's real-device migration behavior.
