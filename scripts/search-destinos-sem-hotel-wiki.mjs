/**
 * Destinos sem hotel: Wikipedia + Wikivoyage em en/pt e idiomas locais (vi, zh, ja…).
 * Resumos multilíngues via langlinks (PT/EN a partir do artigo local quando existir).
 *
 *   npm run travel:search:destinos-sem-hotel-wiki -- --links-only
 *   npm run travel:search:destinos-sem-hotel-wiki -- --limit=50 --delay=400
 *   npm run travel:search:destinos-sem-hotel-wiki -- --resume
 *   npm run travel:search:destinos-sem-hotel-wiki -- --wiki-langs=en,pt,vi,zh
 *   npm run travel:search:destinos-sem-hotel-wiki -- --no-local-langs
 *   npm run travel:search:destinos-sem-hotel-wiki -- --extracts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { countryToEnglish, leafCityName } from './lib/cost-of-living-data.mjs';
import { wikipediaTitleFromDestination } from './lib/external-enrichment.mjs';
import {
  hotelQueryForLang,
  langsForDestination,
  wvSleepQueryForLang,
} from './lib/wiki-langs-by-destination.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const OUT_JSON = resolve(ROOT, 'data/hotels/destinos-sem-hotel-wiki-search.json');
const OUT_CSV = resolve(ROOT, 'data/hotels/destinos-sem-hotel-wiki-links.csv');
const STATE = resolve(ROOT, 'data/hotels/destinos-sem-hotel-wiki-search.fetch-state.json');
/** Lista fixa (949) — usar quando o bundle já tiver hotéis sintéticos em todos os destinos */
const SNAPSHOT_TSV = resolve(ROOT, 'data/hotels/destinos-sem-hotel-949.txt');

const UA = 'beta-app-travel/1.0 (destinos-sem-hotel wiki search; local dev)';

const wikiLangsArg = process.argv.find((a) => a.startsWith('--wiki-langs'));
const WIKI_LANGS_OVERRIDE = wikiLangsArg
  ? (wikiLangsArg.split('=')[1] ?? process.argv[process.argv.indexOf('--wiki-langs') + 1])
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : null;
const noLocalLangs = process.argv.includes('--no-local-langs');
const minimalLangs = process.argv.includes('--minimal-langs');
const fetchExtracts = process.argv.includes('--extracts');
const linksOnly = process.argv.includes('--links-only');
const resume = process.argv.includes('--resume');
const weakHotelsOnly = process.argv.includes('--weak-hotels');
const bundleEmptyOnly = process.argv.includes('--bundle-empty-only');
const fromFileArg = process.argv.find((a) => a.startsWith('--from-file'));
const FROM_FILE = fromFileArg
  ? resolve(ROOT, fromFileArg.split('=')[1] ?? process.argv[process.argv.indexOf('--from-file') + 1])
  : null;
const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg
  ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10)
  : Infinity;
const delayArg = process.argv.find((a) => a.startsWith('--delay'));
const DELAY_MS = delayArg
  ? parseInt(delayArg.split('=')[1] ?? process.argv[process.argv.indexOf('--delay') + 1], 10)
  : 350;
const maxLocalArg = process.argv.find((a) => a.startsWith('--max-local'));
const MAX_LOCAL = maxLocalArg
  ? parseInt(maxLocalArg.split('=')[1] ?? process.argv[process.argv.indexOf('--max-local') + 1], 10)
  : 3;

/** @param {string} s */
function wikiSlug(s) {
  return String(s ?? '')
    .trim()
    .replace(/ /g, '_');
}

/** @param {string} cityEn @param {string} countryEn */
function guessHotelCategory(cityEn, countryEn) {
  const city = wikiSlug(cityEn).replace(/,/g, '');
  if (!city) return null;
  if (countryEn) {
    const country = wikiSlug(countryEn).replace(/,/g, '');
    return [`Category:Hotels_in_${city}`, country ? `Category:Hotels_in_${country}` : null].filter(Boolean);
  }
  return [`Category:Hotels_in_${city}`];
}

/**
 * @param {string} host @param {string} search
 */
function specialSearchUrl(host, search) {
  return `https://${host}/wiki/Special:Search?${new URLSearchParams({ search })}`;
}

/**
 * @param {object} dest
 */
function resolveLangs(dest) {
  if (minimalLangs) {
    return langsForDestination(dest, {
      wikiLangsOverride: WIKI_LANGS_OVERRIDE,
      minimal: true,
      maxLocal: 0,
    });
  }
  return langsForDestination(dest, {
    wikiLangsOverride: WIKI_LANGS_OVERRIDE,
    maxLocal: noLocalLangs ? 0 : MAX_LOCAL,
    maxWiki: 8,
    maxWv: 6,
  });
}

/**
 * @param {object} dest
 * @param {ReturnType<typeof resolveLangs>} langs
 */
function buildQueries(dest, langs) {
  const leaf = leafCityName(dest.nome ?? '');
  const countryEn = langs.countryEn ?? countryToEnglish(dest.pais ?? '');
  const title = wikipediaTitleFromDestination(dest.nome ?? leaf);
  const countryLabel = countryEn && countryEn !== dest.pais ? countryEn : dest.pais;

  /** @type {Record<string, string>} */
  const hotelQueryByLang = {};
  for (const lang of langs.wiki) {
    hotelQueryByLang[lang] = hotelQueryForLang(lang, leaf, countryLabel ?? '');
  }

  /** @type {Record<string, string>} */
  const wvQueryByLang = {};
  for (const lang of langs.wv) {
    wvQueryByLang[lang] = wvSleepQueryForLang(lang, leaf);
  }

  return {
    leaf,
    countryEn,
    title,
    hotelQuery: hotelQueryByLang.en ?? hotelQueryByLang.pt,
    hotelQueryByLang,
    wvQuery: leaf,
    wvQueryByLang,
    wikiLangs: langs.wiki,
    wvLangs: langs.wv,
    localLangs: langs.local ?? [],
    regionalLangs: langs.regional ?? { wiki: [], wv: [] },
  };
}

/**
 * @param {object} dest
 * @param {ReturnType<typeof buildQueries>} q
 */
function buildLinks(dest, q) {
  /** @type {Record<string, string>} */
  const wikipedia_search = {};
  /** @type {Record<string, string>} */
  const wikivoyage_search = {};
  /** @type {Record<string, string>} */
  const wikivoyage_article = {};

  for (const lang of q.wikiLangs) {
    const host = `${lang}.wikipedia.org`;
    wikipedia_search[lang] = specialSearchUrl(host, q.hotelQueryByLang[lang] ?? q.hotelQuery);
  }
  for (const lang of q.wvLangs) {
    const host = `${lang}.wikivoyage.org`;
    wikivoyage_search[lang] = specialSearchUrl(host, q.wvQuery);
    wikivoyage_article[lang] = `https://${host}/wiki/${encodeURIComponent(q.title)}`;
  }

  const links = {
    wikipedia_search,
    wikivoyage_search,
    wikivoyage_article,
    wikipedia_search_en: wikipedia_search.en,
    wikipedia_search_pt: wikipedia_search.pt,
    wikivoyage_search_en: wikivoyage_search.en,
    wikivoyage_search_pt: wikivoyage_search.pt,
    wikivoyage_article_en: wikivoyage_article.en,
    wikivoyage_article_pt: wikivoyage_article.pt,
  };

  const cats = guessHotelCategory(q.leaf, q.countryEn);
  if (cats?.length) {
    links.wikipedia_categories = cats.map(
      (c) => `https://en.wikipedia.org/wiki/${encodeURIComponent(c)}`,
    );
  }
  if (dest.wikivoyageUrl) links.wikivoyage_bundle = dest.wikivoyageUrl;
  return links;
}

/**
 * @param {string} lang @param {string} search @param {number} limit
 */
async function mediaWikiSearch(lang, search, limit = 5) {
  const api = `https://${lang}.wikipedia.org/w/api.php`;
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: search,
    srlimit: String(limit),
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${api}?${params}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.query?.search ?? []).map((hit) => ({
    title: hit.title,
    snippet: hit.snippet?.replace(/<[^>]+>/g, '') ?? '',
    url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(hit.title.replace(/ /g, '_'))}`,
  }));
}

/**
 * @param {string} lang @param {string} title
 */
async function wvSearch(lang, query, limit = 5) {
  const api = `https://${lang}.wikivoyage.org/w/api.php`;
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    srlimit: String(limit),
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${api}?${params}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.query?.search ?? []).map((hit) => ({
    title: hit.title,
    snippet: hit.snippet?.replace(/<[^>]+>/g, '') ?? '',
    url: `https://${lang}.wikivoyage.org/wiki/${encodeURIComponent(hit.title.replace(/ /g, '_'))}`,
  }));
}

/**
 * @param {string} host @param {string} title
 */
async function wikiSitePageExists(host, title) {
  const api = `https://${host}/w/api.php`;
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${api}?${params}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) return false;
  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  return page && !('missing' in page);
}

/**
 * @param {string} lang @param {string} title
 */
async function fetchWikiExtract(lang, title) {
  const encoded = encodeURIComponent(title.replace(/ /g, '_'));
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const data = await res.json();
    const extract = data.extract?.trim();
    if (!extract) return null;
    return {
      lang,
      title: data.title ?? title,
      extract: extract.length > 800 ? `${extract.slice(0, 797)}…` : extract,
      url: data.content_urls?.desktop?.page,
    };
  } catch {
    return null;
  }
}

/**
 * @param {string} fromLang @param {string} title
 */
async function fetchLanglinks(fromLang, title) {
  const api = `https://${fromLang}.wikipedia.org/w/api.php`;
  const params = new URLSearchParams({
    action: 'query',
    prop: 'langlinks',
    titles: title,
    lllimit: '50',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${api}?${params}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) return {};
  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  if (!page?.langlinks) return {};
  /** @type {Record<string, string>} */
  const out = {};
  for (const ll of page.langlinks) {
    const code = ll.lang;
    if (code) out[code] = ll.title;
  }
  return out;
}

/**
 * Dado um artigo (qualquer língua), obtém resumos em pt, en e línguas locais via langlinks.
 * @param {string} seedLang
 * @param {string} seedTitle
 * @param {string[]} wantLangs
 */
async function fetchMultilingualExtracts(seedLang, seedTitle, wantLangs) {
  const langlinks = await fetchLanglinks(seedLang, seedTitle);
  await sleep(DELAY_MS);

  const targets = new Set([...wantLangs, 'pt', 'en']);
  targets.add(seedLang);

  /** @type {Record<string, object>} */
  const extracts = {};

  const seed = await fetchWikiExtract(seedLang, seedTitle);
  if (seed) extracts[seedLang] = { ...seed, via: 'direct' };

  for (const lang of targets) {
    if (lang === seedLang && extracts[seedLang]) continue;
    const linkedTitle = lang === seedLang ? seedTitle : langlinks[lang];
    if (!linkedTitle) continue;
    const ex = await fetchWikiExtract(lang, linkedTitle);
    if (ex) extracts[lang] = { ...ex, via: lang === seedLang ? 'direct' : 'langlink' };
    await sleep(DELAY_MS);
  }

  return { seedLang, seedTitle, langlinks, extracts };
}

/**
 * @param {object} dest
 */
async function fetchWikiResults(dest) {
  const langs = resolveLangs(dest);
  const q = buildQueries(dest, langs);
  const results = {
    wikipedia: {},
    wikivoyage: {},
    wikipedia_hotel_category: {},
    wikivoyage_article: {},
    langs,
  };

  for (const lang of q.wikiLangs) {
    const search = q.hotelQueryByLang[lang] ?? q.hotelQuery;
    results.wikipedia[lang] = await mediaWikiSearch(lang, search, 5);
    await sleep(DELAY_MS);
  }

  for (const lang of q.wvLangs) {
    const wvQ = q.wvQueryByLang?.[lang] ?? `${q.wvQuery} sleep hotel`;
    results.wikivoyage[lang] = await wvSearch(lang, wvQ, 5);
    results.wikivoyage_article[lang] = await wikiSitePageExists(`${lang}.wikivoyage.org`, q.title);
    await sleep(DELAY_MS);
  }

  const cats = guessHotelCategory(q.leaf, q.countryEn) ?? [];
  for (const cat of cats.slice(0, 2)) {
    results.wikipedia_hotel_category[cat] = await wikiSitePageExists('en.wikipedia.org', cat);
    await sleep(DELAY_MS);
  }

  if (fetchExtracts) {
    const prefer = ['pt', 'en', 'de', 'fr', 'it', 'es', 'ru', 'pl', ...(q.localLangs ?? [])];
    for (const lang of prefer) {
      const hit = results.wikipedia[lang]?.[0];
      if (hit?.title) {
        results.multilingual = await fetchMultilingualExtracts(lang, hit.title, q.wikiLangs);
        break;
      }
    }
  }

  const localHits = (q.localLangs ?? []).map((l) => ({
    lang: l,
    title: results.wikipedia[l]?.[0]?.title ?? null,
  }));
  results.summary = {
    has_wikipedia_hotel_category: Object.values(results.wikipedia_hotel_category).some(Boolean),
    wikivoyage_article_en: results.wikivoyage_article.en ?? false,
    wikivoyage_article_pt: results.wikivoyage_article.pt ?? false,
    top_wikipedia_hit: results.wikipedia.en?.[0]?.title ?? null,
    top_local_hits: localHits.filter((h) => h.title),
    extract_pt: results.multilingual?.extracts?.pt?.extract ?? null,
    extract_en: results.multilingual?.extracts?.en?.extract ?? null,
  };

  return { queries: q, results };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadBundle() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle:', BUNDLE);
    process.exit(1);
  }
  return JSON.parse(readFileSync(BUNDLE, 'utf8'));
}

