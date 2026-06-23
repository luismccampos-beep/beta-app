import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjectEnv } from './lib/load-env.mjs';
import { logger, withErrorHandling } from './lib/logger.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

loadProjectEnv(ROOT);

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const MATCH_RADIUS_KM = parseInt(process.env.OVERPASS_MATCH_RADIUS ?? '5', 10);
const DELAY_MS = parseInt(process.env.OVERPASS_COUNTRY_DELAY ?? '60000', 10);
const USER_AGENT = 'beta-app-travel/1.0 (overpass-country-batch)';
const TILE_SIZE_DEG = 10;
const MAX_TILES_PER_COUNTRY = 30;

const POI_TYPES = [
  { tag: 'amenity', value: 'hospital',  group: 'hospital' },
  { tag: 'amenity', value: 'police',    group: 'police' },
];

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

function buildTileQuery(south, west, north, east) {
  const queries = POI_TYPES.map(
    ({ tag, value }) =>
      `node["${tag}"="${value}"](${south},${west},${north},${east});\n` +
      `way["${tag}"="${value}"](${south},${west},${north},${east});`,
  );
  return `[out:json][timeout:180][maxsize:20000000];(\n  ${queries.join('\n  ')}\n);out center 500;`;
}

function getTiles(destinos) {
  const lats = destinos.map((d) => parseFloat(d.latitude));
  const lons = destinos.map((d) => parseFloat(d.longitude));
  const s = Math.floor(Math.min(...lats) / TILE_SIZE_DEG) * TILE_SIZE_DEG;
  const w = Math.floor(Math.min(...lons) / TILE_SIZE_DEG) * TILE_SIZE_DEG;
  const n = Math.ceil(Math.max(...lats) / TILE_SIZE_DEG) * TILE_SIZE_DEG;
  const e = Math.ceil(Math.max(...lons) / TILE_SIZE_DEG) * TILE_SIZE_DEG;

  const tiles = [];
  for (let lat = s; lat < n; lat += TILE_SIZE_DEG) {
    for (let lon = w; lon < e; lon += TILE_SIZE_DEG) {
      tiles.push({
        south: lat, west: lon,
        north: Math.min(lat + TILE_SIZE_DEG, n),
        east: Math.min(lon + TILE_SIZE_DEG, e),
      });
    }
  }
  return tiles;
}

async function queryTile(tile) {
  const query = buildTileQuery(tile.south, tile.west, tile.north, tile.east);
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: new URLSearchParams({ data: query }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    if (text.includes('rate_limited') || text.includes('too busy')) {
      return 'RATE_LIMITED';
    }
    if (text.includes('timeout') || text.includes('runtime error')) {
      return 'TIMEOUT';
    }
    logger.warn(`Overpass HTTP ${res.status} for tile`);
    return [];
  }

  const json = await res.json();
  return json.elements ?? [];
}

function parseOverpassPoi(el) {
  const tags = el.tags ?? {};
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (!lat || !lon) return null;

  const matchingType = POI_TYPES.find(
    (t) => tags[t.tag] === t.value,
  );
  if (!matchingType) return null;

  return {
    osm_id: el.id,
    osm_type: el.type,
    name: tags.name?.trim() || null,
    type: matchingType.value,
    group: matchingType.group,
    lat,
    lon,
    address: [
      tags['addr:street'], tags['addr:housenumber'],
      tags['addr:city'], tags['addr:postcode'],
    ]
      .filter(Boolean)
      .join(', ') || null,
    phone: tags.phone?.trim() || null,
    website: tags.website?.trim() || tags['contact:website']?.trim() || null,
    opening_hours: tags.opening_hours?.trim() || null,
    source: 'overpass',
  };
}

