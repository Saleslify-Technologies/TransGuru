# Design QA

Date: 2026-10-30

final result: passed

## Evidence

- Source visual: `docs/design-concept.png` (756 × 2079 pixels), derived from the user-provided flow map and clear teal app reference.
- Implementation: `docs/desktop-full.jpg` (1440 × 4039 pixels), `docs/desktop-preview.jpg` (1440 × 1000 pixels), and `docs/mobile-preview.jpg` (390 × 844 pixels).
- Combined comparison: `docs/design-comparison.jpg`. Source and implementation were normalized to 600 pixels wide with their aspect ratios preserved, then placed side by side.
- Preview: `http://127.0.0.1:4173/TransGuru/`.
- State: default iPhone-to-Android route, collapsed FAQ, closed preparation dialog.
- Browser: Codex in-app browser. Desktop CSS viewport 1440 × 1000; saved image density 1×. Mobile CSS viewport 390 × 844, density 1×. Horizontal overflow checks also covered 320 and 768 CSS pixels.
- Focused evidence: the full-size desktop first viewport and mobile first viewport were inspected separately. The complete page comparison checks section rhythm and visual hierarchy. Mobile route, selected keyboard focus, and checklist states were also inspected in the browser.

## Findings and fixes

No unresolved P0, P1, or P2 findings remain in the website review.

1. Initial desktop navigation showed the mobile menu button because the shared icon-button rule overrode its display rule. Fixed the cascade and captured the updated desktop screenshot. The desktop menu is now hidden and the mobile menu remains available.
2. The hero asset had a hard rectangular edge. Added the rounded image treatment used by the site's visual system, then recaptured the desktop and mobile views.
3. Added a no-JavaScript navigation fallback and removed inactive enhanced controls from that mode. Basic content and native FAQ details remain available. This fallback was inspected in source, not tested with JavaScript disabled in the browser.
4. Extended static link checks to responsive image candidates and made the audit report both device profiles even after one failure.
5. Product source review corrected the current app's USB OTG installation requirement for all Android devices and clarified that the app establishes the local hotspot connection. The site does not ask users to enable system hotspot sharing.

## Fidelity surfaces

- Typography: bold Chinese display headings and compact UI labels preserve the source hierarchy. System fonts avoid a remote font dependency. All tested widths retain readable headings without clipping.
- Spacing and layout: the implementation retains the split hero, three-way route selector, asymmetric memory section, FAQ, and dark closing panel. Mobile stacks these regions without horizontal overflow. Desktop navigation and content remain aligned to the same container.
- Color: ivory `#f8f9f5`, deep teal `#105c61`, pale mint `#edf3ee`, and restrained amber focus states. Lighthouse accessibility scores are recorded separately; focus is visibly distinct.
- Images: supplied brand masters, generated raster artwork, and licensed Phosphor icons. No private app screenshots or real customer data are used. Images have dimensions and responsive sizing. The hero is explicitly labeled as a concept.
- Content: the headline and warm memory theme preserve the direction. Product facts govern route steps, Beta status, download availability, privacy wording, and destination replacement. No rating, speed, customer count, or compatibility guarantee is invented.

## Intentional differences from the concept

This is a new marketing site based on app references, not a pixel clone of an existing website. The generated board establishes the visual direction. The route's decorative phone graphic is replaced by useful preparation requirements. The closing image is replaced by the supplied brand mark. The site adds precise privacy and compatibility content. These differences serve the requested usable official website and its performance budget.

## Interaction checks

- Three route tabs update titles, counts, requirements, warnings, and steps.
- Left/right arrow navigation selects the next route and moves focus.
- Full-step disclosure expands and collapses.
- Preparation dialog starts with the selected route.
- Checkboxes update the live progress summary; all four items reach the completed state.
- Changing checklist direction uses separate state. No state is transmitted or persisted.
- Escape closes the dialog and returns focus to its trigger.
- Mobile menu opens, navigates, and closes.
- Privacy link opens the correct FAQ. Content-exclusion disclosure opens.
- Desktop console inspection returned no warnings or errors.
- Local images loaded successfully. Page width equals viewport width at 320, 390, and 768 pixels.

## Limits

- Browser checks cover Chromium. Safari, Firefox, screen-reader operation, and real-device interaction were not tested.
- The source app's migration behavior is outside this website QA scope.
- Production Pages deployment and field performance have not been verified.

