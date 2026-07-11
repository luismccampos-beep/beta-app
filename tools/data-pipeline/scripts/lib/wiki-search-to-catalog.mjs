/**
 * Converte resultados de search-destinos-sem-hotel-wiki → campos de destino + hotéis.
 */
import { translateText } from './wiki-translate.mjs';

const HOTEL_RE =
  /hotel|hôtel|hostel|resort|motel|inn|pousada|alojamento|khách sạn|酒店|ホテル|호텔|โรงแรม|होटल|হোটেল|ஹோட்டல்|فندق|отель|готель|מלון|pension|gasthof|auberge|albergue|guesthouse|ryokan/i;

const WV_LISTING_RE =
  /hotel|hostel|pousada|guesthouse|motel|inn|resort|pension|gîte|auberge|gasthof|albergue|ryokan|bed and breakfast|b&b|durma|sleep|übernachtung|hébergement|alojamento/i;

/**
 * @param {object} row — entrada de destinos-sem-hotel-wiki-search.json
 */
export async function buildDestinationWikiFields(row) {
  const extracts = row.results?.multilingual?.extracts ?? {};
  const hits = row.results?.wikipedia ?? {};

  let resumo = extracts.pt?.extract ?? null;
  let url = extracts.pt?.url ?? extracts.en?.url ?? null;
  let resumoSource = resumo ? 'wikipedia-pt' : null;

  if (!resumo && extracts.en?.extract) {
    resumo = extracts.en.extract;
    url = extracts.en.url ?? url;
    resumoSource = 'wikipedia-en';
  }

  for (const lang of row.queries?.localLangs ?? []) {
    if (resumo) break;
    const ex = extracts[lang]?.extract;
    if (ex) {
      resumo = ex;
      url = extracts[lang].url ?? url;
      resumoSource = `wikipedia-${lang}`;
    }
  }

  if (!resumo && process.env.LIBRETRANSLATE_URL) {
    const seed =
      extracts.vi?.extract ||
      extracts.zh?.extract ||
      extracts.ja?.extract ||
      extracts.th?.extract ||
      extracts.hi?.extract ||
      extracts.en?.extract;
    const from =
      extracts.vi?.extract ? 'vi' : extracts.zh?.extract ? 'zh' : extracts.en?.extract ? 'en' : 'auto';
    if (seed) {
      const tr = await translateText(seed, from, 'pt');
      if (tr) {
        resumo = tr;
        resumoSource = `libretranslate-${from}`;
      }
    }
  }

  const regional = row.queries?.regionalLangs?.wiki ?? ['de', 'fr', 'it', 'es', 'ru', 'pl'];
  if (!resumo) {
    for (const lang of ['pt', 'en', ...regional, ...(row.queries?.localLangs ?? [])]) {
      const ex = extracts[lang]?.extract;
      if (ex) {
        resumo = ex;
        url = extracts[lang]?.url ?? url;
        resumoSource = `wikipedia-${lang}`;
        break;
      }
    }
  }

  if (!resumo) {
    for (const lang of ['pt', 'en', ...regional, ...(row.queries?.localLangs ?? [])]) {
      const hit = hits[lang]?.[0];
      if (hit?.snippet) {
        resumo = hit.snippet;
        url = hit.url ?? url;
        resumoSource = `search-snippet-${lang}`;
        break;
      }
    }
  }

  const wvHits = row.results?.wikivoyage ?? {};

  return {
    wikipedia_resumo: resumo,
    wikipedia_url: url,
    wiki_research: {
      at: row.fetchedAt ?? new Date().toISOString(),
      resumoSource,
      topHits: Object.fromEntries(
        Object.entries(hits).map(([lang, arr]) => [lang, arr?.[0]?.title ?? null]),
      ),
      topWikivoyageHits: Object.fromEntries(
        Object.entries(wvHits).map(([lang, arr]) => [lang, arr?.[0]?.title ?? null]),
      ),
      extracts: Object.fromEntries(
        Object.entries(extracts).map(([lang, ex]) => [
          lang,
          { title: ex.title, url: ex.url, via: ex.via },
        ]),
      ),
      langs: row.results?.langs ?? row.queries?.wikiLangs,
    },
  };
}

/**
 * @param {object} row
 * @param {number} max
 */
export function hotelCandidatesFromWikiRow(row, max = 5) {
  const seen = new Set();
  /** @type {object[]} */
  const out = [];

  const push = (c) => {
    const k = `${c.source}|${fold(c.nome)}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push(c);
  };

  const extracts = row.results?.multilingual?.extracts ?? {};
  for (const [lang, ex] of Object.entries(extracts)) {
    if (!ex?.title || !HOTEL_RE.test(ex.title)) continue;
    push({
      nome: ex.title,
      description: ex.extract ?? null,
      estrelas: 3,
      preco_por_noite: 90,
      comodidades: ['wifi'],
      source: `wikipedia-${lang}`,
      wiki_url: ex.url ?? null,
      wiki_lang: lang,
    });
  }

  for (const [lang, hits] of Object.entries(row.results?.wikipedia ?? {})) {
    for (const hit of hits ?? []) {
      if (out.length >= max) break;
      if (!HOTEL_RE.test(hit.title) && !HOTEL_RE.test(hit.snippet ?? '')) continue;
      push({
        nome: hit.title,
        description: hit.snippet ?? null,
        estrelas: 3,
        preco_por_noite: 90,
        comodidades: ['wifi'],
        source: `wikipedia-search-${lang}`,
        wiki_url: hit.url ?? null,
        wiki_lang: lang,
      });
    }
  }

  for (const [lang, hits] of Object.entries(row.results?.wikivoyage ?? {})) {
    for (const hit of hits ?? []) {
      if (out.length >= max) break;
      if (!WV_LISTING_RE.test(hit.title) && !WV_LISTING_RE.test(hit.snippet ?? '')) continue;
      if (/^Sleep$|^Eat$|^See$|^Do$/i.test(hit.title)) continue;
      push({
        nome: hit.title,
        description: hit.snippet ?? null,
        estrelas: 3,
        preco_por_noite: 85,
        comodidades: ['wifi'],
        source: `wikivoyage-${lang}`,
        wiki_url: hit.url ?? null,
        wiki_lang: lang,
      });
    }
  }

  return out.slice(0, max);
}

/** @param {string} s */
function fold(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}
