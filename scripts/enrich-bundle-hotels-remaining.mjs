/**
 * Segunda fase: corrigir país/coords + match geo/fuzzy/LiteAPI para destinos sem hotel.
 *
 *   npm run travel:demo:build-hotel-index
 *   npm run travel:demo:enrich-hotels-remaining
 *   npm run travel:demo:enrich-hotels-remaining -- --dry-run
 *   npm run travel:demo:enrich-hotels-remaining -- --liteapi --liteapi-limit=30
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

import { loadProjectEnv } from './lib/load-env.mjs';
import { lookupAllHotels } from './lib/hotel-lookup.mjs';
import {
  coordMatchesCountry,
  coordsLookWrong,
  geocodeDest,
  refineDestinationCountry,
} from './lib/destination-fix.mjs';
import { fold } from './lib/cost-of-living-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const INDEX = resolve(ROOT, 'data/hotels/hotel-index.json');
const GEO_CACHE = resolve(ROOT, 'src/data/travel-mock/geocode-cache-hotels.json');

loadProjectEnv(ROOT);

const dryRun = process.argv.includes('--dry-run');
const useLiteApi = process.argv.includes('--liteapi');
const useSynthetic = process.argv.includes('--synthetic');
const liteApiLimit = parseInt(
  process.argv.find((a) => a.startsWith('--liteapi-limit'))?.split('=')[1] ??
    process.argv[process.argv.indexOf('--liteapi-limit') + 1] ??
    '40',
  10,
);
const geoLimit = parseInt(process.env.HOTEL_GEOCODE_LIMIT ?? '250', 10);
const MAX_ADD = parseInt(process.env.HOTEL_ENRICH_MAX_PER_DEST ?? '8', 10);

function ensureIndex() {
  if (existsSync(INDEX)) return;
  execSync('py -3 scripts/build-hotel-data-index.py', { cwd: ROOT, stdio: 'inherit' });
}

function loadGeoCache() {
  if (!existsSync(GEO_CACHE)) return {};
  try {
    return JSON.parse(readFileSync(GEO_CACHE, 'utf8'));
  } catch {
    return {};
  }
}

function saveGeoCache(cache) {
  writeFileSync(GEO_CACHE, JSON.stringify(cache, null, 2));
}

/**
 * @param {object} dest
 */
async function fetchLiteApiPlaces(dest) {
  const key = process.env.LITEAPI_API_KEY?.trim();
  if (!key) return [];

  const city = dest.nome.replace(/\([^)]*\)/g, ' ').trim();
  const q = `hotels in ${city}${dest.pais && dest.pais !== 'Internacional' ? `, ${dest.pais}` : ''}`;
  const url = new URL('https://api.liteapi.travel/v3.0/data/places');
  url.searchParams.set('textQuery', q);
  url.searchParams.set('type', 'hotel,lodging');
  url.searchParams.set('language', dest.lang === 'en' ? 'en' : 'pt');

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json', 'X-API-Key': key },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const rows = json.data ?? [];
    return rows.slice(0, MAX_ADD).map((p) => ({
      nome: p.displayName || 'Hotel',
      estrelas: 3,
      preco_por_noite: 95,
      comodidades: ['wifi'],
      source: 'liteapi',
    }));
  } catch {
    return [];
  }
}

/**
 * @param {object} dest
 */
function syntheticHotels(dest) {
  const city = dest.nome.replace(/\([^)]*\)/g, ' ').trim();
  return [
    {
      nome: `Hotel ${city}`,
      estrelas: 3,
      preco_por_noite: 85,
      comodidades: ['wifi'],
      source: 'synthetic',
    },
    {
      nome: `Guesthouse ${city}`,
      estrelas: 2,
      preco_por_noite: 55,
      comodidades: ['wifi'],
      source: 'synthetic',
    },
  ];
}