## Implementation checklist

- [x] Responsive site and working interactions
- [x] Source-grounded product claims
- [x] Static asset and link checks
- [x] Mobile and desktop Lighthouse gate
- [x] Source-versus-render visual comparison
- [ ] Enable GitHub Pages and publish the reviewed commit
- [ ] Add the verified app store link and approved legal/support content when available

## High-definition revision — 2026-10-30

final result: passed

The user requested a sharper, more refined image and an overall quality pass. The earlier screenshots above are the initial baseline. Current review evidence is `/tmp/transguru-quality-v2/desktop-after.jpg` (1440 × 1000), `/tmp/transguru-quality-v2/mobile-after.jpg` (390 × 844), and `/tmp/transguru-quality-v2/retina-after.jpg` (native 2× browser capture). `/tmp/transguru-quality-v2/comparison.jpg` places the before and after desktop views together at the same scale.

Resolved findings:

- The old hero capped raster width at 1100 pixels while desktop Retina rendering needed about 1446. The revised composition removes oversized image layout; native 2× browser validation measured a 658.1 CSS-pixel slot, requiring 1317 physical pixels, and confirmed the 1448-pixel AVIF was loaded. No artificial upscale is used.
- Image Gen replaced the soft-focus hero with a more precise product illustration. Larger sans-serif screen labels replace tiny chat text. Glass edges, cards, and the coastal image have clearer detail. The warm ivory/deep teal direction remains.
- Responsive AVIF plus high-quality WebP alternatives provide 640/960/1448-pixel hero candidates. The lazy memory photo now includes a native 1122-pixel candidate rather than stopping at 720 pixels.
- Removed multiply blending, aligned the hero to its grid, and refined borders and shadows. System font rendering, larger supporting text, and stronger muted text improve the rest of the page.
- The source link checker now handles multiline picture/source srcset values. An isolated regression test proves that a missing high-resolution candidate fails validation and a complete set passes. The test is included in the check/audit gate.

Checks passed: 320px and 390px mobile width without horizontal overflow; mobile navigation; route switching; preparation dialog and Escape dismissal; native support disclosure; no browser console warnings/errors; responsive image candidate loading; static links; regression test. Lighthouse remains mobile 99/100/100/100 and desktop 100/100/100/100. Current report and source hashes are in `docs/quality-results.json`.

This remains an illustrative screen, not an exact app screenshot. Browser coverage remains Chromium; no new Safari or Firefox claim is made. No commit, push, or deployment was performed.

## Legal document pages, 2026-10-30

final result: passed

Added independent privacy-policy and user-terms pages in the site's existing typography, color, spacing, and footer system. The owner supplied the operator and contact email. Privacy disclosures were checked against current app source and official provider documentation. The terms preserve statutory rights and avoid inventing a jurisdiction, pricing model, or compatibility guarantee.

Both pages have desktop side navigation, a mobile contents list, accessible headings, cross-document links, support mail links, and a print layout. Homepage footer and privacy FAQ link to the new pages. At 320px and 390px, neither document creates horizontal page overflow; data tables scroll within their labeled, keyboard-focusable regions. A keyboard arrow scroll was exercised on the permission table. Page identity, contents anchors, homepage-to-policy navigation, policy-to-terms navigation, and browser console were checked. No console warnings or errors were observed.

Evidence: `/tmp/transguru-legal-qa/privacy-desktop.jpg`; mobile document layout and 320px table behavior were also inspected in the in-app browser. New pages are a typography-based extension of the existing site, so the site's token system is the visual reference. No generated imagery was needed.

Final Lighthouse gate covers all three pages in mobile and desktop profiles. Privacy and terms each scored 100 in all four categories on both profiles; home scored 99/100/100/100 mobile and 100/100/100/100 desktop. Source hashes and report times are in `docs/quality-results.json`. Static links and the responsive-image regression test passed. Browser coverage remains Chromium.

Website pages are complete locally. App callbacks and deployment were not changed in this task.

## English default and bilingual pages, 2026-10-30

final result: passed

English is now the default at the root; Simplified Chinese is at `zh/`. The common templates and locale catalogs preserve the existing ivory/teal layout and source-grounded product boundaries. English headings, supporting copy, and native language links were reviewed in the rendered page. Both legal documents were translated with matching keys, HTML structure, dates, operator, email, paths, and obligations. English punctuation checks passed for all four catalogs.

Evidence: `/tmp/transguru-i18n-qa/english-desktop.jpg` (1440 × 1000) and `/tmp/transguru-i18n-qa/english-mobile.jpg` (390 × 844). Existing Chinese screenshots are the visual baseline. Mobile English copy was checked for wrapping; a missing space where a hidden line break joined two sentences was corrected. Both languages' home/legal pages were checked at 320px without horizontal overflow. No browser console warnings/errors or missing localized images were observed.

Interaction proof: English Android-to-iPhone route → Chinese preserves the route; Chinese → English restores the same selection. English checklist checkbox updates the English status. Mobile English menu navigates and closes. Android-to-Android full stages expand in English. English Privacy Policy at `#retention` → Chinese preserves the page and section. Chinese Terms of Use → English loads the matching document. The final preview opens in English.

Static build tests reject missing values, residual untranslated English catalog content, and broken counterparts/fragments. Published links and source assets pass validation. Six pages each pass mobile and desktop Lighthouse: homepage mobile performance 99 in both languages; every other category and legal-page score is 100. Current report times and source hashes are in `docs/quality-results.json`.

Language choice uses native URLs without cookies or browser storage; both policies explain the optional transfer-direction URL parameter. The build emits canonical, reciprocal hreflang, and English x-default links. Browser verification remains Chromium; a browser run with JavaScript disabled was not performed, but generated language links and localized body content are present without runtime rendering.

## FamiGuru-inspired visual and motion redesign, 2026-10-30

final result: passed

This is a historical QA snapshot. A later owner-approved cleanup removed the scene caption, visible pause control, footer language grid, and footer disclaimer. The current scene floats once for four seconds; motion tests now cover page visibility and reduced-motion preferences. Language selection remains in the header, beside the preparation button. Copyright uses TransGuru in all locales.

Reference: the owner's live https://famiguru.com/ homepage, captured in the in-app browser at `/tmp/transguru-redesign/famiguru-hero.jpg` and `famiguru-features.jpg`. The new complete direction is `docs/design-direction-v3.png`; the focused hero target is `docs/design-hero-v3.png`. Both were inspected with the rendered implementation, including a direct combined comparison. This task adapts the reference's design methods to TransGuru; it is not a pixel clone.

Implementation evidence: `/tmp/transguru-redesign/desktop-final.jpg` (1440 × 1260 CSS viewport, 1× capture), `/tmp/transguru-redesign/full-page-final.jpg`, `/tmp/transguru-redesign/hero-preview.jpg` (top-of-page crop including the full product stage), `/tmp/transguru-redesign/chinese-mobile-final.jpg` (390 × 844). `/tmp/transguru-redesign/comparison.jpg` normalizes the complete concept and implementation to 560 pixels wide, preserving their aspect ratios. The full-page comparison uses paused motion so every progressive reveal is visible. The live handoff has motion running. Native 2× desktop and 320px mobile widths were also checked.

Five fidelity surfaces:

- Typography: local Plus Jakarta Sans variable font, system Chinese fallback, assertive centered headline, warm native underline, compact section labels, and readable guide copy. The route heading was adjusted to two lines at desktop width.
- Spacing and hierarchy: floating capsule navigation; layered centered hero; desktop vertical route navigation with live detail panel; editorial memory image; full-width deep-teal privacy and closing regions; retained FAQ and legal footer.
- Color: original deep teal/ivory/mint brand with restrained sand accents. Header state changes, controls, and keyboard focus remain distinct.
- Assets: two independent transparent 1024 × 1536 phone masters and real licensed icons replace the flat hero poster. Responsive 480/900-pixel exports cover typical mobile and Retina rendering. The decorative backdrop uses a local generated asset and soft edge mask. No private app screenshots or real customer data are introduced.
- Content: English default and Chinese equivalents remain complete. Hero support text was shortened for a clear product story. Download-pending, Beta, overwrite/merge, permission, retention, and privacy boundaries remain intact. The rough concept's unsupported “no data stored” copy was not adopted.

Motion and interaction proof:

