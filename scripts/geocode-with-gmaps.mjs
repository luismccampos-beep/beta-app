#!/usr/bin/env node
/**
 * geocode-with-gmaps.mjs
 *
 * Usa o Google Maps Scraper (Docker, localhost:8001) para geocodificar
 * destinos prioritários (com mais hotéis primeiro).
 *
 * Uso:
 *   node scripts/geocode-with-gmaps.mjs --limit=20
 *   node scripts/geocode-with-gmaps.mjs --dry-run --limit=5
 *   node scripts/geocode-with-gmaps.mjs --status
 *   node scripts/geocode-with-gmaps.mjs --min-hotels=10
 *
 * Flags:
 *   --limit=N         Máx destinos a processar (0 = todos)
 *   --dry-run         Não escreve na BD
 *   --min-hotels=N    Apenas destinos com >= N hotéis (default 5)
 *   --status          Mostra estado
 *   --skip-hotels     Não copia coords para hotéis
 */

import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const GMAPS_API = 'http://localhost:8001';

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
    if (arg === '--status' || arg === '--dry-run' || arg === '--skip-hotels') {
      a[arg.slice(2)] = true;
    } else if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      if (eq > 0) a[arg.slice(2, eq)] = arg.slice(eq + 1);
      else a[arg.slice(2)] = process.argv[++i] ?? true;
    }
  }
  return a;
}

async function gmapsGeocode(query) {
  try {
    const url = `${GMAPS_API}/scrape-get?query=${encodeURIComponent(query)}&max_places=3&headless=true&lang=en`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(180000) });
    if (!resp.ok) return null;
    const results = await resp.json();
    if (!results?.length) return null;
    for (const place of results) {
      if (place.coordinates?.latitude && place.coordinates?.longitude) {
        return { lat: place.coordinates.latitude, lon: place.coordinates.longitude, name: place.name };
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function main() {
  loadEnv();
  const A = parseArgs();

  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
  });

  try {
    if (A.status) {
      const r = await prisma.$queryRawUnsafe("SELECT COUNT(*)::int AS total FROM wv_destinations WHERE latitude IS NULL AND longitude IS NULL AND pais_code != 'XX'");
      const h = await prisma.$queryRawUnsafe("SELECT COUNT(*)::int AS total FROM wv_hotels WHERE latitude IS NULL AND longitude IS NULL AND (fonte IS NULL OR fonte NOT IN ('rejected_geo','geo_not_found'))");
      console.log(`Destinos pendentes: ${r?.[0]?.total ?? 0}`);
      console.log(`Hotéis pendentes: ${h?.[0]?.total ?? 0}`);
      return;
    }

    const DRY_RUN = !!A['dry-run'];
    const LIMIT = parseInt(A.limit || '0');
    const MIN_HOTELS = parseInt(A['min-hotels'] || '5');
    const SKIP_HOTELS = !!A['skip-hotels'];

    console.log(`\n=== Geocode com Google Maps Scraper ===`);
    console.log(`  dry-run=${DRY_RUN}  limit=${LIMIT || 'ALL'}  min-hotels=${MIN_HOTELS}`);
    console.log();

    // Fetch destinos pendentes com mais hotéis primeiro
    const dests = await prisma.$queryRawUnsafe(`
      SELECT d.id, d.nome, d.pais_code, d.hotel_count
      FROM wv_destinations d
      WHERE d.latitude IS NULL
        AND d.longitude IS NULL
        AND d.pais_code != 'XX'
        AND d.hotel_count >= $1::int
      ORDER BY d.hotel_count DESC
    `, MIN_HOTELS);

    const allDests = (dests || []).map(r => ({
      id: r.id,
      nome: r.nome ?? '',
      pais_code: r.pais_code ?? '',
      hotelCount: r.hotel_count ?? 0,
    }));

    console.log(`Destinos pendentes com >= ${MIN_HOTELS} hotéis: ${allDests.length}`);

    let toProcess = allDests;
    if (LIMIT > 0) toProcess = toProcess.slice(0, LIMIT);

    console.log(`A processar: ${toProcess.length} destinos\n`);

    let found = 0;
    let notFound = 0;
    let errors = 0;
    const startTime = Date.now();

    for (let i = 0; i < toProcess.length; i++) {
      const d = toProcess[i];
      const query = d.nome;
      const pct = ((i + 1) / toProcess.length * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);

      process.stdout.write(`\r  [${i + 1}/${toProcess.length} (${pct}%) | ${elapsed}s | found: ${found}] ${query.padEnd(50)}`);

      const result = await gmapsGeocode(query);

      if (result) {
        found++;
        if (!DRY_RUN) {
          // Update destination
          await prisma.$executeRawUnsafe(
            `UPDATE wv_destinations SET latitude = $1::real, longitude = $2::real WHERE id = $3::int`,
            result.lat, result.lon, d.id
          );

          // Copy to hotels
          if (!SKIP_HOTELS) {
            await prisma.$executeRawUnsafe(`
              UPDATE wv_hotels h
              SET latitude = $1::real, longitude = $2::real, fonte = 'dest_coords'
              WHERE h.destino_id = $3::int
                AND h.latitude IS NULL AND h.longitude IS NULL
                AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', 'geo_not_found'))
            `, result.lat, result.lon, d.id);
          }
        }
      } else {
        notFound++;
      }
    }

    console.log(); // newline
    const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    console.log(`\n=== Run complete ===`);
    console.log(`  Processed  : ${toProcess.length}`);
    console.log(`  Found      : ${found}`);
    console.log(`  Not found  : ${notFound}`);
    console.log(`  Elapsed    : ${totalElapsed}s`);
    if (DRY_RUN) console.log(`  (dry-run - nothing written to DB)`);

  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });