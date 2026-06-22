/**
 * validate-hotels-ge-distribution.mjs
 *
 * Valida a distribuição de hotéis na BD contra dados de referência do
 * Google Earth network link (GE Hotels) — grátis, sem API key.
 *
 * 3 análises:
 *   1. Distribuição   — contagem DB vs GE lado a lado por país
 *   2. Cobertura      — % dos hotéis GE que temos na BD
 *   3. Sanity check   — países com excesso/defeito suspeito (flags)
 *
 * Uso:
 *   npm run travel:catalog:validate-ge-distribution
 *   npm run travel:catalog:validate-ge-distribution -- --limit 10
 *   npm run travel:catalog:validate-ge-distribution -- --ge-csv data/hotels/ge-hotels-counts.csv
 *   npm run travel:catalog:validate-ge-distribution -- --no-save
 *
 * Flags de sanity check:
 *   ⚠ OVER   DB >> GE (prováveis duplicados ou falsos positivos)
 *   ⚠ UNDER  DB << GE (prováveis gaps na cobertura)
 *   ⚠ MISS   País no GE mas sem hotéis na BD
 *   ⚠ EXTRA  País com hotéis na BD mas não no GE
 */

import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COUNTRY_NAMES, countryName } from './lib/country-names.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

loadProjectEnv(ROOT);

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

// ─── CLI args ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const idx = process.argv.indexOf(name);
  if (idx !== -1) return process.argv[idx + 1] ?? fallback;
  for (const a of process.argv) {
    if (a.startsWith(`${name}=`)) return a.split('=')[1] ?? fallback;
  }
  return fallback;
};

const LIMIT = parseInt(argValue('--limit', '0'), 10) || 0;
const MIN_HOTELS = parseInt(argValue('--min-hotels', '5'), 10) || 5;
const OVER_THRESHOLD = parseFloat(argValue('--over-threshold', '2.0')) || 2.0;  // DB/GE > 2x
const UNDER_THRESHOLD = parseFloat(argValue('--under-threshold', '0.15')) || 0.15; // DB/GE < 15%
const GE_CSV = argValue('--ge-csv', join(ROOT, 'data', 'hotels', 'ge-hotels-counts.csv'));
const SAVE = !args.includes('--no-save');

// ─── Load GE CSV ────────────────────────────────────────────────────────────

function loadGeData(csvPath) {
  console.log(`📂 Loading GE hotel counts from: ${csvPath}`);
  const content = readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(';');
    if (parts.length < 3) continue;

    const code = parts[0].trim().toUpperCase();
    const name = parts[1].trim();
    const count = parseInt(parts[2].trim(), 10);

    if (code && !isNaN(count)) {
      data.push({ code, name, count });
    }
  }

  console.log(`✅ Loaded ${data.length} countries from GE data\n`);
  return data;
}

// ─── DB query ───────────────────────────────────────────────────────────────

