# Plus Jakarta Sans

- Family: Plus Jakarta Sans
- Style: normal
- Weight axis: 200–800 (`wght`; default 400)
- Subset: Latin
- Format: WOFF2
- File: `plus-jakarta-sans-latin-wght.woff2`
- Size: 27,348 bytes
- SHA-256: `153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79`

The font file is the Latin variable font served by Google Fonts CSS for Plus Jakarta Sans version 12:

- CSS endpoint: <https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap>
- Font source: <https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2>
- Upstream Google Fonts directory: <https://github.com/google/fonts/tree/main/ofl/plusjakartasans>

`OFL.txt` is the SIL Open Font License 1.1 copied from the official Google Fonts repository. Its SHA-256 is `995c7199cab65954f545996326755daee7b63cc6b42b06c13da1f9502ab08a99`.

Verification used FontTools to decode the WOFF2 file and inspect its `fvar`, `name`, and table directory. The single variable axis is `wght`, with minimum 200, default 400, and maximum 800.

### Plus Jakarta Sans Latin Extended

- Family: Plus Jakarta Sans
- Style: normal
- Weight axis: 200-800 (`wght`; default 400)
- Subset: Latin Extended
- Google Fonts Unicode range: `U+0100-02BA`, `U+02BD-02C5`, `U+02C7-02CC`, `U+02CE-02D7`, `U+02DD-02FF`, `U+0304`, `U+0308`, `U+0329`, `U+1D00-1DBF`, `U+1E00-1E9F`, `U+1EF2-1EFF`, `U+2020`, `U+20A0-20AB`, `U+20AD-20C4`, `U+2113`, `U+2C60-2C7F`, `U+A720-A7FF`
- Format: WOFF2
- File: `plus-jakarta-sans-latin-ext-wght.woff2`
- Size: 21,688 bytes
- SHA-256: `0303e02b53b0298fb26a0193941a2e8754f0f9a9fce50d90b178d8da3424873f`

This is the official Latin Extended variable font returned by the same Google Fonts v12 CSS endpoint and family configuration as the Latin file:

- CSS endpoint: <https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap>
- Font source: <https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko40yygg_vbd-E.woff2>

Both Plus Jakarta Sans files report internal version `2.071;gftools[0.9.30]` and the same `wght` axis. The original Latin subset contains Turkish dotless `ı`, but not `ğ`, `Ğ`, `İ`, `Ş`, or `ş`. The Latin Extended file contains those five missing glyphs. FontTools cmap verification confirmed that the union of the two files covers all 92 distinct Latin-script code points currently used by the English, German, French, Dutch, Italian, Spanish, Portuguese, Indonesian, Malay, and Turkish catalogs.

The existing `OFL.txt` applies to both Plus Jakarta Sans subset files. No additional license terms or reserved font names were introduced.

## Noto Sans Arabic

- Family: Noto Sans Arabic
- Style: normal
- Weight axis: 100-900 (`wght`; default 400)
- Width: fixed at 100 (`wdth` was instantiated at its normal value)
- Catalog subset: 44 Arabic code points used by `locales/ar/*.json`, plus the Arabic language label and 24 used punctuation, number, symbol, and spacing code points
- Catalog Unicode seed: `U+0020,U+0022,U+0028,U+0029,U+002D,U+002E,U+002F,U+0030,U+0031,U+0032,U+0033,U+0034,U+0035,U+0036,U+0037,U+0038,U+0039,U+003A,U+0040,U+007B,U+007C,U+007D,U+00A9,U+00B7,U+060C,U+061B,U+061F,U+0621,U+0622,U+0623,U+0624,U+0625,U+0626,U+0627,U+0628,U+0629,U+062A,U+062B,U+062C,U+062D,U+062E,U+062F,U+0630,U+0631,U+0632,U+0633,U+0634,U+0635,U+0636,U+0637,U+0638,U+0639,U+063A,U+0640,U+0641,U+0642,U+0643,U+0644,U+0645,U+0646,U+0647,U+0648,U+0649,U+064A,U+064B,U+064D,U+064F,U+0650`
- Format: WOFF2
- File: `noto-sans-arabic-arabic-wght.woff2`
- Size: 30,868 bytes
- SHA-256: `951d9ea34ea772fccd679f4a55d623ce860278a79ed1111dc37c3361de2e0282`

The source is Noto Sans Arabic version 2.012 from the official Google Fonts repository at commit `6157dfaa640ca5738b4d1a7070fe389c3036d7fc`:

- Upstream directory: <https://github.com/google/fonts/tree/6157dfaa640ca5738b4d1a7070fe389c3036d7fc/ofl/notosansarabic>
- Source TTF: <https://github.com/google/fonts/blob/6157dfaa640ca5738b4d1a7070fe389c3036d7fc/ofl/notosansarabic/NotoSansArabic%5Bwdth%2Cwght%5D.ttf>
- Source TTF SHA-256: `63111b5b2e074dd48cc67692e0a2726d86ee94c1c37fe8598257b7b4e87e869e`
- License: `OFL-Noto-Sans-Arabic.txt`
- License SHA-256: `07fc70bfeb985cc1a87a8587d0a0c80bab11c86c9dc3fd95b6f0cb332f983e96`

`locale-native-ar.woff2` is a static weight-400 subset of the same source for the language label `العربية`. It is 3,776 bytes with SHA-256 `302dd793373babf49169edcc30800c91a41f84b7baceee3037afa3681933f8f9`. Its internal family remains Noto Sans Arabic. CSS may expose it as `Locale Native Arabic`.

