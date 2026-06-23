#!/usr/bin/env node
/**
 * geocode-remaining-destinos.mjs
 *
 * Geocodifica destinos sem coordenadas usando:
 * 1. Nominatim (OSM) — rápido, 1 req/s
 * 2. Google Maps Scraper — fallback via API (browser headless)
 *
 * Depois copia as coordenadas dos destinos para os hotéis desses destinos.
 *
 * Uso:
 *   node scripts/geocode-remaining-destinos.mjs
 *   node scripts/geocode-remaining-destinos.mjs --dry-run
 *   node scripts/geocode-remaining-destinos.mjs --limit=50
 *   node scripts/geocode-remaining-destinos.mjs --skip-hotels
 *   node scripts/geocode-remaining-destinos.mjs --only-town-dests
 *   node scripts/geocode-remaining-destinos.mjs --status
 *
 * Flags:
 *   --dry-run              Não escreve na BD
 *   --limit=N              Máx destinos a processar
 *   --skip-hotels          Não copia coords para hotéis
 *   --only-town-dests      Apenas destinos reais (não tópicos/actividades)
 *   --gmaps-fallback       Usa Google Maps Scraper como fallback
 *   --batch-size=N         DB batch size (default 100)
 *   --delay=N              Segundos entre pedidos Nominatim (default 1.0)
 *   --status               Mostra estado actual e saí
 */

import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, createReadStream } from 'fs';
import { createInterface } from 'readline';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const GMAPS_API = 'http://localhost:8001';
const USER_AGENT = 'beta-app-geocoder/1.0 (contact: admin@akmleva.com)';

// Tópicos/actividades que não precisam de coordenadas (prefixos/substrings no nome)
const TOPIC_PATTERNS = [
  'tourism', 'history', 'cuisine', 'architecture', 'national park',
  'heritage', 'museum', 'trail', 'route', 'cycling', 'hiking',
  'diving', 'birdwatching', 'culture', 'festival', 'itinerary',
  'travel', 'guide', 'safety', 'driving', 'tours',
  'itineraries', 'topics', 'activities',
];

// ---------------------------------------------------------------------------
// Env & Args
// ---------------------------------------------------------------------------
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const fpath = resolve(ROOT, file);
    if (!existsSync(fpath)) continue;
    for (const line of readFileSync(fpath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.+)/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

function parseArgs() {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '--status' || arg === '--dry-run' || arg === '--skip-hotels' || arg === '--only-town-dests' || arg === '--gmaps-fallback') {
      a[arg.slice(2)] = true;
    } else if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      if (eq > 0) { a[arg.slice(2, eq)] = arg.slice(eq + 1); }
      else { a[arg.slice(2)] = process.argv[++i] ?? true; }
    }
  }
  return a;
}

function isTownDestination(nome) {
  if (!nome) return false;
  const lower = nome.toLowerCase();
  for (const pattern of TOPIC_PATTERNS) {
    if (lower.includes(pattern)) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// CSV parser
// ---------------------------------------------------------------------------
async function readCSV(filepath) {
  const rows = [];
  const fileStream = createReadStream(filepath);
  const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

  let headers = [];
  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) {
      headers = parseCSVLine(line);
      continue;
    }
    const values = parseCSVLine(line);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, i) => { row[h.trim()] = values[i]; });
      rows.push(row);
    }
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

// ---------------------------------------------------------------------------
// Geocoding: Nominatim (1 req/s recomendado)
// ---------------------------------------------------------------------------
async function nominatimGeocode(query, countryCode) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    'accept-language': 'pt',
  });
  if (countryCode && countryCode.length === 2 && countryCode !== 'XX') {
    params.set('countrycodes', countryCode.toLowerCase());
  }
  const url = `https://nominatim.openstreetmap.org/search?${params}`;

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) {
      if (resp.status === 429) return { rateLimited: true, error: 'RATE_LIMITED' };
      return null;
    }
    const data = await resp.json();
    if (!data?.length) return null;

    const best = data[0];
    return {
      lat: parseFloat(best.lat),
      lon: parseFloat(best.lon),
      display_name: best.display_name,
      osm_type: best.osm_type,
      importance: best.importance,
      strategy: 'nominatim',
    };
  } catch (err) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Geocoding: Google Maps Scraper (fallback, browser-based)