function loadDestinosFromBundle(bundle, { emptyOnly = true, weakHotelsOnly: weak = false } = {}) {
  const countByDest = new Map();
  /** @type {Map<number, string[]>} */
  const fontesByDest = new Map();
  for (const h of bundle.hoteis ?? []) {
    countByDest.set(h.destino_id, (countByDest.get(h.destino_id) ?? 0) + 1);
    const f = h.fonte ?? h.source ?? '';
    if (!fontesByDest.has(h.destino_id)) fontesByDest.set(h.destino_id, []);
    fontesByDest.get(h.destino_id).push(f);
  }
  const weakFontes = new Set(['synthetic', 'liteapi']);

  return bundle.destinos.filter((d) => {
    const n = countByDest.get(d.id) ?? 0;
    if (weak) {
      if (n === 0) return false;
      const fonts = fontesByDest.get(d.id) ?? [];
      return fonts.length > 0 && fonts.every((f) => weakFontes.has(f));
    }
    if (emptyOnly) return n === 0;
    return true;
  });
}

/** @param {string} path @param {object} [bundle] */
function loadDestinosFromTsv(path, bundle = null) {
  const byId = bundle ? new Map(bundle.destinos.map((d) => [d.id, d])) : null;
  const text = readFileSync(path, 'utf8');
  const dests = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith('#')) continue;
    const [nome, pais, continente, id] = line.split('\t');
    if (!nome) continue;
    const numId = id ? parseInt(id, 10) : dests.length + 1;
    const fromBundle = byId?.get(numId);
    dests.push({
      ...(fromBundle ?? {}),
      id: numId,
      nome: nome ?? fromBundle?.nome,
      pais: pais ?? fromBundle?.pais ?? '',
      continente: continente ?? fromBundle?.continente ?? '',
    });
  }
  return dests;
}

/**
 * @param {{ source?: string, fromFile?: string | null } | null} stateMeta
 */
function resolveDestinosList(stateMeta = null) {
  if (resume && stateMeta?.source) {
    if (stateMeta.source === 'file' && stateMeta.fromFile) {
      return {
        destinos: loadDestinosFromTsv(stateMeta.fromFile, loadBundle()),
        source: 'file',
        fromFile: stateMeta.fromFile,
      };
    }
    if (stateMeta.source === 'weak-hotels') {
      const bundle = loadBundle();
      return { destinos: loadDestinosFromBundle(bundle, { weakHotelsOnly: true }), source: 'weak-hotels', fromFile: null };
    }
    if (stateMeta.source === 'snapshot') {
      return {
        destinos: loadDestinosFromTsv(SNAPSHOT_TSV, loadBundle()),
        source: 'snapshot',
        fromFile: SNAPSHOT_TSV,
      };
    }
  }

  if (FROM_FILE) {
    const bundle = loadBundle();
    return { destinos: loadDestinosFromTsv(FROM_FILE, bundle), source: 'file', fromFile: FROM_FILE };
  }

  const bundle = loadBundle();

  if (weakHotelsOnly) {
    const destinos = loadDestinosFromBundle(bundle, { weakHotelsOnly: true });
    return { destinos, source: 'weak-hotels', fromFile: null };
  }

  if (!bundleEmptyOnly) {
    const empty = loadDestinosFromBundle(bundle, { emptyOnly: true });
    if (empty.length > 0) {
      return { destinos: empty, source: 'bundle-empty', fromFile: null };
    }
    if (existsSync(SNAPSHOT_TSV)) {
      console.log(
        `Bundle: 0 destinos sem hotel (ex.: após enrich sintético). A usar snapshot ${SNAPSHOT_TSV}`,
      );
      return {
        destinos: loadDestinosFromTsv(SNAPSHOT_TSV, bundle),
        source: 'snapshot',
        fromFile: SNAPSHOT_TSV,
      };
    }
    const weak = loadDestinosFromBundle(bundle, { weakHotelsOnly: true });
    if (weak.length > 0) {
      console.log(
        `Bundle: 0 sem hotel; snapshot ausente. A usar --weak-hotels (${weak.length} destinos só synthetic/liteapi).`,
      );
      return { destinos: weak, source: 'weak-hotels', fromFile: null };
    }
  }

  const destinos = loadDestinosFromBundle(bundle, { emptyOnly: true });
  return { destinos, source: 'bundle-empty', fromFile: null };
}

