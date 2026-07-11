/**
 * Dados offline de transporte aéreo (OurAirports + OpenFlights routes).
 * Ficheiros em data/transportation/
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fold, leafCityName, nameSimilarity } from './cost-of-living-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const TRANSPORT_DIR = resolve(__dirname, '../../data/transportation');

const AIRPORTS_FILE = 'airports.csv';
const ROUTES_FILE = 'routes.csv';

/** Hubs usados para "ligações desde Portugal/Europa" na demo. */
export const DEMO_ORIGIN_HUBS = ['LIS', 'OPO', 'MAD', 'BCN', 'CDG', 'LHR', 'FRA', 'AMS', 'FCO', 'BER'];

/**
 * @param {string} line
 * @returns {string[]}
 */
function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      continue;
    }
    if (c === ',' && !q) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

/**
 * @typedef {object} AirportRow
 * @property {string} iata
 * @property {string} ident
 * @property {string} type
 * @property {string} name
 * @property {number} lat
 * @property {number} lon
 * @property {string} iso_country
 * @property {string} municipality
 * @property {boolean} scheduled_service
 */

/**
 * @returns {{ sources: string[]; byIata: Map<string, AirportRow>; byCountry: Map<string, AirportRow[]>; byCityKey: Map<string, AirportRow[]> }}
 */
export function loadAirportIndexes() {
  const path = resolve(TRANSPORT_DIR, AIRPORTS_FILE);
  if (!existsSync(path)) {
    return {
      sources: [],
      byIata: new Map(),
      byCountry: new Map(),
      byCityKey: new Map(),
      byCityOnly: new Map(),
      majorAirports: [],
    };
  }

  const raw = readFileSync(path, 'utf8');
  const lines = raw.split(/\r?\n/);
  const header = parseCsvLine(lines[0] ?? '');
  const col = (name) => header.indexOf(name);

  const i = {
    type: col('type'),
    name: col('name'),
    lat: col('latitude_deg'),
    lon: col('longitude_deg'),
    country: col('iso_country'),
    municipality: col('municipality'),
    scheduled: col('scheduled_service'),
    iata: col('iata_code'),
    ident: col('ident'),
  };

  /** @type {Map<string, AirportRow>} */
  const byIata = new Map();
  /** @type {Map<string, AirportRow[]>} */
  const byCountry = new Map();
  /** @type {Map<string, AirportRow[]>} */
  const byCityKey = new Map();
  /** @type {Map<string, AirportRow[]>} */
  const byCityOnly = new Map();
  /** @type {import('./transport-data.mjs').AirportRow[]} */
  const majorAirports = [];

  const typeRank = (t) =>
    t === 'large_airport' ? 3 : t === 'medium_airport' ? 2 : t === 'small_airport' ? 1 : 0;

  for (let li = 1; li < lines.length; li++) {
    const line = lines[li];
    if (!line?.trim()) continue;
    const cols = parseCsvLine(line);
    const iata = String(cols[i.iata] ?? '')
      .trim()
      .toUpperCase();
    if (!/^[A-Z0-9]{3}$/.test(iata)) continue;

    const type = cols[i.type] ?? '';
    const scheduled = (cols[i.scheduled] ?? '').toLowerCase() === 'yes';
    if (!scheduled && typeRank(type) < 2) continue;

    const lat = parseFloat(cols[i.lat] ?? '');
    const lon = parseFloat(cols[i.lon] ?? '');
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    const row = {
      iata,
      ident: cols[i.ident] ?? iata,
      type,
      name: cols[i.name] ?? iata,
      lat,
      lon,
      iso_country: String(cols[i.country] ?? '').toUpperCase(),
      municipality: cols[i.municipality] ?? '',
      scheduled_service: scheduled,
    };

    const existing = byIata.get(iata);
    if (!existing || typeRank(row.type) > typeRank(existing.type)) {
      byIata.set(iata, row);
    }

    const cc = row.iso_country;
    if (cc) {
      const list = byCountry.get(cc) ?? [];
      list.push(row);
      byCountry.set(cc, list);
    }

    for (const keyPart of [row.municipality, row.name]) {
      const k = `${fold(keyPart)}|${cc}`;
      if (!keyPart) continue;
      const list = byCityKey.get(k) ?? [];
      list.push(row);
      byCityKey.set(k, list);
      const cityOnly = fold(keyPart);
      const globalList = byCityOnly.get(cityOnly) ?? [];
      globalList.push(row);
      byCityOnly.set(cityOnly, globalList);
    }

    if (scheduled && typeRank(type) >= 2) {
      majorAirports.push(row);
    }
  }

  for (const [cc, list] of byCountry) {
    list.sort((a, b) => typeRank(b.type) - typeRank(a.type));
    byCountry.set(cc, list);
  }

  for (const [city, list] of byCityOnly) {
    list.sort((a, b) => typeRank(b.type) - typeRank(a.type));
    byCityOnly.set(city, list);
  }

  return { sources: [AIRPORTS_FILE], byIata, byCountry, byCityKey, byCityOnly, majorAirports };
}