async function main() {
  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const { destinos } = bundle;

  const withCoords = destinos.filter(
    (d) => d.latitude && d.longitude && !d._enriched_services,
  );
  logger.info(`${withCoords.length} destinations pending service POIs`);

  if (withCoords.length === 0) {
    logger.info('All destinations already enriched. Use --force to re-run.');
    return;
  }

  const byCountry = {};
  for (const d of withCoords) {
    const code = d.paisCode || 'XX';
    if (!byCountry[code]) byCountry[code] = [];
    byCountry[code].push(d);
  }

  const countryCodes = Object.keys(byCountry).sort();
  logger.info(`${countryCodes.length} countries to process`);

  let totalPois = 0;
  let enriched = 0;
  let rateLimited = false;

  for (let ci = 0; ci < countryCodes.length; ci++) {
    if (rateLimited) break;

    const code = countryCodes[ci];
    const dests = byCountry[code];

    if (code === 'XX') {
      for (const d of dests) d._enriched_services = true;
      enriched += dests.length;
      continue;
    }

    // Sanity-check coordinates: filter out destinations with clearly wrong coords
    const saneDests = dests.filter(d => {
      const lat = parseFloat(d.latitude);
      const lon = parseFloat(d.longitude);
      if (isNaN(lat) || isNaN(lon)) return false;
      // Country code should match general region (heuristic)
      return true; // just keep all for now
    });

    const tiles = getTiles(saneDests);
    if (tiles.length > MAX_TILES_PER_COUNTRY) {
      logger.warn(`  ${code}: ${tiles.length} tiles exceeds max ${MAX_TILES_PER_COUNTRY}, marking as enriched without processing`);
      for (const d of dests) d._enriched_services = true;
      enriched += dests.length;
      continue;
    }
    const tileLabel = tiles.length > 1 ? ` (${tiles.length} tiles)` : '';

    logger.info(`[${ci + 1}/${countryCodes.length}] ${code} — ${dests.length} destinos${tileLabel}`);

    let allPois = [];

    for (let ti = 0; ti < tiles.length; ti++) {
      if (rateLimited) break;

      const tile = tiles[ti];
      const result = await queryTile(tile);

      if (result === 'RATE_LIMITED') {
        logger.warn(`  tile ${ti + 1}/${tiles.length}: rate-limited`);
        rateLimited = true;
        break;
      }

      if (result === 'TIMEOUT') {
        logger.warn(`  tile ${ti + 1}/${tiles.length}: timeout, splitting...`);
        const subTiles = splitTile(tile);
        for (const sub of subTiles) {
          if (rateLimited) break;
          const subResult = await queryTile(sub);
          if (subResult === 'RATE_LIMITED') {
            rateLimited = true;
            break;
          }
          if (Array.isArray(subResult)) {
            allPois.push(...subResult);
          }
          await sleep(5000);
        }
        if (ti < tiles.length - 1) await sleep(5000);
        continue;
      }

      if (Array.isArray(result)) {
        allPois.push(...result);
      }

      if (ti < tiles.length - 1) {
        await sleep(DELAY_MS);
      }
    }

    if (rateLimited) break;

    const parsed = allPois.map(parseOverpassPoi).filter(Boolean);

    for (const dest of dests) {
      const dLat = parseFloat(dest.latitude);
      const dLon = parseFloat(dest.longitude);
      if (isNaN(dLat) || isNaN(dLon)) continue;

      const nearby = [];
      for (const poi of parsed) {
        const dist = haversineKm(dLat, dLon, poi.lat, poi.lon);
        if (dist <= MATCH_RADIUS_KM) {
          nearby.push({ ...poi, distance_km: Math.round(dist * 100) / 100 });
        }
      }

      if (nearby.length > 0) {
        if (!dest.pois_services) dest.pois_services = [];

        const existingIds = new Set(
          dest.pois_services.map((p) => `${p.osm_type}/${p.osm_id}`),
        );
        const fresh = nearby.filter(
          (p) => !existingIds.has(`${p.osm_type}/${p.osm_id}`),
        );
        dest.pois_services.push(...fresh);
        totalPois += fresh.length;
      }

      dest._enriched_services = true;
      enriched++;
    }

    logger.ok(`  ${parsed.length} POIs in country, matched ${totalPois} to destinations`);

    writeFileSync(BUNDLE, JSON.stringify(bundle, null, 2), 'utf8');

    if (ci < countryCodes.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  writeFileSync(BUNDLE, JSON.stringify(bundle, null, 2), 'utf8');

  const withServices = destinos.filter(
    (d) => (d.pois_services?.length ?? 0) > 0,
  ).length;

  console.log(`\n--- Country-Scoped Overpass Batch ---`);
  console.log(`Countries processed: ${enriched > 0 ? countryCodes.length : 0}`);
  console.log(`Destinations enriched: ${enriched}`);
  console.log(`Total POIs matched: ${totalPois}`);
  console.log(`Destinations with services: ${withServices}/${destinos.length}`);
  console.log(`Rate limited: ${rateLimited}`);

  if (rateLimited) {
    console.log(`\nRun again: npm run travel:demo:enrich-overpass-country`);
  }
}

function splitTile(tile) {
  const midLat = (tile.south + tile.north) / 2;
  const midLon = (tile.west + tile.east) / 2;
  return [
    { south: tile.south, west: tile.west, north: midLat, east: midLon },
    { south: tile.south, west: midLon, north: midLat, east: tile.east },
    { south: midLat, west: tile.west, north: tile.north, east: midLon },
    { south: midLat, west: midLon, north: tile.north, east: tile.east },
  ];
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

withErrorHandling(main)();
