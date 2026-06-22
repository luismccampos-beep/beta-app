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

// Mapeamento EN→PT para nomes de cidades/distritos (para matching cruzado)
const EN_TO_PT = {
  'lisbon': 'lisboa',
  'oporto': 'porto',
  'coimbra': 'coimbra',
  'evora': 'evora',
  'faro': 'faro',
  'funchal': 'funchal',
  'ponta delgada': 'ponta delgada',
  'angra do heroismo': 'angra do heroismo',
  'braga': 'braga',
  'aveiro': 'aveiro',
  'guimaraes': 'guimaraes',
  'lagos': 'lagos',
  'albufeira': 'albufeira',
  'portimao': 'portimao',
  'tavira': 'tavira',
  'setubal': 'setubal',
  'santarem': 'santarem',
  'viseu': 'viseu',
  'guarda': 'guarda',
  'castelo branco': 'castelo branco',
  'portalegre': 'portalegre',
  'beja': 'beja',
  'leiria': 'leiria',
  'madeira': 'madeira',
  'azores': 'acores',
  'seville': 'sevilla',
  'barcelona': 'barcelona',
  'madrid': 'madrid',
  'granada': 'granada',
  'valencia': 'valencia',
  'mallorca': 'palma de mallorca',
  'ibiza': 'eivissa',
  'copenhagen': 'copenhaga',
  'munich': 'munique',
  'cologne': 'colonia',
  'rome': 'roma',
  'milan': 'milao',
  'florence': 'florenca',
  'venice': 'veneza',
  'naples': 'napoles',
  'turin': 'turim',
  'genoa': 'genova',
  'zurich': 'zurique',
  'geneva': 'genebra',
  'basel': 'basileia',
  'berne': 'berna',
  'vienna': 'viena',
  'prague': 'praga',
  'warsaw': 'varsovia',
  'budapest': 'budapeste',
  'bucharest': 'bucareste',
  'athens': 'atenas',
  'istanbul': 'istambul',
  'moscow': 'moscovo',
  'amsterdam': 'amesterdao',
  'brussels': 'bruxelas',
  'antwerp': 'antuerpia',
  'luxembourg': 'luxemburgo',
  'london': 'londres',
  'edinburgh': 'edimburgo',
  'dublin': 'dublin',
  'stockholm': 'estocolmo',
  'oslo': 'oslo',
  'helsinki': 'helsinquia',
  'reykjavik': 'reiquiavique',
};

/**
 * Gera chaves de destino incluindo alternativas EN→PT.
 * @param {string} nome
 */
export function destKeys(nome) {
  const base = nome.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  const keys = new Set([fold(base), fold(nome)]);
  const leaf = base.split(/[,|/]/)[0]?.trim();
  if (leaf) keys.add(fold(leaf));
  // Adicionar alternativa PT se o nome for inglês
  const folded = fold(base);
  const ptAlt = EN_TO_PT[folded];
  if (ptAlt) keys.add(ptAlt);
  // Também tentar o inverso: se o nome já for PT, tentar EN
  for (const [en, pt] of Object.entries(EN_TO_PT)) {
    if (pt === folded) keys.add(en);
  }
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

  // Também consultar byCity para TBO + Global Hotels
  for (const k of keys) {
    if (pushRows(index.byCity?.[k], seen, out, max)) return out;
  }

  return out;
}

/**
 * Lookup hotéis por nome individual (byNome index - TBO + Global + Wikivoyage).
 * Faz match exato por fold do nome do hotel.
 * @param {string} hotelNome
 * @param {object} index
 * @param {number} max
 */
export function lookupHotelsByNome(hotelNome, index, max = 8) {
  const key = fold(hotelNome);
  if (!key || key.length < 2) return [];
  const out = [];
  const seen = new Set();
  // Match exato
  pushRows(index.byNome?.[key], seen, out, max);
  if (out.length >= max) return out;
  // Match fuzzy: procurar chaves que contenham ou sejam contidas
  for (const k of index.nomeKeys ?? []) {
    if (k === key || k.includes(key) || key.includes(k)) {
      if (pushRows(index.byNome?.[k], seen, out, max)) return out;
    }
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
    () => lookupHotelsByNome(dest.nome ?? '', index, max),
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
