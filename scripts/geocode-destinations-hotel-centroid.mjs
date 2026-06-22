#!/usr/bin/env node
/**
 * geocode-destinations-hotel-centroid.mjs
 *
 * Para destinos que têm hotéis geocodificados mas não têm coordenadas próprias,
 * calcula o centróide (média das coordenadas) dos hotéis e atribui ao destino.
 *
 * Isto resolve destinos onde:
 * - O GeoNames não tem a cidade (pequenas localidades)
 * - O nome do destino corresponde a uma região/área em vez de cidade
 * - Os hotéis têm coordenadas fiáveis que indicam a localização do destino
 *
 * Uso:
 *   node scripts/geocode-destinations-hotel-centroid.mjs
 *   node scripts/geocode-destinations-hotel-centroid.mjs --dry-run
 *   node scripts/geocode-destinations-hotel-centroid.mjs --country=PT
 *   node scripts/geocode-destinations-hotel-centroid.mjs --limit=500
 *   node scripts/geocode-destinations-hotel-centroid.mjs --min-hotels=2
 *   node scripts/geocode-destinations-hotel-centroid.mjs --status
 *
 * Opções:
 *   --dry-run              Não escreve na BD
 *   --limit=N              Máx destinos a processar (0 = todos)
 *   --country=XX           Apenas um país (ISO alpha-2, ex: PT, FR, BR)
 *   --min-hotels=N         Mínimo de hotéis geocodificados necessários (default: 2)
 *   --batch-size=N         DB commit batch size (default 200)
 *   --status               Mostra estado actual
 */

import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

import { loadProjectEnv } from './lib/load-env.mjs';