// ---------------------------------------------------------------------------
async function gmapsGeocode(query) {
  try {
    const url = `${GMAPS_API}/scrape-get?query=${encodeURIComponent(query)}&max_places=5&headless=true&lang=en`;
    const resp = await fetch(url, {
      signal: AbortSignal.timeout(120000), // 2 min timeout
    });
    if (!resp.ok) {
      console.error(`  ⚠ GMaps API returned ${resp.status} for "${query}"`);
      return null;
    }
    const results = await resp.json();
    if (!results?.length) return null;

    // Procurar o primeiro resultado com coordenadas
    for (const place of results) {
      if (place.coordinates?.latitude && place.coordinates?.longitude) {
        return {
          lat: place.coordinates.latitude,
          lon: place.coordinates.longitude,
          name: place.name,
          strategy: 'gmaps',
        };
      }
    }
    return null;
  } catch (err) {
    console.error(`  ⚠ GMaps API error for "${query}": ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Batch DB updates
// ---------------------------------------------------------------------------
async function batchUpdateDestCoords(prisma, batch) {
  if (batch.length === 0) return;
  const cases = batch.map((r) =>
    `(${r.id}::int, ${r.lat}::real, ${r.lon}::real)`
  ).join(',\n');
  await prisma.$executeRawUnsafe(`
    UPDATE wv_destinations AS d
    SET latitude = v.lat,
        longitude = v.lon
    FROM (VALUES
      ${cases}
    ) AS v(id, lat, lon)
    WHERE d.id = v.id
  `);
}

async function copyDestCoordsToHotels(prisma, destId) {
  await prisma.$executeRawUnsafe(`
    UPDATE wv_hotels h
    SET latitude = d.latitude,
        longitude = d.longitude,
        fonte = 'dest_coords'
    FROM wv_destinations d
    WHERE h.destino_id = d.id
      AND d.id = $1::int
      AND d.latitude IS NOT NULL
      AND d.longitude IS NOT NULL
      AND h.latitude IS NULL
      AND h.longitude IS NULL
  `, destId);
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
async function printStatus(prisma) {
  const [totalResult, withCoordsResult, pendingResult] = await Promise.all([
    prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS total FROM wv_destinations`),
    prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS total FROM wv_destinations WHERE latitude IS NOT NULL AND longitude IS NOT NULL`),
    prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS total FROM wv_destinations WHERE latitude IS NULL AND longitude IS NULL AND pais_code != 'XX'`),
  ]);
  const total = totalResult?.[0]?.total ?? 0;
  const withCoords = withCoordsResult?.[0]?.total ?? 0;
  const pending = pendingResult?.[0]?.total ?? 0;

  // Hotels without coords (raw SQL)
  const hotelsPendingResult = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS total
    FROM wv_hotels
    WHERE latitude IS NULL
      AND longitude IS NULL
      AND (fonte IS NULL OR fonte NOT IN ('rejected_geo', 'geo_not_found'))
  `);
  const hotelsPending = Array.isArray(hotelsPendingResult)
    ? (hotelsPendingResult[0]?.total ?? 0)
    : 0;

  const hotelsInDestsWithCoords = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS total
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL
      AND h.longitude IS NULL
      AND d.latitude IS NOT NULL
      AND d.longitude IS NOT NULL
      AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', 'geo_not_found'))
  `);
  const copyable = Array.isArray(hotelsInDestsWithCoords)
    ? (hotelsInDestsWithCoords[0]?.total ?? 0)
    : (hotelsInDestsWithCoords?.total ?? 0);

  console.log(`\n=== Geocoding Status ===`);
  console.log(`  Total destinations     : ${total.toLocaleString()}`);
  console.log(`  With coords            : ${withCoords.toLocaleString()}  (${(withCoords / total * 100).toFixed(1)}%)`);
  console.log(`  Pending (non-XX)       : ${pending.toLocaleString()}`);
  console.log(`  Hotels pending coords  : ${hotelsPending.toLocaleString()}`);
  console.log(`  Hotels copyable from dest : ${copyable.toLocaleString()}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  loadEnv();
  const A = parseArgs();

  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL },
    },
  });

  try {
    // ── Status mode ──
    if (A.status) {
      await printStatus(prisma);
      return;
    }

    // ── Config ──
    const DRY_RUN = !!A['dry-run'];
    const LIMIT = parseInt(A.limit || '0');
    const BATCH_SIZE = Math.min(parseInt(A['batch-size'] || '100'), 500);
    const DELAY = Math.max(0.5, parseFloat(A.delay || '1.0'));
    const ONLY_TOWNS = !!A['only-town-dests'];
    const SKIP_HOTELS = !!A['skip-hotels'];
    const GMAPS_FALLBACK = !!A['gmaps-fallback'];

    console.log(`\n=== Geocode Destinos Sem Coordenadas ===`);
    console.log(`  dry-run=${DRY_RUN}  limit=${LIMIT || 'ALL'}`);
    console.log(`  only-town-dests=${ONLY_TOWNS}  gmaps-fallback=${GMAPS_FALLBACK}`);
    console.log(`  delay=${DELAY}s  batch-size=${BATCH_SIZE}`);
    console.log();

    await printStatus(prisma);
    console.log();

    // ── Load destinos from DB ──
    const dbDests = await prisma.$queryRawUnsafe(`
      SELECT id, nome, pais_code, pais, hotel_count
      FROM wv_destinations
      WHERE latitude IS NULL
        AND longitude IS NULL
        AND pais_code != 'XX'
      ORDER BY hotel_count DESC
    `);
    const allDests = (dbDests || []).map(r => ({
      id: String(r.id),
      nome: r.nome ?? '',
      pais_code: r.pais_code ?? '',
      pais: r.pais ?? '',
      hotelCount: r.hotel_count ?? 0,
    }));
    console.log(`Loaded ${allDests.length} destinos from DB`);

    let destsToProcess = allDests;
    if (ONLY_TOWNS) {
      destsToProcess = allDests.filter(d => isTownDestination(d.nome));
      console.log(`  Filtered to ${destsToProcess.length} "real town" destinations`);
    }
    if (LIMIT > 0) {
      destsToProcess = destsToProcess.slice(0, LIMIT);
      console.log(`  Limited to ${LIMIT} destinations`);
    }

    console.log(`\nDestinos to process: ${destsToProcess.length}`);
    if (destsToProcess.length === 0) {
      console.log('Nothing to do.');
      return;
    }

    // ── Geocode ──
    let found = 0;
    let notFound = 0;
    let rateLimited = false;
    const foundBatch = [];
    const startTime = Date.now();

    for (let i = 0; i < destsToProcess.length; i++) {
      const d = destsToProcess[i];
      const query = d.nome;
      const countryCode = d.pais_code || '';
      const pct = ((i + 1) / destsToProcess.length * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);

      process.stdout.write(`\r  [${i + 1}/${destsToProcess.length} (${pct}%) | ${elapsed}s | found: ${found}] ${query.padEnd(50)}`);

      // 1. Nominatim
      let result = null;
      if (!rateLimited) {
        result = await nominatimGeocode(query, countryCode);
        if (result?.rateLimited) {
          rateLimited = true;
          console.log(`\n  ⚠ Nominatim rate-limited (429). A desativar...`);
        }
      }

      // 2. GMaps fallback (se ativado e Nominatim falhou)
      if (!result && GMAPS_FALLBACK) {
        console.log(`\n  → Trying GMaps for "${query}"...`);
        result = await gmapsGeocode(query);
        if (result) {
          console.log(`  ✓ GMaps found: ${result.name} at ${result.lat},${result.lon}`);
        }
      }

      if (result && !result.rateLimited) {
        foundBatch.push({
          id: parseInt(d.id),
          lat: result.lat,
          lon: result.lon,
          strategy: result.strategy || 'nominatim',
        });
        found++;

        // Copy to hotels immediately if not dry-run
        if (!DRY_RUN && !SKIP_HOTELS) {
          await copyDestCoordsToHotels(prisma, parseInt(d.id));
        }
      } else if (!result?.rateLimited) {
        notFound++;
      }

      // Delay para respeitar rate limits
      if (i < destsToProcess.length - 1) {
        await new Promise((r) => setTimeout(r, DELAY * 1000));
      }
    }

    console.log(); // newline

    // ── Batch DB updates ──
    if (foundBatch.length > 0) {
      console.log(`\nWriting ${foundBatch.length} destination coords to DB...`);

      if (!DRY_RUN) {
        for (let i = 0; i < foundBatch.length; i += BATCH_SIZE) {
          const batch = foundBatch.slice(i, i + BATCH_SIZE);
          await batchUpdateDestCoords(prisma, batch);
          process.stdout.write(`\r  committed: ${Math.min(i + BATCH_SIZE, foundBatch.length)}/${foundBatch.length}`);
        }
        console.log();
      }
    }

    // ── Summary ──
    const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const rate = found / (parseFloat(totalElapsed) || 1);
    console.log(`\n=== Run complete ===`);
    console.log(`  Processed  : ${destsToProcess.length}`);
    console.log(`  Found      : ${found}`);
    console.log(`  Not found  : ${notFound}`);
    console.log(`  Elapsed    : ${totalElapsed}s (${rate.toFixed(2)} destinos/s)`);
    if (rateLimited) console.log(`  ⚠ Nominatim foi rate-limited. Próxima run: use --gmaps-fallback`);
    if (DRY_RUN) console.log(`  (dry-run - nothing written to DB)`);

    if (!SKIP_HOTELS && !DRY_RUN) {
      // Show how many hotels were updated
      const updated = await prisma.$executeRawUnsafe(`
        SELECT COUNT(*)::int AS total FROM wv_hotels WHERE fonte = 'dest_coords'
      `);
      console.log(`  Hotels updated from dest coords: ${updated ?? '?'}`);
    }

  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});