async function queryDb() {
  console.log('📂 Querying database for hotel counts by country...');

  // Total hotels in DB
  const totalDbHotels = await prisma.wvHotel.count();

  // Hotels with coordinates
  const totalWithCoords = await prisma.wvHotel.count({
    where: { latitude: { not: null }, longitude: { not: null } },
  });

  // Hotels by country (via wv_destinations.pais_code)
  const byCountry = await prisma.$queryRaw`
    SELECT
      d.pais_code AS code,
      d.pais AS country_name,
      COUNT(h.id)::int AS total_hotels,
      COUNT(CASE WHEN h.latitude IS NOT NULL AND h.longitude IS NOT NULL THEN 1 END)::int AS with_coords,
      COUNT(CASE WHEN h.fonte = 'rejected_geo' THEN 1 END)::int AS rejected,
      COUNT(CASE WHEN h.fonte = 'geo_wrong_country' THEN 1 END)::int AS wrong_country,
      COUNT(CASE WHEN h.fonte = 'geo_found' THEN 1 END)::int AS geo_found,
      COUNT(CASE WHEN h.fonte IS NULL THEN 1 END)::int AS no_fonte,
      COUNT(CASE WHEN h.fonte IS NOT NULL AND h.fonte NOT IN ('rejected_geo', 'geo_wrong_country', 'geo_found') THEN 1 END)::int AS other_fonte
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    GROUP BY d.pais_code, d.pais
    ORDER BY total_hotels DESC
  `;

  // Total distinct countries in DB
  const [{ count: totalCountries }] = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT pais_code)::int AS count FROM wv_destinations
  `;

  console.log(`   Total hotéis na BD    : ${totalDbHotels.toLocaleString()}`);
  console.log(`   Com coordenadas       : ${totalWithCoords.toLocaleString()}`);
  console.log(`   Países distintos      : ${totalCountries}`);
  console.log();

  return { byCountry, totalDbHotels, totalWithCoords, totalCountries };
}

// ─── Analysis engine ────────────────────────────────────────────────────────

function analyze(geData, dbData) {
  const geMap = new Map(geData.map(d => [d.code, d]));
  const dbMap = new Map(dbData.map(d => [d.code, d]));

  // Merge all country codes
  const allCodes = new Set([...geMap.keys(), ...dbMap.keys()]);
  const results = [];

  for (const code of allCodes) {
    const ge = geMap.get(code);
    const db = dbMap.get(code);
    const geCount = ge?.count ?? 0;
    const dbCount = db?.total_hotels ?? 0;

    if (dbCount < MIN_HOTELS && geCount === 0) continue;

    const ratio = geCount > 0 ? dbCount / geCount : (dbCount > 0 ? Infinity : 0);
    const coverage = geCount > 0 ? (dbCount / geCount) * 100 : 0;

    // Sanity flags
    const flags = [];
    if (geCount === 0 && dbCount > 0) flags.push('EXTRA');
    if (dbCount === 0 && geCount > 0) flags.push('MISS');
    if (geCount > 0 && ratio > OVER_THRESHOLD) flags.push('OVER');
    if (geCount > 0 && ratio < UNDER_THRESHOLD) flags.push('UNDER');

    results.push({
      code,
      geName: ge?.name ?? countryName(code),
      dbName: db?.country_name ?? countryName(code),
      geCount,
      dbCount,
      dbWithCoords: db?.with_coords ?? 0,
      dbRejected: db?.rejected ?? 0,
      dbWrongCountry: db?.wrong_country ?? 0,
      dbGeoFound: db?.geo_found ?? 0,
      ratio,
      coverage,
      flags,
    });
  }

  // Sort: GE data countries first (by GE count desc), then extras
  results.sort((a, b) => {
    const aHasGe = a.geCount > 0 ? 0 : 1;
    const bHasGe = b.geCount > 0 ? 0 : 1;
    if (aHasGe !== bHasGe) return aHasGe - bHasGe;
    return b.geCount - a.geCount;
  });

  return results;
}

// ─── Reporting ──────────────────────────────────────────────────────────────

function printReport(results, limit) {
  let displayed = results;
  if (limit > 0) displayed = results.slice(0, limit);

  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  VALIDAÇÃO DE DISTRIBUIÇÃO — Google Earth vs BD');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // ─── 1. Distribution Comparison ────────────────────────────────────────────
  console.log('┌─ 1. DISTRIBUIÇÃO (hotéis por país) ─────────────────────────────┐');
  console.log('');
  console.log('  País           |  GE   |   BD   |  Δ     |  BD/GE  | Cobertura | Flags');
  console.log('  ───────────────┼───────┼────────┼────────┼─────────┼───────────┼────────────────');

  for (const r of displayed) {
    const diff = r.dbCount - r.geCount;
    const diffStr = diff > 0 ? `+${diff.toLocaleString()}` : diff < 0 ? `${diff.toLocaleString()}` : '  0';
    const ratioStr = r.geCount > 0 ? `${r.ratio.toFixed(2)}x` : '  ∞';
    const covStr = r.geCount > 0 ? `${r.coverage.toFixed(1)}%` : '   -';
    const flagStr = r.flags.length > 0 ? r.flags.join(', ') : '';
    const flagIcon = r.flags.includes('OVER') ? '⚠' : r.flags.includes('UNDER') ? '⚡' : r.flags.includes('MISS') ? '❌' : r.flags.includes('EXTRA') ? '➕' : '  ';
    const name = `${r.code} ${r.dbName}`.padEnd(18).slice(0, 18);
    const geStr = r.geCount.toLocaleString().padStart(5);
    const dbStr = r.dbCount.toLocaleString().padStart(6);
    const diffPad = diffStr.padStart(6);
    const ratioPad = ratioStr.padStart(7);
    const covPad = covStr.padStart(9);

    console.log(`  ${name} │ ${geStr} │ ${dbStr} │ ${diffPad} │ ${ratioPad} │ ${covPad} │ ${flagIcon} ${flagStr}`);
  }

  // ─── 2. Coverage Benchmark ──────────────────────────────────────────────────
  console.log('');
  console.log('┌─ 2. COBERTURA (Benchmark vs GE) ────────────────────────────────┐');
  console.log('');

  const geTotal = results.reduce((s, r) => s + r.geCount, 0);
  const dbTotal = results.reduce((s, r) => s + r.dbCount, 0);
  const geCountries = results.filter(r => r.geCount > 0).length;
  const dbCountries = results.filter(r => r.dbCount > 0).length;
  const matchedCountries = results.filter(r => r.geCount > 0 && r.dbCount > 0).length;
  const overallCoverage = geTotal > 0 ? (dbTotal / geTotal) * 100 : 0;

  // Coverage tiers
  const highCoverage = results.filter(r => r.geCount > 0 && r.coverage >= 50).length;
  const mediumCoverage = results.filter(r => r.geCount > 0 && r.coverage >= 10 && r.coverage < 50).length;
  const lowCoverage = results.filter(r => r.geCount > 0 && r.coverage > 0 && r.coverage < 10).length;
  const zeroCoverage = results.filter(r => r.geCount > 0 && r.dbCount === 0).length;

  console.log(`  GE   total hotéis      : ${geTotal.toLocaleString()}`);
  console.log(`  BD   total hotéis      : ${dbTotal.toLocaleString()}`);
  console.log(`  Cobertura global       : ${overallCoverage.toFixed(1)}%`);
  console.log(`  Países no GE           : ${geCountries}`);
  console.log(`  Países na BD           : ${dbCountries}`);
  console.log(`  Países com match       : ${matchedCountries}`);
  console.log();
  console.log(`  Cobertura por escalão:`);
  console.log(`    ≥ 50%   : ${highCoverage} países`);
  console.log(`    10-50%  : ${mediumCoverage} países`);
  console.log(`    < 10%   : ${lowCoverage} países`);
  console.log(`    0%      : ${zeroCoverage} países (sem hotéis na BD)`);

  // ─── 3. Sanity Check ───────────────────────────────────────────────────────
  console.log('');
  console.log('┌─ 3. SANITY CHECK (países suspeitos) ────────────────────────────┐');
  console.log('');

  const over = results.filter(r => r.flags.includes('OVER'));
  const under = results.filter(r => r.flags.includes('UNDER'));
  const missing = results.filter(r => r.flags.includes('MISS'));
  const extras = results.filter(r => r.flags.includes('EXTRA'));

  if (over.length > 0) {
    console.log(`  ⚠ OVER  (BD/GE > ${OVER_THRESHOLD}x — prováveis duplicados):`);
    for (const r of over.sort((a, b) => b.ratio - a.ratio)) {
      console.log(`     ${r.code} ${r.dbName.padEnd(20)} BD:${r.dbCount.toLocaleString().padStart(7)}  GE:${r.geCount.toLocaleString().padStart(7)}  (${r.ratio.toFixed(1)}x)`);
    }
    console.log();
  }

  if (under.length > 0) {
    console.log(`  ⚡ UNDER (BD/GE < ${UNDER_THRESHOLD*100}% — prováveis gaps):`);
    for (const r of under.sort((a, b) => a.coverage - b.coverage)) {
      console.log(`     ${r.code} ${r.dbName.padEnd(20)} BD:${r.dbCount.toLocaleString().padStart(7)}  GE:${r.geCount.toLocaleString().padStart(7)}  (${r.coverage.toFixed(1)}%)`);
    }
    console.log();
  }

  if (missing.length > 0) {
    console.log(`  ❌ MISS  (países no GE sem hotéis na BD):`);
    for (const r of missing) {
      console.log(`     ${r.code} ${r.dbName.padEnd(20)} GE:${r.geCount.toLocaleString()}`);
    }
    console.log();
  }

  if (extras.length > 0) {
    console.log(`  ➕ EXTRA (países com hotéis na BD mas não no GE):`);
    for (const r of extras.sort((a, b) => b.dbCount - a.dbCount).slice(0, 20)) {
      console.log(`     ${r.code} ${r.dbName.padEnd(20)} BD:${r.dbCount.toLocaleString()}`);
    }
    if (extras.length > 20) {
      console.log(`     ... e mais ${extras.length - 20} países`);
    }
    console.log();
  }

  if (over.length === 0 && under.length === 0 && missing.length === 0 && extras.length === 0) {
    console.log('  ✅ Nenhum sanity flag — distribuição consistente com GE!');
    console.log();
  }

  return { totalDbHotels: dbTotal, totalGeHotels: geTotal, overallCoverage, over, under, missing, extras };
}

function saveReport(results, summary) {
  const outputDir = join(ROOT, 'data', 'reports');
  mkdirSync(outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  // CSV report — all countries with comparison
  const csvPath = join(outputDir, `hotels-ge-distribution-${timestamp}.csv`);
  const csvHeader = 'country_code;country_name;ge_hotels;db_hotels;db_with_coords;db_rejected;db_wrong_country;db_geo_found;difference;ratio;coverage_pct;flags\n';
  const csvRows = results.map(r =>
    `${r.code};"${r.dbName}";${r.geCount};${r.dbCount};${r.dbWithCoords};${r.dbRejected};${r.dbWrongCountry};${r.dbGeoFound};${r.dbCount - r.geCount};${r.geCount > 0 ? r.ratio.toFixed(4) : 'NA'};${r.geCount > 0 ? r.coverage.toFixed(2) : 'NA'};"${r.flags.join(', ')}"`
  ).join('\n');
  writeFileSync(csvPath, csvHeader + csvRows, 'utf-8');
  console.log(`📄 Relatório detalhado: ${csvPath}`);

  // Summary report — just the flags
  const summaryPath = join(outputDir, `hotels-ge-flags-${timestamp}.csv`);
  const summaryHeader = 'flag_type;country_code;country_name;db_hotels;ge_hotels;ratio_or_coverage\n';
  const summaryRows = [];

  for (const r of summary.over) {
    summaryRows.push(`OVER;${r.code};"${r.dbName}";${r.dbCount};${r.geCount};${r.ratio.toFixed(2)}x`);
  }
  for (const r of summary.under) {
    summaryRows.push(`UNDER;${r.code};"${r.dbName}";${r.dbCount};${r.geCount};${r.coverage.toFixed(1)}%`);
  }
  for (const r of summary.missing) {
    summaryRows.push(`MISS;${r.code};"${r.dbName}";${r.dbCount};${r.geCount};-`);
  }
  for (const r of summary.extras) {
    summaryRows.push(`EXTRA;${r.code};"${r.dbName}";${r.dbCount};${r.geCount};-`);
  }

  if (summaryRows.length > 0) {
    writeFileSync(summaryPath, summaryHeader + summaryRows.join('\n'), 'utf-8');
    console.log(`📄 Flags resumidas    : ${summaryPath}`);
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  🏨 Google Earth Hotels — Distribution Validation');
  console.log('═══════════════════════════════════════════════════════════════════\n');
  console.log(`  Limite países     : ${LIMIT > 0 ? LIMIT : 'todos'}`);
  console.log(`  Min hotéis/pais   : ${MIN_HOTELS}`);
  console.log(`  Threshold OVER    : BD/GE > ${OVER_THRESHOLD}x`);
  console.log(`  Threshold UNDER   : BD/GE < ${UNDER_THRESHOLD*100}% da GE`);
  console.log(`  Guardar relatório : ${SAVE ? 'sim' : 'não'}`);
  console.log();

  // Load GE data
  const geData = loadGeData(GE_CSV);

  // Query DB
  const dbResult = await queryDb();

  // Analyze
  const results = analyze(geData, dbResult.byCountry);

  // Print report
  const summary = printReport(results, LIMIT);

  // Save CSV report
  if (SAVE) {
    saveReport(results, summary);
  } else {
    console.log('  (--no-save: relatório não guardado em disco)');
  }

  console.log();
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  ✅ Validação completa');
  console.log('═══════════════════════════════════════════════════════════════════');
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