- Browser geometry changed during the entrance/float sequence. After Pause motion, the phone's viewport coordinate remained exactly unchanged across observations; Resume motion restored the running state.
- Hero `.is-in-view` is removed when navigating to FAQ, pausing offscreen floating. Header receives `.is-scrolled`.
- Desktop vertical route selection works with ArrowDown; route title, steps and requirements update. The detail groups transition with short native WAAPI transforms/opacity.
- Chinese mobile menu navigates and closes; the selected route opens its matching checklist; a checkbox updates the localized progress; Escape closes the dialog.
- Native FAQ and dialog entry transitions work. English remains the default and language links preserve the selected route and section.
- Reduced-motion initial state, live preference changes, and manual pause/resume are covered by isolated tests that execute the real controller. A native OS preference toggle was not performed.

Fixed findings: decorative-layer horizontal overflow at small widths; a hard stage-image edge; a three-line desktop route heading; skip link hidden by sticky navigation; and a fixed-height no-JavaScript navigation fallback. The latter was reviewed in source; a browser run with JavaScript disabled was not performed. Skip-link focus was exercised in the browser and visibly appears above the floating header.

Seven regression tests and static link checks pass. All six language/page combinations pass both Lighthouse profiles. Final affected-homepage reruns against the exact final build score mobile 96/100/100/100 and desktop 100/100/100/100 in both languages; legal pages remain 100 across all categories. Reports, timestamps, and source/build hashes are recorded separately. No browser console warnings or errors were observed.

Intentional deviations: the backdrop is a quiet paper floor rather than the concept's upright disk; source-approved factual guide text is longer than the concept copy; the real brand master is used in the closing region; the site uses exact existing compatibility/FAQ content. These are documented design/product choices, not unresolved fidelity defects. No actionable P0/P1/P2 visual or functional findings remain. Minor motion timing can be tuned from user feedback. Chromium was tested; Safari and Firefox were not.

## Full 15-language expansion, 2026-10-30

final result: passed

The owner requested the same languages as famiguru.com. The live reference list was read directly and matched to 15 registry entries. Current support covers 45 complete localized pages, with English as default, a native details-based language menu, current-language indication, and reciprocal SEO metadata. Arabic has server-rendered RTL; email/code/transfer labels are isolated where required. The shared visual design remains the source target; no new visual concept was needed for localization.

Evidence: `/tmp/transguru-15-locales-qa/language-menu-desktop.jpg` (1440 × 1000) shows the complete 15-language menu. Arabic and Hindi mobile screens and German long copy were inspected at 390px. `/tmp/transguru-15-locales-qa/narrow-layout.json` records live browser checks of all 45 pages at 320px, their real localized headings, metadata, content presence and widths. Every page has meaningful content with no horizontal page overflow; all homepages execute their localized dynamic configuration and build the expected eight initial guide stages.

Fixed observed issues: French privacy-link icon overflow at 320px; Dutch compound-word/grid intrinsic overflow at 320px; overly long German hero copy; complex-script and Turkish font gaps; render-blocking stylesheet and locale-data delivery costs. Narrow wrapping corrections are scoped below 360px. The two affected homepages were rechecked with Lighthouse after correction. CSS is bundled per page type, route configuration is after the visible document content, phone images use responsive AVIF/WebP, and offscreen native language labels are deferred without removing HTML content.

Interaction checks: opening and closing the 15-language menu; Escape returns focus to summary; RTL ArrowLeft selects the next visually-left route; French language switch retains Android-to-iPhone; Privacy Policy at `#retention` changes to Traditional Chinese on the same page and section. Default English and the original Simplified Chinese URLs remain valid.

73 project tests pass, including all locale contracts, protected HTML/URLs/identifiers/placeholders, no copied English prose fallback, no Beta regression, and rejection of invalid audit filters. All local published paths resolve. The full 90-run Lighthouse gate (45 pages × mobile/desktop) passed with every category at least 95. The post-correction French and Dutch homepage reruns passed as well. Exact scores and times are in `docs/quality-results.json`.

Remaining limits: browser QA used Chromium, not Safari/Firefox; native OS reduced-motion toggling and a browser run with JavaScript disabled were not repeated during this locale expansion. The selector retains native links/details for that fallback. App source and deployment were not changed. No actionable P0/P1/P2 findings remain.