/**
 * @returns {{ sources: string[]; routesFrom: Map<string, { count: number; destinations: Set<string> }> }}
 */
export function loadRouteIndexes() {
  const path = resolve(TRANSPORT_DIR, ROUTES_FILE);
  if (!existsSync(path)) {
    return { sources: [], routesFrom: new Map(), routeEquipment: new Map() };
  }

  const raw = readFileSync(path, 'utf8');
  const lines = raw.split(/\r?\n/);
  const header = parseCsvLine(lines[0] ?? '');
  const srcCol = header.indexOf('Source airport');
  const dstCol = header.indexOf('Destination airport');
  const equipCol = header.indexOf('Equipment');

  /** @type {Map<string, { count: number; destinations: Set<string> }>} */
  const routesFrom = new Map();
  /** @type {Map<string, Set<string>>} */
  const routeEquipment = new Map();

  for (let li = 1; li < lines.length; li++) {
    const line = lines[li];
    if (!line?.trim()) continue;
    const cols = parseCsvLine(line);
    const src = String(cols[srcCol] ?? '')
      .trim()
      .toUpperCase();
    const dst = String(cols[dstCol] ?? '')
      .trim()
      .toUpperCase();
    if (!/^[A-Z0-9]{3}$/.test(src) || !/^[A-Z0-9]{3}$/.test(dst) || src === dst) continue;

    let entry = routesFrom.get(src);
    if (!entry) {
      entry = { count: 0, destinations: new Set() };
      routesFrom.set(src, entry);
    }
    entry.count += 1;
    entry.destinations.add(dst);

    const equip = String(cols[equipCol] ?? '')
      .trim()
      .toUpperCase();
    if (equip && equip !== '\\N' && equip !== 'N') {
      const key = `${src}-${dst}`;
      const set = routeEquipment.get(key) ?? new Set();
      set.add(equip);
      routeEquipment.set(key, set);
    }
  }

  return { sources: [ROUTES_FILE], routesFrom, routeEquipment };
}

/** @param {number} lat1 @param {number} lon1 @param {number} lat2 @param {number} lon2 */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * @param {Map<string, AirportRow[]>} byCityKey
 * @param {string} cityName
 * @param {string} isoCountry
 * @param {number} [threshold]
 */
export function lookupAirportByCity(byCityKey, byCountry, cityName, isoCountry, threshold = 0.86) {
  const city = fold(leafCityName(cityName));
  const cc = String(isoCountry ?? '').toUpperCase();

  const direct = byCityKey.get(`${city}|${cc}`);
  if (direct?.length) return { airport: direct[0], match: 'cidade', score: 1 };

  const candidates = byCountry.get(cc) ?? [];
  let best = null;
  let bestScore = 0;
  for (const ap of candidates) {
    for (const part of [ap.municipality, ap.name]) {
      const score = nameSimilarity(city, fold(part));
      if (score > bestScore) {
        bestScore = score;
        best = ap;
      }
    }
  }
  if (best && bestScore >= threshold) return { airport: best, match: 'cidade', score: bestScore };
  return null;
}