function loadState() {
  if (!resume || !existsSync(STATE)) {
    return { doneIds: new Set(), rows: [], source: null, fromFile: null };
  }
  try {
    const s = JSON.parse(readFileSync(STATE, 'utf8'));
    return {
      doneIds: new Set(s.doneIds ?? []),
      rows: s.rows ?? [],
      source: s.source ?? null,
      fromFile: s.fromFile ?? null,
    };
  } catch {
    return { doneIds: new Set(), rows: [], source: null, fromFile: null };
  }
}

function saveState(doneIds, rows, source, fromFile) {
  writeFileSync(
    STATE,
    JSON.stringify(
      {
        doneIds: [...doneIds],
        rows,
        source,
        fromFile,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    'utf8',
  );
}

/** @param {string} s @param {number} max */
function trunc(s, max = 120) {
  const t = String(s ?? '').replace(/\s+/g, ' ');
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function writeCsv(rows) {
  const header = [
    'id',
    'nome',
    'pais',
    'wiki_langs',
    'local_langs',
    'hotel_query_vi',
    'hotel_query_zh',
    'wikipedia_search_en',
    'wikipedia_search_pt',
    'wikipedia_search_local_json',
    'wikivoyage_search_en',
    'wikivoyage_search_de',
    'wikivoyage_search_fr',
    'wikivoyage_search_json',
    'extract_pt',
    'extract_local_json',
  ];
  const lines = [header.join('\t')];
  for (const r of rows) {
    const langs = resolveLangs(r);
    const q = r.queries ?? buildQueries(r, langs);
    const links = r.links ?? buildLinks(r, q);
    const localSearch = {};
    const wvSearch = {};
    for (const lang of q.wikiLangs ?? []) {
      if (links.wikipedia_search?.[lang] && !['en', 'pt'].includes(lang)) {
        localSearch[lang] = links.wikipedia_search[lang];
      }
    }
    for (const lang of q.wvLangs ?? []) {
      if (links.wikivoyage_search?.[lang]) wvSearch[lang] = links.wikivoyage_search[lang];
    }
    const localExtracts = {};
    for (const lang of q.localLangs ?? []) {
      const ex = r.results?.multilingual?.extracts?.[lang]?.extract;
      if (ex) localExtracts[lang] = trunc(ex, 200);
    }
    lines.push(
      [
        r.id,
        r.nome,
        r.pais,
        (q.wikiLangs ?? []).join(','),
        (q.localLangs ?? []).join(','),
        q.hotelQueryByLang?.vi ?? '',
        q.hotelQueryByLang?.zh ?? '',
        links.wikipedia_search_en ?? links.wikipedia_search?.en,
        links.wikipedia_search_pt ?? links.wikipedia_search?.pt,
        JSON.stringify(localSearch),
        links.wikivoyage_search_en,
        links.wikivoyage_search?.de ?? '',
        links.wikivoyage_search?.fr ?? '',
        JSON.stringify(wvSearch),
        trunc(r.results?.summary?.extract_pt ?? r.results?.multilingual?.extracts?.pt?.extract),
        JSON.stringify(localExtracts),
      ]
        .map((c) => String(c ?? '').replace(/\t/g, ' '))
        .join('\t'),
    );
  }
  writeFileSync(OUT_CSV, lines.join('\n'), 'utf8');
}

async function main() {
  const prior = loadState();
  const { destinos, source, fromFile } = resolveDestinosList(
    resume ? { source: prior.source, fromFile: prior.fromFile } : null,
  );

  if (!destinos.length) {
    console.error(
      'Nenhum destino para pesquisar.\n' +
        '  • Gera snapshot: npm run travel:export:destinos-sem-hotel-snapshot\n' +
        '  • Ou: --from-file=data/hotels/destinos-sem-hotel-949.txt\n' +
        '  • Ou: --weak-hotels (só synthetic/liteapi no bundle)',
    );
    process.exit(1);
  }

  console.log(`Destinos a pesquisar: ${destinos.length} (fonte: ${source})`);
  if (!minimalLangs && !WIKI_LANGS_OVERRIDE) {
    console.log(
      'Idiomas: en+pt + regionais (de/fr/it/es/ru/pl) + locais (vi/zh/ja…). --minimal-langs = só en/pt.',
    );
  }
  if (fetchExtracts) console.log('Modo --extracts: resumos PT/EN via langlinks (+ idiomas locais).');

  const { doneIds, rows: existingRows } = prior;
  /** @type {Map<number, object>} */
  const byId = new Map(existingRows.map((r) => [r.id, r]));

  for (const dest of destinos) {
    const langs = resolveLangs(dest);
    const q = buildQueries(dest, langs);
    const links = buildLinks(dest, q);
    const base = { id: dest.id, nome: dest.nome, pais: dest.pais, continente: dest.continente, queries: q, links };
    byId.set(dest.id, { ...base, ...byId.get(dest.id) });
  }

  let processed = 0;
  if (!linksOnly) {
    for (const dest of destinos) {
      if (doneIds.has(dest.id)) continue;
      if (processed >= LIMIT) break;

      const base = byId.get(dest.id);
      try {
        const { results } = await fetchWikiResults(dest);
        byId.set(dest.id, { ...base, results, fetchedAt: new Date().toISOString() });
        doneIds.add(dest.id);
        processed += 1;
        const local = results.summary?.top_local_hits?.map((h) => `${h.lang}:${h.title}`).join(', ');
        if (processed <= 3 || processed % 10 === 0) {
          console.log(
            `  [${doneIds.size}/${destinos.length}] ${dest.nome} (${dest.pais}) langs=${results.langs?.wiki?.join('+')}${local ? ` → ${local}` : ''}`,
          );
        }
        if (processed % 10 === 0) {
          saveState(doneIds, [...byId.values()].filter((r) => r.results), source, fromFile);
        }
      } catch (e) {
        console.warn(`  skip id=${dest.id} ${dest.nome}:`, e instanceof Error ? e.message : e);
      }
    }
  }

  const allRows = [...byId.values()].sort((a, b) => a.id - b.id);
  writeCsv(allRows);
  console.log(`\nCSV: ${OUT_CSV}`);

  if (!linksOnly) {
    const withResults = allRows.filter((r) => r.results);
    writeFileSync(
      OUT_JSON,
      JSON.stringify(
        {
          meta: {
            generatedAt: new Date().toISOString(),
            total: destinos.length,
            fetched: doneIds.size,
            delayMs: DELAY_MS,
            localLangs: !noLocalLangs,
            extracts: fetchExtracts,
            source,
            fromFile,
          },
          destinos: withResults,
        },
        null,
        2,
      ),
      'utf8',
    );
    saveState(doneIds, withResults, source, fromFile);
    console.log(`JSON: ${OUT_JSON}`);
    if (doneIds.size < destinos.length) {
      const resumeArgs = [
        '--resume',
        '--limit=50',
        fetchExtracts ? '--extracts' : '',
        source === 'file' && fromFile ? `--from-file=${fromFile}` : '',
        source === 'weak-hotels' ? '--weak-hotels' : '',
      ]
        .filter(Boolean)
        .join(' ');
      console.log(`\nRetomar: npm run travel:search:destinos-sem-hotel-wiki -- ${resumeArgs}`);
    }
  } else {
    console.log('(links-only — CSV com URLs em todos os idiomas configurados)');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
