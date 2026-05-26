/**
 * Lookup hotéis no hotel-index.json (nome, artigo fuzzy, geo).
 */
import { fold } from './cost-of-living-data.mjs';
import { leafCityName } from './destination-fix.mjs';

const GEO_NEIGHBORS = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

/**
 * @param {string} nome
 */
export function destKeys(nome) {
  const base = nome.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  const keys = new Set([fold(base), fold(nome)]);
  const leaf = base.split(/[,|/]/)[0]?.trim();
  if (leaf) keys.add(fold(leaf));
  return [...keys].filter((k) => k.length > 1);
}

/**
 * @param {object} dest
 * @param {object} index
 * @param {Set<string>} seen
 * @param {object[]} out
 * @param {number} max
 */
function pushRows(rows, seen, out, max) {
  for (const r of rows ?? []) {
    const k = `${r.source}|${r.nome}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
    if (out.length >= max) return true;
  }
  return false;
}

/**
 * @param {object} dest
 * @param {object} index
 * @param {number} max
 */
export function lookupHotelsByName(dest, index, max = 8) {
  const keys = destKeys(dest.nome ?? '');
  const out = [];
  const seen = new Set();
  const isPt = fold(dest.pais ?? '') === 'portugal';

  if (isPt) {
    for (const k of keys) {
      if (pushRows(index.byConcelho?.[k], seen, out, max)) return out;
      if (pushRows(index.byLocalidade?.[k], seen, out, max)) return out;
    }
  }

  for (const k of keys) {
    if (pushRows(index.byArticle?.[k], seen, out, max)) return out;
  }

  return out;
}

/**
 * @param {object} dest
 * @param {object} index
 * @param {number} max
 */
export function lookupHotelsFuzzyArticle(dest, index, max = 8) {
  const leaf = fold(leafCityName(dest.nome ?? ''));
  if (leaf.length < 3) return [];

  const out = [];
  const seen = new Set();

  for (const k of index.articleKeys ?? []) {
    if (k === leaf || k.startsWith(`${leaf} `) || leaf.startsWith(`${k} `)) {
      if (pushRows(index.byArticle?.[k], seen, out, max)) return out;
    }
  }

  for (const k of index.articleKeys ?? []) {
    if (k.length < 4 || leaf.length < 4) continue;
    if (k.includes(leaf) || leaf.includes(k)) {
      if (pushRows(index.byArticle?.[k], seen, out, max)) return out;
    }
  }

  return out;
}

function geoCell(lat, lon) {
  return `${Math.trunc(lat * 4)}_${Math.trunc(lon * 4)}`;
}

/**
 * @param {number} lat
 * @param {number} lon
 * @param {object} index
 * @param {number} max
 */
export function lookupHotelsGeo(lat, lon, index, max = 6) {
  if (lat == null || lon == null) return [];
  const out = [];
  const seen = new Set();
  const [clat, clon] = [Math.trunc(lat * 4), Math.trunc(lon * 4)];

  for (const [da, db] of GEO_NEIGHBORS) {
    const key = `${clat + da}_${clon + db}`;
    if (pushRows(index.geoGrid?.[key], seen, out, max)) return out;
  }

  return out;
}

/**
 * @param {object} dest
 * @param {object} index
 * @param {number} max
 */
export function lookupAllHotels(dest, index, max = 8) {
  const merged = [];
  const seen = new Set();

  for (const fn of [
    () => lookupHotelsByName(dest, index, max),
    () => lookupHotelsFuzzyArticle(dest, index, max),
    () =>
      lookupHotelsGeo(dest.latitude, dest.longitude, index, max),
  ]) {
    for (const r of fn()) {
      const k = `${r.source}|${r.nome}`;
      if (seen.has(k)) continue;
      seen.add(k);
      merged.push(r);
      if (merged.length >= max) return merged;
    }
  }

  return merged;
}
