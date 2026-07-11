/**
 * Idiomas Wikipedia/Wikivoyage por destino (local + regionais + en/pt).
 */
import { countryToEnglish, fold } from './cost-of-living-data.mjs';

export const HOTEL_TERM = {
  en: 'hotel',
  pt: 'hotel',
  es: 'hotel',
  fr: 'hôtel',
  de: 'Hotel',
  it: 'hotel',
  nl: 'hotel',
  ru: 'отель',
  vi: 'khách sạn',
  zh: '酒店',
  ja: 'ホテル',
  ko: '호텔',
  th: 'โรงแรม',
  ar: 'فندق',
  hi: 'होटल',
  bn: 'হোটেল',
  ta: 'ஹோட்டல்',
  id: 'hotel',
  ms: 'hotel',
  tr: 'otel',
  pl: 'hotel',
  uk: 'готель',
  he: 'מלון',
  fa: 'هتل',
  sv: 'hotell',
};

/** Pesquisa Wikivoyage (secção Sleep / alojamento). */
export const WV_SLEEP_QUERY = {
  en: 'sleep hotel',
  pt: 'dormir hotel',
  es: 'dormir hotel',
  fr: 'dormir hébergement',
  de: 'schlafen hotel',
  it: 'dormire hotel',
  nl: 'slapen hotel',
  pl: 'nocleg hotel',
  ru: 'сон отель',
  sv: 'sova hotell',
  zh: '住宿 酒店',
};

export const WIKIVOYAGE_LANGS = new Set([
  'en',
  'pt',
  'es',
  'fr',
  'de',
  'it',
  'nl',
  'pl',
  'ru',
  'sv',
  'zh',
]);

const BASE_WIKI = ['en', 'pt'];
const BASE_WV = ['en', 'pt'];

/** Wikipedia extra por continente (além de local + en/pt). */
const WIKI_BY_CONTINENT = {
  europa: ['de', 'fr', 'it', 'pl', 'ru'],
  europe: ['de', 'fr', 'it', 'pl', 'ru'],
  america: ['es', 'de', 'fr'],
  américa: ['es', 'de', 'fr'],
  africa: ['fr', 'de', 'ar'],
  áfrica: ['fr', 'de', 'ar'],
  asia: ['de', 'fr', 'ru'],
  ásia: ['de', 'fr', 'ru'],
  oceania: ['de'],
  oceânia: ['de'],
  oceania: ['de'],
};

/** Wikivoyage extra por continente. */
const WV_BY_CONTINENT = {
  europa: ['de', 'fr', 'it', 'es'],
  europe: ['de', 'fr', 'it', 'es'],
  america: ['es', 'fr'],
  américa: ['es', 'fr'],
  africa: ['fr', 'de'],
  áfrica: ['fr', 'de'],
  asia: ['de', 'fr', 'zh'],
  ásia: ['de', 'fr', 'zh'],
  oceania: ['de'],
  oceânia: ['de'],
};

/** Reforço por país (fold). */
const WIKI_BY_COUNTRY = {
  alemanha: ['de'],
  germany: ['de'],
  franca: ['fr'],
  france: ['fr'],
  italia: ['it'],
  italy: ['it'],
  espanha: ['es'],
  spain: ['es'],
  polonia: ['pl'],
  poland: ['pl'],
  russia: ['ru'],
  ucrania: ['uk', 'ru', 'pl'],
  ukraine: ['uk', 'ru', 'pl'],
  brasil: ['pt'],
  brazil: ['pt'],
  portugal: ['pt'],
  argentina: ['es', 'it'],
  mexico: ['es'],
  mexico: ['es'],
  marrocos: ['fr', 'ar'],
  morocco: ['fr', 'ar'],
  egito: ['ar', 'fr'],
  egypt: ['ar', 'fr'],
  vietnam: ['vi', 'zh'],
  vietname: ['vi', 'zh'],
  tailandia: ['th'],
  thailand: ['th'],
  china: ['zh'],
  japao: ['ja'],
  japan: ['ja'],
  india: ['hi'],
  indonesia: ['id'],
  holanda: ['nl'],
  netherlands: ['nl'],
  suica: ['de', 'fr'],
  switzerland: ['de', 'fr'],
  austria: ['de'],
  belgica: ['nl', 'fr'],
  belgium: ['nl', 'fr'],
};

const WV_BY_COUNTRY = {
  alemanha: ['de'],
  germany: ['de'],
  franca: ['fr'],
  france: ['fr'],
  italia: ['it'],
  italy: ['it'],
  espanha: ['es'],
  spain: ['es'],
  polonia: ['pl'],
  poland: ['pl'],
  russia: ['ru'],
  brasil: ['pt'],
  brazil: ['pt'],
  portugal: ['pt'],
  argentina: ['es', 'it'],
  mexico: ['es'],
  mexico: ['es'],
  marrocos: ['fr'],
  morocco: ['fr'],
  egito: ['fr'],
  egypt: ['fr'],
  suica: ['de', 'fr'],
  switzerland: ['de', 'fr'],
  austria: ['de'],
  belgica: ['fr', 'nl'],
  belgium: ['fr', 'nl'],
};

