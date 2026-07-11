import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjectEnv } from './lib/load-env.mjs';
import { logger, withErrorHandling } from './lib/logger.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const CACHE_PATH = resolve(ROOT, 'src/data/travel-mock/wikidata-country-cache.json');

loadProjectEnv(ROOT);

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';
const MATCH_RADIUS_KM = parseInt(process.env.WIKIDATA_RADIUS_KM ?? '5', 10);
const DELAY_MS = parseInt(process.env.WIKIDATA_DELAY_MS ?? '2000', 10);
const USER_AGENT = 'beta-app-travel/1.0 (wikidata-pois)';

const TYPE_GROUPS = [
  {
    name: 'cultural',
    types: ['Q33506','Q243119','Q24354','Q7075','Q166118','Q243134'],
  },
  {
    name: 'historic',
    types: ['Q23454','Q16560','Q4989906','Q839954','Q1785071','Q35112127','Q12584','Q39715'],
  },
  {
    name: 'religious',
    types: ['Q16970','Q2977','Q32815','Q44539','Q44613','Q108551','Q34622'],
  },
  {
    name: 'nature',
    types: ['Q46169','Q167346','Q35509','Q34038'],
  },
];

const TYPE_FLAT_MAP = {};
for (const g of TYPE_GROUPS) {
  for (const qid of g.types) {
    TYPE_FLAT_MAP[qid] = g.name;
  }
}

function buildCountryQuery(south, west, north, east, typeGroup) {
  const qids = typeGroup.types.map((q) => `wd:${q}`).join(' ');
  return `
SELECT DISTINCT ?item ?itemLabel ?coord ?type ?typeLabel ?description
WHERE {
  VALUES ?type { ${qids} }
  ?item wdt:P31 ?type; wdt:P625 ?coord.
  BIND(xsd:float(STRBEFORE(STRAFTER(STR(?coord), "Point("), " ")) AS ?lon)
  BIND(xsd:float(STRBEFORE(STRAFTER(STR(?coord), " "), ")")) AS ?lat)
  FILTER(?lon > ${west} && ?lon < ${east} && ?lat > ${south} && ?lat < ${north})
  OPTIONAL { ?item schema:description ?description. FILTER(LANG(?description) = "en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,pt". }
}
LIMIT 500`.trim();
}

function parseCoord(wkt) {
  if (!wkt) return null;
  const m = wkt.trim().match(/Point\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
  if (!m) return null;
  return { lon: parseFloat(m[1]), lat: parseFloat(m[2]) };
}

function haversineKm(lat1, lon1, lat2, lon2) {
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

async function queryWikidata(sparqlQuery) {
  const url = new URL(SPARQL_ENDPOINT);
  url.searchParams.set('format', 'json');
  url.searchParams.set('query', sparqlQuery);

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/sparql-results+json',
      'User-Agent': USER_AGENT,
    },
  });

  if (res.status === 429) return 'RATE_LIMITED';
  if (!res.ok) return [];

  const data = await res.json();
  return data?.results?.bindings ?? [];
}