/**
 * @param {Map<string, AirportRow[]>} byCountry
 * @param {string} isoCountry
 */
/**
 * @param {Map<string, AirportRow[]>} byCityOnly
 * @param {string} cityName
 * @param {number} [threshold]
 */
export function lookupAirportGlobal(byCityOnly, cityName, threshold = 0.88) {
  const city = fold(leafCityName(cityName));
  const candidates = byCityOnly.get(city) ?? [];
  if (!candidates.length) return null;

  let best = candidates[0];
  let bestScore = nameSimilarity(city, fold(best.municipality || best.name));
  for (const ap of candidates.slice(1, 40)) {
    const score = Math.max(
      nameSimilarity(city, fold(ap.municipality)),
      nameSimilarity(city, fold(ap.name)),
    );
    if (score > bestScore) {
      bestScore = score;
      best = ap;
    }
  }
  if (bestScore >= threshold) return { airport: best, match: 'cidade', score: bestScore };
  return null;
}

/**
 * @param {import('./transport-data.mjs').AirportRow[]} majorAirports
 */
export function nearestMajorAirport(majorAirports, lat, lon, maxKm = 450) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  let best = null;
  let bestKm = Infinity;
  for (const ap of majorAirports) {
    const km = haversineKm(lat, lon, ap.lat, ap.lon);
    if (km < bestKm && km <= maxKm) {
      bestKm = km;
      best = ap;
    }
  }
  if (!best) return null;
  return { airport: best, match: 'proximo', distancia_km: Math.round(bestKm), score: 0.65 };
}

export function countryHubAirport(byCountry, isoCountry) {
  const cc = String(isoCountry ?? '').toUpperCase();
  const list = byCountry.get(cc);
  if (!list?.length) return null;
  const hub = list.find((a) => a.type === 'large_airport') ?? list[0];
  return hub ? { airport: hub, match: 'pais', score: 0.5 } : null;
}

/**
 * @param {Map<string, AirportRow>} byIata
 * @param {Map<string, AirportRow[]>} byCountry
 * @param {number | null | undefined} lat
 * @param {number | null | undefined} lon
 * @param {string} isoCountry
 */
export function nearestAirportInCountry(byIata, byCountry, lat, lon, isoCountry) {
  if (lat == null || lon == null || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const cc = String(isoCountry ?? '').toUpperCase();
  const list = byCountry.get(cc) ?? [];
  let best = null;
  let bestKm = Infinity;
  for (const ap of list) {
    if (!ap.scheduled_service && ap.type !== 'large_airport' && ap.type !== 'medium_airport') continue;
    const km = haversineKm(lat, lon, ap.lat, ap.lon);
    if (km < bestKm) {
      bestKm = km;
      best = ap;
    }
  }
  if (!best) return null;
  return { airport: best, match: 'proximo', distancia_km: Math.round(bestKm), score: 0.7 };
}

/** Ordena IATAs de destino por importância do aeroporto. */
export function sortIatasByAirportRank(iatas, byIata) {
  const rank = (iata) => {
    const ap = byIata.get(iata);
    if (!ap) return 0;
    return ap.type === 'large_airport' ? 3 : ap.type === 'medium_airport' ? 2 : 1;
  };
  return [...iatas].sort((a, b) => rank(b) - rank(a));
}

export function loadTransportIndexes() {
  const airports = loadAirportIndexes();
  const routes = loadRouteIndexes();
  return {
    ...airports,
    routesFrom: routes.routesFrom,
    routeEquipment: routes.routeEquipment,
    sources: [...airports.sources, ...routes.sources],
  };
}
