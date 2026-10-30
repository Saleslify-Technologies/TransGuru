# Product evidence

Reviewed on 2026-10-30 against the supplied sibling `TransGuru` app checkout. No app files were changed.

| Website content | Owning app source | Boundary |
| --- | --- | --- |
| iPhone to Android and Android to iPhone | `HANDOVER.md`; `App/app/src/main/java/com/transguru/phonetransfer/ui/v8/screens/V8Home.kt` | Flows are implemented; full device/version coverage is not claimed. |
| Android to Android | Owner status correction on 2026-10-30; `data/peer/`; `data/platform/AndroidPeerNet.kt`; `ui/v8/screens/V8A2a.kt` | Supported direction. The owner confirmed it is no longer Beta. |
| Android 7.0+ | `App/app/build.gradle.kts`, `minSdk = 24` | iPhone compatibility depends on the actual system and WhatsApp version. |
| USB OTG on the current app | `App/app/src/main/AndroidManifest.xml`, USB host requirement | The current app declares USB host as required for installation, including Android-to-Android users. iPhone routes also need a data-capable cable. |
| Chats, photos, video, voice, files, call history | `App/app/src/main/res/values/v8_strings.xml`; `doc/23-WhatsApp转机数据类型支持对比.html` | Exclusions are shown in the content section. Business metadata is not promised. |
| Direct device transfer | `data/peer/PeerWire.kt`; `data/platform/AndroidPeerNet.kt`; transfer pipelines | No cloud transfer server. No broader claim of zero internet activity. |
| Explicit log sharing | `ui/v8/screens/V8Account.kt` | User-initiated system share action. |
| Destination replacement | A2I implementation documents and data support table | No chat merge promise. Preserve original backups. |
| Downloads pending | No verified public store URL in source or release material | Do not derive a live store claim from the package ID. |

Visual references: user-provided full flow map; the shared “TransGuru 页面设计 · 清透” browser artifact; `design/v8-mirror/` brand assets and design language.

The site uses only safe brand assets from the app repository. Original device screenshots, backups, keys, user identifiers, logs, and internal comparison documents are not copied into the published site.

## Legal pages, 2026-10-30

Owner-supplied publishing identity: **Saleslify Technologies**. Owner-supplied privacy and support address: **devs.pesafy@gmail.com**. No address, registration number, governing jurisdiction, or court selection was invented.

The website now includes `privacy.html` and `terms.html`. The homepage footer, checklist explanation, privacy FAQ, and both document pages link to the relevant content. The app checkout was not modified; its existing support/privacy/terms callbacks still need public URLs after the site is deployed.

Additional source checks:

- `App/app/src/main/AndroidManifest.xml`: permissions, targeted package queries, private backup disabled, and system-gallery background process capability.
- `pipeline/Workspace.kt`, `data/store/MigrationStore.kt`, `data/store/MigrationMeta.kt`: public migration files and preview metadata can survive uninstall or clear-data operations.
- `domain/TrashDelete.kt`: the delete action renames the working tree aside and deletes it in the background; interrupted deletion is retried at startup. This is ordinary file deletion, not secure overwrite.
- `diag/DiagLog.kt`, `diag/DiagExport.kt`: local rotating logs and user-initiated system sharing. Logs can retain file paths and other identifying context despite selected store-build redaction.
- `data/ocr/KeyOcrPipeline.kt` and key selection/controller code: screenshot OCR and password/key use stay in the local migration path; source review does not prove the absence of SDK diagnostics.
- `App/app/build.gradle.kts`: bundled Google ML Kit Text Recognition 16.0.1. The policy distinguishes on-device image recognition from SDK technical metrics.

Primary provider documentation reviewed:

- [Google Play user-data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en): identity, privacy contact, access/use/sharing disclosure, security, retention, and deletion coverage.
- [ML Kit terms and privacy](https://developers.google.com/ml-kit/terms), [Android data disclosure](https://developers.google.com/ml-kit/android-data-disclosure): on-device inputs/outputs versus technical metrics. The current provider page describes current SDK practices; a release-specific network capture was not performed.
- [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection): hosted sites log visitor IP addresses for security.

The pages are source-grounded documents, not a certification that the app, store declarations, permission screens, and third-party license obligations have passed a legal or release review. Changes to SDKs, storage behavior, billing, or support processing require matching policy updates.

## English default and Chinese localization, 2026-10-30

The owner requested multilingual support and an English default for international visitors. The site now builds English at the root and Simplified Chinese under `zh/`. The shared source is in `templates/`; copy and interactive route data are in `locales/en/` and `locales/zh-CN/`. Generated HTML is not the source of truth.

All homepage content, dynamic route guides, preparation messages, accessibility labels, Privacy Policy, and Terms of Use are localized. Operator, email, dates, transfer restrictions, deletion behavior, and third-party disclosures are preserved across both versions. The English policy uses the unambiguous term “64-character encryption key.” No other locale support is claimed.

Language links use the corresponding page URL; the small shared script preserves the section and selected transfer direction. The path and optional route parameter represent these choices without cookies or browser storage. The website privacy section was updated in both languages to disclose URL-based choices and ordinary hosting requests.

Each page includes its own canonical URL and reciprocal English, Simplified Chinese, and English `x-default` links. See [Google Search Central guidance](https://developers.google.com/search/docs/specialty/international/localized-versions). The sitemap lists all six pages. No external translation API or automatic machine-translation overlay is used at runtime.


## Android-to-Android status correction, 2026-10-30

The owner confirmed that Android-to-Android is implemented and is no longer Beta. Current English and Chinese website copy, route labels, checklist, FAQ, and user terms use the supported status. Earlier Beta references in historical QA and concept records describe the earlier assessment and are superseded by this correction. Public app-download status is a separate release fact and was not changed by this status correction.

## Current website language matrix, 2026-10-30

The owner requested parity with famiguru.com's official language support. The live reference's Languages navigation and its locale registry were checked: English, Arabic, German, Spanish, French, Hindi, Indonesian, Italian, Malay, Dutch, Portuguese, Russian, Turkish, Simplified Chinese, and Traditional Chinese (15 entries). This supersedes the earlier two-language website scope above.

`site-locales.mjs` now controls all 15 variants, menus, reciprocal hreflang links, sitemap entries, and audit targets. English remains the root/default. The existing Simplified Chinese `/zh/` path is retained; Traditional Chinese uses `/zh-hant/`. Every variant contains home, privacy and terms pages, including localized dynamic guides, checklist/status copy and accessible labels. This website task makes no new claim about the app's own supported UI languages.

The owner-confirmed operator, email, dates, supported A2A status, download preparation status, permissions, transfer limits and privacy behavior remain fixed across translations. Automated contract tests preserve links, HTML structure, filesystem paths, identifiers, dates and placeholders. Native-script fonts are local and licensed, with script coverage and shaping verification recorded in `assets/fonts/SOURCE.md`.