export const LOCAL_WIKI_BY_COUNTRY = {
  vietnam: ['vi', 'zh'],
  vietname: ['vi', 'zh'],
  china: ['zh'],
  japan: ['ja'],
  japao: ['ja'],
  'coreia do sul': ['ko'],
  'south korea': ['ko'],
  thailand: ['th'],
  tailandia: ['th'],
  india: ['hi', 'bn'],
  indonesia: ['id'],
  malaysia: ['ms', 'zh'],
  malasia: ['ms', 'zh'],
  singapore: ['zh', 'ms'],
  singapura: ['zh', 'ms'],
  'hong kong': ['zh', 'en'],
  taiwan: ['zh'],
  russia: ['ru'],
  ukrania: ['ru', 'uk'],
  ukraine: ['uk', 'ru'],
  ucrania: ['uk', 'ru'],
  turkey: ['tr'],
  turquia: ['tr'],
  egypt: ['ar'],
  egito: ['ar'],
  morocco: ['ar', 'fr'],
  marrocos: ['ar', 'fr'],
  'united arab emirates': ['ar', 'en'],
  'emirados arabes unidos': ['ar', 'en'],
  israel: ['he'],
  iran: ['fa'],
  brazil: ['pt'],
  brasil: ['pt'],
  mexico: ['es'],
  mexico: ['es'],
  argentina: ['es'],
  spain: ['es'],
  espanha: ['es'],
  france: ['fr'],
  franca: ['fr'],
  germany: ['de'],
  alemanha: ['de'],
  italy: ['it'],
  italia: ['it'],
  netherlands: ['nl'],
  holanda: ['nl'],
  poland: ['pl'],
  polonia: ['pl'],
  sweden: ['sv'],
  suecia: ['sv'],
};

const LANG_PRIORITY = [
  'pt',
  'en',
  'de',
  'fr',
  'it',
  'es',
  'ru',
  'pl',
  'nl',
  'vi',
  'zh',
  'ja',
  'th',
  'ar',
  'hi',
  'ko',
  'sv',
  'uk',
  'tr',
  'id',
];

/**
 * @param {string[]} langs
 * @param {number} max
 */
function capLangs(langs, max) {
  const uniq = [...new Set(langs)];
  const sorted = uniq.sort((a, b) => {
    const ia = LANG_PRIORITY.indexOf(a);
    const ib = LANG_PRIORITY.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return sorted.slice(0, max);
}

/**
 * @param {string} pais
 * @param {string} [countryEn]
 * @param {string} [continente]
 */
function collectRegionalLangs(pais, countryEn, continente) {
  const keys = [fold(pais), fold(countryEn ?? ''), fold(continente ?? '')].filter(Boolean);
  /** @type {Set<string>} */
  const wiki = new Set();
  /** @type {Set<string>} */
  const wv = new Set();

  for (const k of keys) {
    for (const l of WIKI_BY_CONTINENT[k] ?? []) wiki.add(l);
    for (const l of WV_BY_CONTINENT[k] ?? []) wv.add(l);
    for (const l of WIKI_BY_COUNTRY[k] ?? []) wiki.add(l);
    for (const l of WV_BY_COUNTRY[k] ?? []) wv.add(l);
  }

  return { wiki: [...wiki], wv: [...wv] };
}

export function localWikiLangsForCountry(pais, countryEn) {
  const keys = [fold(pais), fold(countryEn ?? '')].filter(Boolean);
  const out = new Set();
  for (const k of keys) {
    for (const lang of LOCAL_WIKI_BY_COUNTRY[k] ?? []) out.add(lang);
  }
  return [...out];
}

/**
 * @param {object} dest
 * @param {{ wikiLangsOverride?: string[] | null; maxLocal?: number; maxWiki?: number; maxWv?: number; minimal?: boolean }} [opts]
 */
export function langsForDestination(dest, opts = {}) {
  const {
    wikiLangsOverride = null,
    maxLocal = 3,
    maxWiki = 8,
    maxWv = 6,
    minimal = false,
  } = opts;

  if (wikiLangsOverride?.length) {
    const wiki = [...new Set(wikiLangsOverride)];
    const wv = wiki.filter((l) => WIKIVOYAGE_LANGS.has(l));
    return { wiki, wv: wv.length ? wv : ['en'], local: [], countryEn: countryToEnglish(dest.pais ?? ''), source: 'cli' };
  }

  const countryEn = countryToEnglish(dest.pais ?? '');
  const local = localWikiLangsForCountry(dest.pais ?? '', countryEn).slice(0, maxLocal);

  if (minimal) {
    return {
      wiki: capLangs([...BASE_WIKI, ...local], maxWiki),
      wv: capLangs([...BASE_WV, ...local.filter((l) => WIKIVOYAGE_LANGS.has(l))], maxWv),
      local,
      countryEn,
      regional: { wiki: [], wv: [] },
      source: 'minimal',
    };
  }

  const regional = collectRegionalLangs(dest.pais ?? '', countryEn, dest.continente ?? '');
  const wiki = capLangs([...BASE_WIKI, ...regional.wiki, ...local], maxWiki);
  const wv = capLangs(
    [...BASE_WV, ...regional.wv, ...local.filter((l) => WIKIVOYAGE_LANGS.has(l))].filter((l) =>
      WIKIVOYAGE_LANGS.has(l),
    ),
    maxWv,
  );

  return {
    wiki,
    wv: wv.length ? wv : ['en'],
    local,
    regional,
    countryEn,
    source: 'auto',
  };
}

/**
 * @param {string} lang @param {string} leaf
 */
export function wvSleepQueryForLang(lang, leaf) {
  const extra = WV_SLEEP_QUERY[lang] ?? WV_SLEEP_QUERY.en;
  return `${leaf} ${extra}`;
}

/**
 * @param {string} lang @param {string} leaf @param {string} countryLabel
 */
export function hotelQueryForLang(lang, leaf, countryLabel) {
  const term = HOTEL_TERM[lang] ?? HOTEL_TERM.en;
  return [leaf, countryLabel, term].filter(Boolean).join(' ');
}