const FONTE = 'hotel_centroid';

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
function parseArgs() {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '--status' || arg === '--dry-run') {
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
// Status
// ---------------------------------------------------------------------------
async function printStatus(prisma) {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  📊 Estado Geocoding — wv_destinations (Hotel Centroid)');
  console.log('══════════════════════════════════════════════════\n');

  const [total, withCoords, withoutCoords] = await Promise.all([
    prisma.wvDestination.count(),
    prisma.wvDestination.count({ where: { latitude: { not: null }, longitude: { not: null } } }),
    prisma.wvDestination.count({ where: { latitude: null, longitude: null } }),
  ]);

  const pct = total > 0 ? (withCoords / total * 100).toFixed(1) : '0.0';
  console.log(`  Total destinos       : ${total.toLocaleString()}`);
  console.log(`  Com coordenadas      : ${withCoords.toLocaleString()} (${pct}%)`);
  console.log(`  Sem coordenadas      : ${withoutCoords.toLocaleString()}\n`);

  // Quantos destinos sem coords têm hotéis geocodificados?
  const withHotelCoords = await prisma.$queryRawUnsafe(`
    SELECT COUNT(DISTINCT d.id)::int AS count
    FROM wv_destinations d
    JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.latitude IS NULL AND d.longitude IS NULL
      AND h.latitude IS NOT NULL AND h.longitude IS NOT NULL
      AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo'))
  `);

  console.log(`  Com hotéis geocodificados: ${(withHotelCoords[0]?.count ?? 0).toLocaleString()}`);
  console.log(`  (pode ser resolvido por este script)\n`);

  // Top countries
  const byCountry = await prisma.$queryRawUnsafe(`
    SELECT d.pais_code AS code, d.pais AS name,
           COUNT(DISTINCT d.id)::int AS pending,
           COUNT(DISTINCT h.id)::int AS hotels_with_coords
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
      AND h.latitude IS NOT NULL AND h.longitude IS NOT NULL
      AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo'))
    WHERE d.latitude IS NULL AND d.longitude IS NULL
    GROUP BY d.pais_code, d.pais
    HAVING COUNT(DISTINCT h.id) > 0
    ORDER BY pending DESC
    LIMIT 20
  `);

  if (byCountry?.length) {
    console.log('  Top 20 países com destinos resolvíveis por hotel centroid:');
    console.log('  ──────────────────────────────────────────────────────────────');
    for (const r of byCountry) {
      const code = (r.code || '??').padEnd(4);
      const name = (r.name || 'Desconhecido').padEnd(22);
      const pending = String(Number(r.pending)).padStart(6);
      const hwc = String(Number(r.hotels_with_coords)).padStart(6);
      console.log(`   ${code} ${name} dest=${pending} hotéis_geo=${hwc}`);
    }
    console.log();
  }
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
    const LIMIT = parseInt(A.limit || '0') || 0;
    const MIN_HOTELS = Math.max(1, parseInt(A['min-hotels'] || '2') || 2);
    const BATCH_SIZE = Math.min(parseInt(A['batch-size'] || '200'), 1000);

    console.log('\n══════════════════════════════════════════════════');
    console.log('  🏨 Geocoding de Destinos via Hotel Centroid');
    console.log('══════════════════════════════════════════════════\n');
    console.log(`  dry-run=${DRY_RUN}  country=${COUNTRY || 'ALL'}  limit=${LIMIT || 'ALL'}`);
    console.log(`  min-hotels=${MIN_HOTELS}  batch-size=${BATCH_SIZE}\n`);

    await printStatus(prisma);

    const startTime = Date.now();

    // ── Fetch destinations without coords but with geocoded hotels ──
    // Get destination IDs that have at least MIN_HOTELS geocoded hotels
    const countryFilter = COUNTRY ? 'AND d.pais_code = $1' : '';
    const params = COUNTRY ? [COUNTRY, MIN_HOTELS] : [MIN_HOTELS];
    const limitClause = LIMIT > 0 ? `LIMIT $${params.length + 1}` : '';
    if (LIMIT > 0) params.push(LIMIT);

    const destRows = await prisma.$queryRawUnsafe(`
      SELECT d.id, d.nome, d.pais, d.pais_code AS "paisCode", d.slug,
             AVG(h.latitude)::real AS avg_lat,
             AVG(h.longitude)::real AS avg_lon,
             COUNT(h.id)::int AS hotel_count,
             MIN(h.latitude)::real AS min_lat, MAX(h.latitude)::real AS max_lat,
             MIN(h.longitude)::real AS min_lon, MAX(h.longitude)::real AS max_lon
      FROM wv_destinations d
      JOIN wv_hotels h ON h.destino_id = d.id
      WHERE d.latitude IS NULL AND d.longitude IS NULL
        AND h.latitude IS NOT NULL AND h.longitude IS NOT NULL
        AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo'))
        ${countryFilter}
      GROUP BY d.id, d.nome, d.pais, d.pais_code, d.slug
      HAVING COUNT(h.id) >= $${COUNTRY ? '2' : '1'}
      ORDER BY hotel_count DESC
      ${limitClause}
    `, ...params);

    if (!destRows?.length) {
      console.log('  ✅ Nenhum destino sem coordenadas com hotéis geocodificados encontrado!');
      return;
    }

    console.log(`  🎯 ${destRows.length.toLocaleString()} destinos a processar.\n`);

    // Build results
    const results = [];
    let skippedOutliers = 0;

    for (const row of destRows) {
      const avgLat = row.avg_lat;
      const avgLon = row.avg_lon;
      const rangeLat = row.max_lat - row.min_lat;
      const rangeLon = row.max_lon - row.min_lon;

      // Skip destinations where hotels are too spread out (> 5 degrees)
      // Indicating the hotels might be in very different locations
      if (rangeLat > 5 || rangeLon > 5) {
        if (skippedOutliers === 0) {
          console.log(`  ⚠  Alguns destinos com hotéis muito dispersos (>5° range) serão ignorados:`);
        }
        if (skippedOutliers < 10) {
          console.log(`     ${row.nome} (${row.paisCode}) — ${row.hotel_count} hotéis, range ${rangeLat.toFixed(2)}° x ${rangeLon.toFixed(2)}°`);
        }
        skippedOutliers++;
        continue;
      }

      results.push({
        id: row.id,
        nome: row.nome,
        paisCode: row.paisCode,
        lat: avgLat,
        lon: avgLon,
        hotelCount: row.hotel_count,
        rangeLat,
        rangeLon,
      });
    }

    if (skippedOutliers > 10) {
      console.log(`     ... e mais ${skippedOutliers - 10} destinos ignorados.`);
    }

    if (!results.length) {
      console.log(`\n  ✅ Todos os destinos foram ignorados (hotéis muito dispersos).`);
      return;
    }

    console.log(`\n  📊 Resultados:`);
    console.log(`  Destinos com centróide válido : ${results.length.toLocaleString()}`);
    console.log(`  Ignorados (hotéis dispersos)  : ${skippedOutliers.toLocaleString()}`);

    // Show sample
    const sample = results.slice(0, 10);
    console.log(`\n  📍 Amostra dos primeiros 10:`);
    for (const r of sample) {
      console.log(`     ${r.nome.padEnd(30)} (${r.paisCode}) — ${r.hotelCount} hotéis → ${r.lat.toFixed(5)}, ${r.lon.toFixed(5)}  [range: ${r.rangeLat.toFixed(3)}° × ${r.rangeLon.toFixed(3)}°]`);
    }
    console.log();

    // ── Write to DB ──
    if (!DRY_RUN) {
      console.log(`  💾 Escrevendo ${results.length} coordenadas nos destinos...`);
      let committed = 0;
      for (let i = 0; i < results.length; i += BATCH_SIZE) {
        const batch = results.slice(i, i + BATCH_SIZE);
        const cases = batch
          .map(r => `(${r.id}::int, ${r.lat}::real, ${r.lon}::real)`)
          .join(',\n');

        await prisma.$executeRawUnsafe(`
          UPDATE wv_destinations AS d
          SET latitude = v.lat, longitude = v.lon
          FROM (VALUES ${cases}) AS v(id, lat, lon)
          WHERE d.id = v.id
        `);
        committed += batch.length;
        process.stdout.write(`\r    atualizados: ${committed}/${results.length}`);
      }
      console.log();
      console.log(`  ✅ DB atualizada!`);

      // Also propagate to hotels without coords
      const destIds = results.map(r => r.id);
      const applyResult = await prisma.$executeRawUnsafe(`
        UPDATE wv_hotels AS h
        SET latitude = d.latitude, longitude = d.longitude, fonte = '${FONTE}'
        FROM wv_destinations AS d
        WHERE h.destino_id = d.id
          AND h.latitude IS NULL AND h.longitude IS NULL
          AND d.id = ANY($1::int[])
      `, destIds);
      console.log(`  🏨 ${applyResult} hotéis sem coordenadas atualizados com centróide`);
    } else {
      console.log(`  🔍 (dry-run — nada foi alterado na BD)`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    console.log(`\n  ⏱  Tempo total: ${elapsed}s\n`);

    await printStatus(prisma);

  } finally {
    await prisma.$disconnect();
  }
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
