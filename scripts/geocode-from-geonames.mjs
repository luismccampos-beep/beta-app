#!/usr/bin/env node
/**
 * geocode-from-geonames.mjs
 *
 * Descarrega ficheiros país-a-país do GeoNames (https://download.geonames.org/export/dump/),
 * extrai entradas com feature code HTL (hotéis — classe S),
 * faz matching por nome normalizado + código de país,
 * e atualiza a BD com coordenadas — SEM chamadas a APIs externas!
 *
 * Estratégia de matching (por ordem de confiança):
 *   1. Exact match (fold normalizado) + país
 *   2. Substring match (nome contém ou é contido) + país
 *   3. Fuzzy match (Dice coefficient >= 0.80) + país
 *
 * Uso:
 *   npm run travel:catalog:geocode-from-geonames
 *   npm run travel:catalog:geocode-from-geonames -- --dry-run --limit=5000
 *   npm run travel:catalog:geocode-from-geonames -- --country=PT
 *   npm run travel:catalog:geocode-from-geonames -- --max-countries=10
 *   npm run travel:catalog:geocode-from-geonames -- --status
 *
 * Opções:
 *   --dry-run              Não escreve na BD
 *   --limit=N              Máx hotéis a processar (0 = todos)
 *   --country=XX           Apenas um país (ISO alpha-2, ex: PT, FR, BR)
 *   --max-countries=N      Processa só os N países com mais hotéis pendentes
 *   --batch-size=N         DB commit batch size (default 500)
 *   --status               Mostra estado e distribuição por país
 *   --verbose              Mostra progresso detalhado
 *   --skip-download        Usa cache local (não volta a descarregar)
 *   --min-match-score=N    Score mínimo para fuzzy match (0.0-1.0, default 0.80)
 */

import { PrismaClient } from '@prisma/client';
import AdmZip from 'adm-zip';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Project helpers
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CACHE_DIR = resolve(ROOT, 'data', 'geonames-cache');

import { loadProjectEnv } from './lib/load-env.mjs';
import { fold, nameSimilarity } from './lib/cost-of-living-data.mjs';
import { COUNTRY_NAMES } from './lib/country-names.mjs';

const BASE_URL = 'https://download.geonames.org/export/dump/';
const FONTE = 'geonames_htl';

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
function parseArgs() {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '--status' || arg === '--dry-run' || arg === '--verbose' || arg === '--skip-download') {
      a[arg.slice(2)] = true;
    } else if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      if (eq > 0) a[arg.slice(2, eq)] = arg.slice(eq + 1);
      else a[arg.slice(2)] = process.argv[++i] ?? true;
    }
  }
  return a;
}

// ---------------------------------------------------------------------------
// Download + extract HTL entries from a country ZIP
// ---------------------------------------------------------------------------

/**
 * Download a {CODE}.zip from GeoNames and extract HTL entries.
 * Returns array of { name, asciiName, lat, lon, countryCode }.
 * Caches the extracted HTL JSON locally for reuse.
 */
async function downloadAndExtractHtl(countryCode) {
  const cacheFile = join(CACHE_DIR, `${countryCode}-htl.json`);
  const zipFile = join(CACHE_DIR, `${countryCode}.zip`);

  // Try cache first
  if (existsSync(cacheFile)) {
    try {
      return JSON.parse(readFileSync(cacheFile, 'utf-8'));
    } catch { /* fall through */ }
  }

  // Download ZIP
  const url = `${BASE_URL}${countryCode}.zip`;
  if (!existsSync(zipFile)) {
    const resp = await fetch(url, { signal: AbortSignal.timeout(120_000) });
    if (!resp.ok) {
      if (resp.status === 404) return [];
      throw new Error(`HTTP ${resp.status} for ${url}`);
    }
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(zipFile, Buffer.from(await resp.arrayBuffer()));
  }

  // Extract .txt from ZIP
  const zip = new AdmZip(zipFile);
  const entry = zip.getEntry(`${countryCode}.txt`);
  if (!entry) return [];

  const text = zip.readAsText(entry);
  const hotels = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (!trimmed.includes('HTL')) continue;  // quick skip

    const cols = trimmed.split('\t');
    if (cols.length < 8) continue;
    if (cols[6]?.trim() !== 'S' || cols[7]?.trim() !== 'HTL') continue;

    const name = (cols[1] || '').trim();
    const asciiName = (cols[2] || '').trim();
    const lat = parseFloat(cols[4]);
    const lon = parseFloat(cols[5]);

    if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

    hotels.push({
      name,
      asciiName,
      alternatenames: (cols[3] || '').split(',').map(s => s.trim()).filter(Boolean),
      lat,
      lon,
      countryCode: (cols[8] || '').trim(),
    });
  }

  // Cache the extracted HTL entries
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cacheFile, JSON.stringify(hotels));
  return hotels;
}