async function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle');
    process.exit(1);
  }

  ensureIndex();
  const index = JSON.parse(readFileSync(INDEX, 'utf8'));
  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const geoCache = loadGeoCache();

  const countByDest = new Map();
  for (const h of bundle.hoteis) {
    countByDest.set(h.destino_id, (countByDest.get(h.destino_id) ?? 0) + 1);
  }

  const emptyDests = bundle.destinos.filter((d) => (countByDest.get(d.id) ?? 0) === 0);
  console.log(`Destinos sem hotel: ${emptyDests.length}`);

  let countriesFixed = 0;
  let coordsFixed = 0;
  let geocoded = 0;
  let nextId = bundle.hoteis.reduce((m, h) => Math.max(m, h.id), 0);
  let added = 0;
  let destsFilled = 0;
  const bySource = {};

  let liteApiUsed = 0;
  let geoCalls = 0;

  for (const dest of emptyDests) {
    const refined = refineDestinationCountry(dest);
    if (refined && refined.name !== dest.pais) {
      dest.pais = refined.name;
      dest.paisCode = refined.code;
      dest.continente = refined.continent;
      countriesFixed += 1;
    }

    if (coordsLookWrong(dest)) {
      dest.latitude = undefined;
      dest.longitude = undefined;
      coordsFixed += 1;
    }

    if (
      !dryRun &&
      (dest.latitude == null || dest.longitude == null) &&
      geoCalls < geoLimit &&
      dest.pais &&
      dest.pais !== 'Internacional'
    ) {
      const coords = await geocodeDest(dest, geoCache);
      geoCalls += 1;
      if (coords && coordMatchesCountry(coords.lat, coords.lon, dest.paisCode)) {
        dest.latitude = coords.lat;
        dest.longitude = coords.lon;
        geocoded += 1;
      }
    }

    let candidates = lookupAllHotels(dest, index, MAX_ADD);

    if (!dryRun && !candidates.length && useLiteApi && liteApiUsed < liteApiLimit) {
      candidates = await fetchLiteApiPlaces(dest);
      liteApiUsed += 1;
      await new Promise((r) => setTimeout(r, 200));
    }

    if (!candidates.length && useSynthetic) {
      candidates = syntheticHotels(dest);
    }

    if (!candidates.length) continue;

    destsFilled += 1;
    for (const c of candidates) {
      nextId += 1;
      added += 1;
      bySource[c.source] = (bySource[c.source] ?? 0) + 1;
      bundle.hoteis.push({
        id: nextId,
        destino_id: dest.id,
        nome: c.nome,
        estrelas: c.estrelas,
        preco_por_noite: c.preco_por_noite,
        comodidades: c.comodidades ?? ['wifi'],
        fonte: c.source,
      });
      countByDest.set(dest.id, (countByDest.get(dest.id) ?? 0) + 1);
    }
  }

  const stillEmpty = bundle.destinos.filter((d) => (countByDest.get(d.id) ?? 0) === 0).length;

  console.log('\nRemaining hotels enrich:');
  console.log(`  Países corrigidos: ${countriesFixed}`);
  console.log(`  Coords inválidas limpas: ${coordsFixed}`);
  console.log(`  Geocoded (Nominatim): ${geocoded} (limit ${geoLimit})`);
  console.log(`  Added: ${added} hotels → ${destsFilled} destinos`);
  console.log(`  By source:`, bySource);
  console.log(`  Still empty: ${stillEmpty}/${bundle.destinos.length}`);
  if (useLiteApi) console.log(`  LiteAPI calls: ${liteApiUsed}`);

  if (!dryRun) {
    saveGeoCache(geoCache);
    bundle.meta.counts.hoteis = bundle.hoteis.length;
    bundle.meta.hotelEnrichRemaining = {
      at: new Date().toISOString(),
      added,
      destsFilled,
      stillEmpty,
      countriesFixed,
      geocoded,
      sources: bySource,
    };
    writeFileSync(BUNDLE, JSON.stringify(bundle));
    console.log(`\nUpdated ${BUNDLE}`);
  } else {
    console.log('\n(dry-run — bundle not written)');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