## Noto Sans Devanagari

- Family: Noto Sans Devanagari
- Style: normal
- Weight axis: 100-900 (`wght`; default 400)
- Width: fixed at 100 (`wdth` was instantiated at its normal value)
- Catalog subset: 59 Devanagari code points used by `locales/hi/*.json`, plus the Hindi language label and 27 used punctuation, number, symbol, and spacing code points
- Catalog Unicode seed: `U+0020,U+0022,U+0028,U+0029,U+002C,U+002D,U+002E,U+002F,U+0030,U+0031,U+0032,U+0033,U+0034,U+0035,U+0036,U+0037,U+0038,U+0039,U+003A,U+003B,U+003F,U+0040,U+007B,U+007C,U+007D,U+00A9,U+00B7,U+0901,U+0902,U+0903,U+0905,U+0906,U+0907,U+0908,U+0909,U+090F,U+0910,U+0911,U+0913,U+0914,U+0915,U+0916,U+0917,U+0918,U+091A,U+091B,U+091C,U+091D,U+091E,U+091F,U+0920,U+0921,U+0922,U+0923,U+0924,U+0925,U+0926,U+0927,U+0928,U+092A,U+092B,U+092C,U+092D,U+092E,U+092F,U+0930,U+0932,U+0935,U+0936,U+0937,U+0938,U+0939,U+093C,U+093E,U+093F,U+0940,U+0941,U+0942,U+0943,U+0947,U+0948,U+0949,U+094B,U+094C,U+094D,U+0964`
- Format: WOFF2
- File: `noto-sans-devanagari-devanagari-wght.woff2`
- Size: 38,412 bytes
- SHA-256: `437e8c12d8f03cc30b957b3c0684670099bedd3e6bff148b2993c088acd2b37e`

The source is Noto Sans Devanagari version 2.007 from the official Google Fonts repository at commit `6157dfaa640ca5738b4d1a7070fe389c3036d7fc`:

- Upstream directory: <https://github.com/google/fonts/tree/6157dfaa640ca5738b4d1a7070fe389c3036d7fc/ofl/notosansdevanagari>
- Source TTF: <https://github.com/google/fonts/blob/6157dfaa640ca5738b4d1a7070fe389c3036d7fc/ofl/notosansdevanagari/NotoSansDevanagari%5Bwdth%2Cwght%5D.ttf>
- Source TTF SHA-256: `14ec4af41f27482216d1c2229f417ff9b1425e1babb014e57d1d40d03229853e`
- License: `OFL-Noto-Sans-Devanagari.txt`
- License SHA-256: `a216f6f8d85c7228093e0ee5e258d9d377e6671f68acb4db1930b29583d0f331`

`locale-native-hi.woff2` is a static weight-400 subset of the same source for the language label `हिन्दी`. It is 2,736 bytes with SHA-256 `35e17786cac3e4dfe4bbc1a0fd21997aee794c3deb3bfa44bb6e469fe3c1b496`. Its internal family remains Noto Sans Devanagari. CSS may expose it as `Locale Native Devanagari`.

## Noto subset verification and rebuild rule

The four Noto files were produced with FontTools 4.60.1 and Brotli from the official variable TTF files. The main files retain only the `wght` axis. The label files are static 400 instances. FontTools verified the name, variation, character-map, GSUB, and GPOS tables after WOFF2 encoding.

The main files are deliberately catalog-locked, not general-purpose script fonts. Their coverage was generated from every visible string in `locales/ar/*.json` and `locales/hi/*.json` after removing HTML tags, plus `العربية` and `हिन्दी`. Latin letters continue through the CSS fallback stack. Rebuild both main files whenever an Arabic or Hindi catalog adds or changes visible text.

To preserve complex-script shaping while avoiding unused combinations, the rebuild process must:

1. Fix the upstream `wdth` axis at 100 with `fonttools varLib.instancer`, retaining `wght` 100-900.
2. Collect the catalog's script code points and every used Unicode punctuation, number, symbol, and space. The current exact lists are recorded above.
3. Strip HTML tags and Latin letters from the catalog strings, then run `hb-shape --trace` against the width-instantiated source. Capture standard output and standard error separately. Collect every `"g"` glyph name from both final output and intermediate trace output.
4. Run FontTools subsetting with the Unicode list, traced glyph list, `--layout-features='*'`, `--no-layout-closure`, `--glyph-names`, `--notdef-glyph`, `--recommended-glyphs`, and `--flavor=woff2`. The traced glyph list is required because Devanagari and Arabic shaping use intermediate glyphs that are not directly encoded.
5. Decode the WOFF2 result and compare `hb-shape --output-format=json` output against the width-instantiated upstream source for every script-bearing catalog string at `wght=100`, `400`, and `900`. The output must match exactly, including glyph names, clusters, advances, and offsets, and must contain no `.notdef` glyphs.

Current verification covered 365 unique Arabic and 363 unique Hindi script-bearing strings. All six source-versus-subset shaping comparisons passed exactly at weights 100, 400, and 900. The production files cover all 44 Arabic and 59 Devanagari code points currently present in their catalogs, as well as the two native language labels and all recorded punctuation.

The Arabic font has 147 encoded cmap entries and the Hindi font has 90. These totals are larger than their 68 and 86 catalog seeds because traced shaping glyphs can retain equivalent presentation-form or compatibility mappings. Those additional mappings are part of the verified glyph closure, not extra broad-script coverage.