// ---------------------------------------------------------------------------
// Matching logic
// ---------------------------------------------------------------------------

/**
 * Build a Map<foldedName, geonameEntry[]> for fast lookups.
 */
function buildGeoIndex(geonameHotels) {
  const index = new Map();
  for (const h of geonameHotels) {
    const keys = new Set();

    // Primary name
    keys.add(fold(h.name));
    // ASCII name
    if (h.asciiName && h.asciiName !== h.name) keys.add(fold(h.asciiName));
    // Alternate names
    for (const alt of h.alternatenames) {
      const f = fold(alt);
      if (f.length > 1) keys.add(f);
    }

    for (const key of keys) {
      if (!index.has(key)) index.set(key, []);
      index.get(key).push(h);
    }
  }
  return index;
}

/**
 * Match a hotel nome against the GeoNames index for a country.
 * Returns { lat, lon, matchType } or null.
 */
function matchHotel(hotelNome, geoIndex, minScore) {
  const key = fold(hotelNome);
  if (!key || key.length < 2) return null;

  // 1. Exact match
  if (geoIndex.has(key)) {
    const matches = geoIndex.get(key);
    // Prefer shorter names (more likely the actual hotel name)
    matches.sort((a, b) => a.name.length - b.name.length);
    return { lat: matches[0].lat, lon: matches[0].lon, matchType: 'exact' };
  }

  // 2. Substring match
  for (const [geoKey, entries] of geoIndex) {
    if (geoKey.includes(key) || key.includes(geoKey)) {
      entries.sort((a, b) => a.name.length - b.name.length);
      return { lat: entries[0].lat, lon: entries[0].lon, matchType: 'substring' };
    }
  }

  // 3. Fuzzy match (Dice coefficient)
  let bestScore = minScore;
  let best = null;
  for (const [geoKey, entries] of geoIndex) {
    if (geoKey.length < 4 || key.length < 4) continue;
    const score = nameSimilarity(key, geoKey);
    if (score > bestScore) {
      bestScore = score;
      entries.sort((a, b) => a.name.length - b.name.length);
      best = { lat: entries[0].lat, lon: entries[0].lon, matchType: 'fuzzy', score };
    }
  }

  return best;
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

async function printStatus(prisma) {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  📊 Estado Geocoding — wv_hotels');
  console.log('══════════════════════════════════════════════════\n');

  const [total, withCoords, foundMarked, notFoundMarked] = await Promise.all([
    prisma.wvHotel.count(),
    prisma.wvHotel.count({ where: { latitude: { not: null }, longitude: { not: null } } }),
    prisma.wvHotel.count({ where: { fonte: FONTE } }),
    prisma.wvHotel.count({ where: { fonte: 'geo_not_found' } }),
  ]);

  const pct = total > 0 ? (withCoords / total * 100).toFixed(1) : '0.0';
  console.log(`  Total hotéis       : ${total.toLocaleString()}`);
  console.log(`  Com coordenadas    : ${withCoords.toLocaleString()} (${pct}%)`);
  console.log(`  Marcados geo_found : ${foundMarked.toLocaleString()}`);
  console.log(`  Marcados not_found : ${notFoundMarked.toLocaleString()}`);
  console.log(`  Pendentes          : ${(total - withCoords).toLocaleString()}\n`);

  // Distribution by country (top 20)
  const byCountry = await prisma.$queryRawUnsafe(`
    SELECT d.pais_code AS code, d.pais AS name, COUNT(*)::int AS pending
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND h.longitude IS NULL
      AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', 'geo_not_found'))
    GROUP BY d.pais_code, d.pais
    ORDER BY pending DESC
    LIMIT 20
  `);

  if (byCountry?.length) {
    console.log('  Top 20 países com hotéis pendentes:');
    console.log('  ────────────────────────────────────────────────');
    for (const r of byCountry) {
      const code = (r.code || '??').padEnd(4);
      const name = (r.name || 'Desconhecido').padEnd(25);
      const count = String(Number(r.pending)).padStart(8);
      console.log(`   ${code} ${name} ${count}`);
    }
    console.log();
  }

  // Cache stats
  if (existsSync(CACHE_DIR)) {
    const files = readdirSync(CACHE_DIR).filter(f => f.endsWith('-htl.json'));
    console.log(`  Cache GeoNames: ${files.length} países em ${CACHE_DIR}`);
  } else {
    console.log('  Cache GeoNames: vazio (corre o script para descarregar)');
  }
  console.log();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  loadProjectEnv(ROOT);
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
    const COUNTRY = (A.country || '').toUpperCase();
    const MAX_COUNTRIES = parseInt(A['max-countries'] || '0') || 0;
    const LIMIT = parseInt(A.limit || '0') || 0;
    const BATCH_SIZE = Math.min(parseInt(A['batch-size'] || '500'), 2000);
    const VERBOSE = !!A.verbose;
    const SKIP_DOWNLOAD = !!A['skip-download'];
    const MIN_SCORE = parseFloat(A['min-match-score'] || '0.80');

    console.log('\n══════════════════════════════════════════════════');
    console.log('  🏨 Geocoding via GeoNames (HTL entries)');
    console.log('══════════════════════════════════════════════════\n');
    console.log(`  dry-run=${DRY_RUN}  country=${COUNTRY || 'ALL'}  max-countries=${MAX_COUNTRIES || 'ALL'}`);
    console.log(`  batch-size=${BATCH_SIZE}  limit=${LIMIT || 'ALL'}  min-score=${MIN_SCORE}`);
    console.log(`  skip-download=${SKIP_DOWNLOAD}  cache=${CACHE_DIR}\n`);

    // ── Get pending hotels grouped by country ──
    const pendingByCountry = await prisma.$queryRawUnsafe(`
      SELECT d.pais_code AS code, d.pais AS name, COUNT(*)::int AS total
      FROM wv_hotels h
      JOIN wv_destinations d ON d.id = h.destino_id
      WHERE h.latitude IS NULL AND h.longitude IS NULL
        AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', 'geo_not_found'))
        ${COUNTRY ? `AND d.pais_code = '${COUNTRY}'` : ''}
      GROUP BY d.pais_code, d.pais
      ORDER BY total DESC
    `);

    if (!pendingByCountry?.length) {
      console.log('  ✅ Nenhum hotel pendente encontrado!');
      return;
    }

    let targetCountries = pendingByCountry
      .map(r => ({ code: r.code, name: r.name, total: Number(r.total) }))
      .filter(r => r.code && r.code.length === 2 && COUNTRY_NAMES[r.code]);

    if (MAX_COUNTRIES > 0) {
      targetCountries = targetCountries.slice(0, MAX_COUNTRIES);
    }

    console.log(`  Países com hotéis pendentes: ${targetCountries.length}`);
    console.log(`  Total hotéis pendentes     : ${targetCountries.reduce((s, c) => s + c.total, 0).toLocaleString()}\n`);

    // ── Process each country ──
    let totalFound = 0;
    let totalProcessed = 0;
    let totalErrors = 0;
    const startTime = Date.now();

    for (let ci = 0; ci < targetCountries.length; ci++) {
      const { code, name, total } = targetCountries[ci];
      console.log(`  [${ci + 1}/${targetCountries.length}] ${code} ${(name || '').padEnd(25)} ${total.toLocaleString().padStart(8)} hotéis`);

      // Download / load GeoNames HTL entries for this country
      let geonameHotels;
      try {
        geonameHotels = await downloadAndExtractHtl(code);
      } catch (err) {
        console.log(`    ❌ Download error: ${err.message}`);
        totalErrors++;
        continue;
      }

      if (!geonameHotels?.length) {
        console.log(`    ⚠  Sem entries HTL no GeoNames para ${code}`);
        continue;
      }

      if (VERBOSE) console.log(`    📥 ${geonameHotels.length} hotéis no GeoNames`);

      // Build index
      const geoIndex = buildGeoIndex(geonameHotels);

      // Fetch pending hotels for this country from DB
      const hotels = await prisma.wvHotel.findMany({
        where: {
          latitude: null,
          longitude: null,
          OR: [
            { fonte: null },
            { fonte: { notIn: ['rejected_geo', 'geo_not_found'] } },
          ],
          destino: { paisCode: code },
        },
        select: { id: true, nome: true },
        orderBy: { id: 'asc' },
        ...(LIMIT > 0 ? { take: LIMIT } : {}),
      });

      if (!hotels.length) {
        console.log(`    ✅ Nenhum hotel pendente (já processados)`);
        continue;
      }

      // Match
      const foundBatch = [];
      const notFoundBatch = [];
      for (const h of hotels) {
        const match = matchHotel(h.nome, geoIndex, MIN_SCORE);
        if (match) {
          foundBatch.push({
            id: h.id,
            lat: match.lat,
            lon: match.lon,
            matchType: match.matchType,
          });
        } else {
          notFoundBatch.push(h.id);
        }
      }

      totalProcessed += hotels.length;
      totalFound += foundBatch.length;
      const pct = hotels.length > 0 ? (foundBatch.length / hotels.length * 100).toFixed(1) : '0.0';
      console.log(`    ✅ Match: ${foundBatch.length}/${hotels.length} (${pct}%)`);

      // Log match type breakdown
      if (foundBatch.length > 0 && VERBOSE) {
        const byType = {};
        for (const f of foundBatch) {
          byType[f.matchType] = (byType[f.matchType] || 0) + 1;
        }
        for (const [type, count] of Object.entries(byType)) {
          console.log(`       ${type}: ${count}`);
        }
      }

      // Update DB
      if (!DRY_RUN && foundBatch.length > 0) {
        // Batch update using VALUES
        for (let i = 0; i < foundBatch.length; i += BATCH_SIZE) {
          const batch = foundBatch.slice(i, i + BATCH_SIZE);
          const cases = batch.map(r =>
            `(${r.id}::int, ${r.lat}::real, ${r.lon}::real, '${FONTE}')`
          ).join(',\n');

          await prisma.$executeRawUnsafe(`
            UPDATE wv_hotels AS h
            SET latitude = v.lat,
                longitude = v.lon,
                fonte = v.fonte
            FROM (VALUES
              ${cases}
            ) AS v(id, lat, lon, fonte)
            WHERE h.id = v.id
          `);
        }
      }

      // Mark not found
      if (!DRY_RUN && notFoundBatch.length > 0) {
        for (let i = 0; i < notFoundBatch.length; i += BATCH_SIZE) {
          const batch = notFoundBatch.slice(i, i + BATCH_SIZE);
          const idList = batch.join(',');
          await prisma.$executeRawUnsafe(
            `UPDATE wv_hotels SET fonte = 'geo_not_found' WHERE id IN (${idList})`
          );
        }
      }

      // ETA
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const rate = totalProcessed / parseFloat(elapsed);
      const remaining = targetCountries.slice(ci + 1).reduce((s, c) => s + c.total, 0);
      const eta = rate > 0 ? (remaining / rate).toFixed(0) : '?';
      process.stdout.write(`    ⏱  ${elapsed}s elapsed · ${rate.toFixed(1)} hotels/s · ETA ${eta}s\n`);
    }

    // ── Summary ──
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    console.log('\n══════════════════════════════════════════════════');
    console.log('  ✅ Pipeline concluída!');
    console.log('══════════════════════════════════════════════════\n');
    console.log(`  Países processados : ${targetCountries.length}`);
    console.log(`  Hotéis processados : ${totalProcessed.toLocaleString()}`);
    console.log(`  Com coordenadas    : ${totalFound.toLocaleString()}`);
    console.log(`  Erros              : ${totalErrors}`);
    console.log(`  Tempo total        : ${elapsed}s`);
    console.log(`  Fonte              : ${FONTE}\n`);

    if (DRY_RUN) {
      console.log('  (dry-run — nada foi alterado na BD)\n');
    }

    // Final status
    await printStatus(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
