export const sitePages = [
  { name: "home", file: "index.html" },
  { name: "privacy", file: "privacy.html" },
  { name: "terms", file: "terms.html" },
];

// Matches the 15 languages published by famiguru.com on 2026-10-30.
export const siteLocales = [
  {
    id: "en",
    lang: "en",
    hreflang: "en",
    outputDirectory: "",
    name: "English",
    label: "Language",
    ogLocale: "en_US",
    dir: "ltr",
  },
  {
    id: "ar",
    lang: "ar",
    hreflang: "ar",
    outputDirectory: "ar",
    name: "العربية",
    label: "اللغة",
    ogLocale: "ar_AR",
    dir: "rtl",
  },
  {
    id: "de",
    lang: "de",
    hreflang: "de",
    outputDirectory: "de",
    name: "Deutsch",
    label: "Sprache",
    ogLocale: "de_DE",
    dir: "ltr",
  },
  {
    id: "es",
    lang: "es",
    hreflang: "es",
    outputDirectory: "es",
    name: "Español",
    label: "Idioma",
    ogLocale: "es_ES",
    dir: "ltr",
  },
  {
    id: "fr",
    lang: "fr",
    hreflang: "fr",
    outputDirectory: "fr",
    name: "Français",
    label: "Langue",
    ogLocale: "fr_FR",
    dir: "ltr",
  },
  {
    id: "hi",
    lang: "hi",
    hreflang: "hi",
    outputDirectory: "hi",
    name: "हिन्दी",
    label: "भाषा",
    ogLocale: "hi_IN",
    dir: "ltr",
  },
  {
    id: "id",
    lang: "id",
    hreflang: "id",
    outputDirectory: "id",
    name: "Bahasa Indonesia",
    label: "Bahasa",
    ogLocale: "id_ID",
    dir: "ltr",
  },
  {
    id: "it",
    lang: "it",
    hreflang: "it",
    outputDirectory: "it",
    name: "Italiano",
    label: "Lingua",
    ogLocale: "it_IT",
    dir: "ltr",
  },
  {
    id: "ms",
    lang: "ms",
    hreflang: "ms",
    outputDirectory: "ms",
    name: "Bahasa Melayu",
    label: "Bahasa",
    ogLocale: "ms_MY",
    dir: "ltr",
  },
  {
    id: "nl",
    lang: "nl",
    hreflang: "nl",
    outputDirectory: "nl",
    name: "Nederlands",
    label: "Taal",
    ogLocale: "nl_NL",
    dir: "ltr",
  },
  {
    id: "pt",
    lang: "pt-BR",
    hreflang: "pt",
    outputDirectory: "pt",
    name: "Português",
    label: "Idioma",
    ogLocale: "pt_BR",
    dir: "ltr",
  },
  {
    id: "ru",
    lang: "ru",
    hreflang: "ru",
    outputDirectory: "ru",
    name: "Русский",
    label: "Язык",
    ogLocale: "ru_RU",
    dir: "ltr",
  },
  {
    id: "tr",
    lang: "tr",
    hreflang: "tr",
    outputDirectory: "tr",
    name: "Türkçe",
    label: "Dil",
    ogLocale: "tr_TR",
    dir: "ltr",
  },
  {
    id: "zh-CN",
    lang: "zh-CN",
    hreflang: "zh-Hans",
    outputDirectory: "zh",
    name: "简体中文",
    label: "语言",
    ogLocale: "zh_CN",
    dir: "ltr",
  },
  {
    id: "zh-TW",
    lang: "zh-TW",
    hreflang: "zh-Hant",
    outputDirectory: "zh-hant",
    name: "繁體中文",
    label: "語言",
    ogLocale: "zh_TW",
    dir: "ltr",
  },
];

export const siteOrigin = "https://saleslify-technologies.github.io/TransGuru/";

export function localePageUrl(locale, file) {
  const relative = locale.outputDirectory
    ? `${locale.outputDirectory}/${file}`
    : file;
  return new URL(
    file === "index.html" ? relative.replace(/index\.html$/, "") : relative,
    siteOrigin,
  ).href;
}

export function localePagePath(current, target, file) {
  const currentDirectory = current.outputDirectory;
  const prefix = currentDirectory ? "../" : "";
  if (current.id === target.id) return file;
  return `${prefix}${target.outputDirectory ? `${target.outputDirectory}/` : ""}${file}`;
}

export function createSitemap() {
  const urls = siteLocales.flatMap((locale) =>
    sitePages.map(
      (page) => `  <url><loc>${localePageUrl(locale, page.file)}</loc></url>`,
    ),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
