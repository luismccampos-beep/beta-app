/**
 * Corrigir país/coords de destinos Wikivoyage antes de enriquecer hotéis.
 */
import {
  COUNTRY_META,
  countryFromParenthetical,
  inferCountryFromDestination,
} from './city-country-lookup.mjs';
import { fold } from './cost-of-living-data.mjs';
import { geocodeDestination, sleep } from './external-enrichment.mjs';

/** @type {Record<string, { latMin: number; latMax: number; lonMin: number; lonMax: number }>} */
export const COUNTRY_BBOX = {
  PT: { latMin: 36.8, latMax: 42.2, lonMin: -9.6, lonMax: -6.0 },
  ES: { latMin: 27.5, latMax: 43.9, lonMin: -18.5, lonMax: 4.5 },
  FR: { latMin: 41.0, latMax: 51.2, lonMin: -5.2, lonMax: 9.7 },
  BR: { latMin: -34.0, latMax: 5.5, lonMin: -74.0, lonMax: -32.0 },
  US: { latMin: 18.0, latMax: 72.0, lonMin: -170.0, lonMax: -65.0 },
  GB: { latMin: 49.5, latMax: 61.0, lonMin: -8.8, lonMax: 2.0 },
  IT: { latMin: 36.5, latMax: 47.2, lonMin: 6.5, lonMax: 18.6 },
  DE: { latMin: 47.0, latMax: 55.2, lonMin: 5.5, lonMax: 15.5 },
  MX: { latMin: 14.0, latMax: 33.0, lonMin: -118.5, lonMax: -86.5 },
  AR: { latMin: -55.5, latMax: -21.5, lonMin: -73.5, lonMax: -53.0 },
  EG: { latMin: 22.0, latMax: 32.0, lonMin: 24.5, lonMax: 37.0 },
  AU: { latMin: -44.0, latMax: -10.0, lonMin: 112.0, lonMax: 154.0 },
  JP: { latMin: 24.0, latMax: 46.0, lonMin: 122.0, lonMax: 146.0 },
  TH: { latMin: 5.0, latMax: 21.0, lonMin: 97.0, lonMax: 106.0 },
  RU: { latMin: 41.0, latMax: 82.0, lonMin: 19.0, lonMax: 180.0 },
};

/**
 * @param {number} lat
 * @param {number} lon
 * @param {string} [paisCode]
 */
export function coordMatchesCountry(lat, lon, paisCode) {
  if (lat == null || lon == null || Number.isNaN(lat) || Number.isNaN(lon)) return false;
  const box = COUNTRY_BBOX[String(paisCode ?? '').toUpperCase()];
  if (!box) return true;
  return (
    lat >= box.latMin &&
    lat <= box.latMax &&
    lon >= box.lonMin &&
    lon <= box.lonMax
  );
}

/**
 * @param {{ nome?: string; pais?: string; paisCode?: string; descricao?: string; descricaoCompleta?: string; lang?: string; latitude?: number; longitude?: number }} dest
 */
export function refineDestinationCountry(dest) {
  const fromParen = countryFromParenthetical(dest.nome ?? '');
  const inferred = inferCountryFromDestination(
    dest.nome ?? '',
    dest.descricaoCompleta ?? dest.descricao ?? '',
    dest.lang ?? 'pt',
  );

  let next = fromParen ?? inferred;

  if (
    dest.pais === 'Portugal' &&
    next.name !== 'Portugal' &&
    (fromParen || inferred.name !== 'Portugal')
  ) {
    return next;
  }

  if (dest.pais === 'Internacional' || dest.paisCode === 'XX' || !dest.paisCode) {
    return next;
  }

  if (fromParen) return fromParen;
  return null;
}

/**
 * @param {{ nome?: string; pais?: string; latitude?: number; longitude?: number; paisCode?: string }} dest
 */
export function coordsLookWrong(dest) {
  const { latitude: lat, longitude: lon, paisCode } = dest;
  if (lat == null || lon == null) return false;
  return !coordMatchesCountry(lat, lon, paisCode);
}

/**
 * @param {{ nome?: string; pais?: string }} dest
 * @param {Record<string, { lat: number; lon: number }>} cache
 */
export async function geocodeDest(dest, cache) {
  const leaf = (dest.nome ?? '').replace(/\([^)]*\)/g, ' ').split('/')[0]?.trim();
  const key = `${fold(dest.pais ?? '')}|${fold(leaf)}`;
  if (cache[key]) return cache[key];

  const query = [leaf, dest.pais && dest.pais !== 'Internacional' ? dest.pais : null]
    .filter(Boolean)
    .join(', ');
  const geo = await geocodeDestination(query);
  await sleep(1100);
  if (!geo) return null;
  const coords = { lat: geo.lat, lon: geo.lon };
  cache[key] = coords;
  return coords;
}

/**
 * @param {string} nome
 */
export function leafCityName(nome) {
  return (nome ?? '').replace(/\([^)]*\)/g, ' ').split('/')[0]?.trim() ?? '';
}