async function main() {
  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const { destinos } = bundle;

  const destinosComCoords = destinos.filter(
    (d) => d.latitude && d.longitude && !d._enriched_wikidata,
  );
  logger.info(`${destinosComCoords.length} destinations pending Wikidata enrichment`);

  if (destinosComCoords.length === 0) {
    logger.info('All done.');
    return;
  }

  const byCountry = {};
  for (const d of destinosComCoords) {
    const code = d.paisCode || 'XX';
    if (!byCountry[code]) byCountry[code] = [];
    byCountry[code].push(d);
  }

  const countryCodes = Object.keys(byCountry).sort();
  logger.info(`${countryCodes.length} countries to process`);

  let cache = {};
  if (existsSync(CACHE_PATH)) {
    try { cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8')); } catch {}
  }

  let totalPois = 0;
  let enriched = 0;
  let skipped = 0;
  let rateLimited = false;

  for (let ci = 0; ci < countryCodes.length; ci++) {
    if (rateLimited) break;

    const code = countryCodes[ci];
    const dests = byCountry[code];

    if (code === 'XX') {
      for (const d of dests) d._enriched_wikidata = true;
      enriched += dests.length;
      continue;
    }

    const lats = dests.map((d) => parseFloat(d.latitude));
    const lons = dests.map((d) => parseFloat(d.longitude));
    const south = Math.min(...lats) - 0.5;
    const west = Math.min(...lons) - 0.5;
    const north = Math.max(...lats) + 0.5;
    const east = Math.max(...lons) + 0.5;

    const needsTiling = north - south > 10 || east - west > 10;

    const TILE_SIZE = needsTiling ? 10 : 999;
    const coveredSet = new Set();
    if (needsTiling) {
      for (const d of dests) {
        const dLat = Math.floor(parseFloat(d.latitude) / TILE_SIZE) * TILE_SIZE;
        const dLon = Math.floor(parseFloat(d.longitude) / TILE_SIZE) * TILE_SIZE;
        coveredSet.add(`${dLat},${dLon}`);
      }
    }

    const tiles = [];
    if (needsTiling) {
      for (const key of coveredSet) {
        const [lat, lon] = key.split(',').map(Number);
        tiles.push({ south: lat, west: lon, north: lat + TILE_SIZE, east: lon + TILE_SIZE });
      }
    } else {
      tiles.push({ south, west, north, east });
    }

    const tileInfo = tiles.length > 1 ? `, ${tiles.length} tiles` : '';
    logger.info(`[${ci + 1}/${countryCodes.length}] ${code} — ${dests.length} destinos${tileInfo}`);

    const groupResults = {};

    for (const group of TYPE_GROUPS) {
      const cacheKey = `${code}:${group.name}`;
      if (cache[cacheKey]) {
        groupResults[group.name] = cache[cacheKey];
        skipped++;
        continue;
      }

      if (rateLimited) break;

      const allPois = [];
      const seen = new Set();

      for (let ti = 0; ti < tiles.length; ti++) {
        if (rateLimited) break;
        const tile = tiles[ti];
        const query = buildCountryQuery(tile.south, tile.west, tile.north, tile.east, group);
        const bindings = await queryWikidata(query);
        if (bindings === 'RATE_LIMITED') {
          logger.warn(`  ${group.name} tile ${ti + 1}/${tiles.length}: rate-limited`);
          rateLimited = true;
          break;
        }
        for (const b of bindings) {
          const itemId = b.item?.value?.split('/').pop();
          if (!itemId || seen.has(itemId)) continue;
          seen.add(itemId);
          const coord = parseCoord(b.coord?.value);
          if (!coord) continue;
          const typeQid = b.type?.value?.split('/').pop() ?? '';
          const groupName2 = TYPE_FLAT_MAP[typeQid] ?? 'other';
          allPois.push({
            wikidata_id: itemId,
            name: b.itemLabel?.value ?? itemId,
            type: typeQid,
            group: groupName2,
            lat: coord.lat,
            lon: coord.lon,
            description: b.description?.value ?? null,
            source: 'wikidata',
          });
        }
        if (ti < tiles.length - 1) await sleep(DELAY_MS);
      }

      cache[cacheKey] = allPois;
      groupResults[group.name] = allPois;
      skipped++;

      if (!rateLimited) {
        await sleep(DELAY_MS);
        writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
      }
    }

    if (rateLimited) break;

    const allCountryPois = Object.values(groupResults).flat();

    for (const dest of dests) {
      const dLat = parseFloat(dest.latitude);
      const dLon = parseFloat(dest.longitude);
      if (isNaN(dLat) || isNaN(dLon)) continue;

      const nearby = [];
      for (const poi of allCountryPois) {
        const dist = haversineKm(dLat, dLon, poi.lat, poi.lon);
        if (dist <= MATCH_RADIUS_KM) {
          nearby.push({ ...poi, distance_km: Math.round(dist * 100) / 100 });
        }
      }

      if (nearby.length > 0) {
        if (!dest.pois) dest.pois = [];
        const existingIds = new Set((dest.pois || []).map((p) => p.wikidata_id));
        const fresh = nearby.filter((p) => !existingIds.has(p.wikidata_id));
        dest.pois.push(...fresh);
        totalPois += fresh.length;
      }

      dest._enriched_wikidata = true;
      enriched++;
    }

    logger.ok(`  ${allCountryPois.length} POIs in country, ${totalPois} matched to destinations`);
    writeFileSync(BUNDLE, JSON.stringify(bundle, null, 2), 'utf8');

    if (ci < countryCodes.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  writeFileSync(BUNDLE, JSON.stringify(bundle, null, 2), 'utf8');
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');

  const withPois = destinos.filter((d) => (d.pois?.length ?? 0) > 0).length;

  console.log(`\n--- Wikidata POI Enrichment (Country Batch) ---`);
  console.log(`Countries processed: ${countryCodes.length}`);
  console.log(`Destinations enriched: ${enriched}`);
  console.log(`Skipped (cached): ${skipped}`);
  console.log(`Total POIs matched: ${totalPois}`);
  console.log(`Destinations with POIs: ${withPois}/${destinos.length}`);
  console.log(`Rate limited: ${rateLimited}`);

  if (rateLimited) {
    console.log(`\nRun again: npm run travel:demo:enrich-wikidata-pois`);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

withErrorHandling(main)();
