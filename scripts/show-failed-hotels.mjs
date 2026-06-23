/**
 * Show failed hotels from both validation sources:
 * - hoteis - Folha1.csv (validate-hotels-coords)
 * - hoteis_coordenadas_exatas.csv (validate-hotels-coords-exact)
 *
 * Reads the latest validation reports and displays only DISCREPANCY and NOT_FOUND entries.
 *
 * Usage:
 *   node scripts/show-failed-hotels.mjs
 *   node scripts/show-failed-hotels.mjs --source folha1
 *   node scripts/show-failed-hotels.mjs --source exact
 *   node scripts/show-failed-hotels.mjs --limit 50
 */

import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const args = new Set(process.argv.slice(2));
const argValue = (name, fallback) => {
  const idx = process.argv.indexOf(name);
  if (idx !== -1) return process.argv[idx + 1] ?? fallback;
  for (const a of process.argv) {
    if (a.startsWith(`${name}=`)) return a.split('=')[1] ?? fallback;
  }
  return fallback;
};

const sourceFilter = argValue('--source', 'all'); // 'all', 'folha1', 'exact'
const limit = parseInt(argValue('--limit', '0'), 10) || 0;

function findLatestReport(pattern) {
  const reportsDir = join(process.cwd(), 'data', 'reports');
  try {
    const files = readdirSync(reportsDir)
      .filter(f => f.startsWith(pattern) && f.endsWith('.csv'))
      .map(f => ({
        name: f,
        path: join(reportsDir, f),
        mtime: statSync(join(reportsDir, f)).mtimeMs,
      }))
      .sort((a, b) => b.mtime - a.mtime);
    
    return files.length > 0 ? files[0] : null;
  } catch (err) {
    console.error(`Error reading reports directory: ${err.message}`);
    return null;
  }
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ';' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseReport(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  const header = parseCsvLine(lines[0]);
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i]);
    if (parts.length < header.length) continue;
    
    const row = {};
    header.forEach((col, idx) => {
      row[col.trim()] = parts[idx]?.trim();
    });
    
    results.push(row);
  }
  
  return results;
}

function filterFailed(rows) {
  return rows.filter(row => 
    row.status === 'DISCREPANCY' || row.status === 'NOT_FOUND'
  );
}

function displayResults(failed, sourceLabel, limit) {
  const display = limit > 0 ? failed.slice(0, limit) : failed;
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`SOURCE: ${sourceLabel}`);
  console.log(`Total failed: ${failed.length}${limit > 0 && failed.length > limit ? ` (showing first ${limit})` : ''}`);
  console.log('='.repeat(80));
  
  if (display.length === 0) {
    console.log('✅ No failures found!\n');
    return;
  }
  
  // Group by status
  const byStatus = display.reduce((acc, row) => {
    const status = row.status || 'UNKNOWN';
    if (!acc[status]) acc[status] = [];
    acc[status].push(row);
    return acc;
  }, {});
  
  for (const [status, items] of Object.entries(byStatus)) {
    const icon = status === 'DISCREPANCY' ? '⚠️ ' : '❌';
    console.log(`\n${icon} ${status} (${items.length}):\n`);
    
    for (const item of items) {
      console.log(`  Hotel: ${item.hotel_name}`);
      console.log(`  External: ${item.external_city}, ${item.external_country}`);
      console.log(`    Coords: ${item.external_lat}, ${item.external_lon}`);
      
      if (item.db_city) {
        console.log(`  Database: ${item.db_city}, ${item.db_country}`);
        console.log(`    Coords: ${item.db_lat}, ${item.db_lon}`);
        console.log(`  Distance: ${item.distance_km} km`);
      } else {
        console.log(`  Database: NOT FOUND`);
      }
      console.log();
    }
  }
}

async function main() {
  console.log('=== Failed Hotels Report ===\n');
  
  const sources = [];
  
  if (sourceFilter === 'all' || sourceFilter === 'folha1') {
    const folha1Report = findLatestReport('hotel-coords-validation-');
    if (folha1Report) {
      sources.push({
        label: 'Folha 1 (hoteis - Folha1.csv)',
        file: folha1Report,
        key: 'folha1',
      });
    } else {
      console.log('⚠️  No Folha1 validation report found');
    }
  }
  
  if (sourceFilter === 'all' || sourceFilter === 'exact') {
    const exactReport = findLatestReport('hotel-coords-validation-exact-');
    if (exactReport) {
      sources.push({
        label: 'Exact Coordinates (hoteis_coordenadas_exatas.csv)',
        file: exactReport,
        key: 'exact',
      });
    } else {
      console.log('⚠️  No exact coordinates validation report found');
    }
  }
  
  if (sources.length === 0) {
    console.log('❌ No validation reports found. Run validation scripts first:');
    console.log('   npm run travel:catalog:validate-hotels-coords');
    console.log('   npm run travel:catalog:validate-hotels-coords-exact');
    process.exit(1);
  }
  
  const allFailed = [];
  
  for (const source of sources) {
    console.log(`📂 Loading: ${basename(source.file.path)}`);
    const rows = parseReport(source.file.path);
    const failed = filterFailed(rows);
    
    displayResults(failed, source.label, limit);
    
    // Collect for combined report
    for (const row of failed) {
      allFailed.push({
        ...row,
        source: source.label,
      });
    }
  }
  
  // Combined summary
  if (sources.length > 1) {
    console.log(`\n${'='.repeat(80)}`);
    console.log('COMBINED SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total failed across all sources: ${allFailed.length}`);
    
    const bySource = allFailed.reduce((acc, row) => {
      const source = row.source;
      if (!acc[source]) acc[source] = { total: 0, discrepancies: 0, notFound: 0 };
      acc[source].total++;
      if (row.status === 'DISCREPANCY') acc[source].discrepancies++;
      if (row.status === 'NOT_FOUND') acc[source].notFound++;
      return acc;
    }, {});
    
    console.log('\nBy source:');
    for (const [source, stats] of Object.entries(bySource)) {
      console.log(`  ${source}:`);
      console.log(`    Total: ${stats.total}`);
      console.log(`    Discrepancies: ${stats.discrepancies}`);
      console.log(`    Not Found: ${stats.notFound}`);
    }
    
    // Write combined CSV
    const outputDir = join(process.cwd(), 'data', 'reports');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const csvPath = join(outputDir, `failed-hotels-combined-${timestamp}.csv`);
    
    const csvHeader = 'source;hotel_name;external_city;external_country;external_lat;external_lon;db_city;db_country;db_lat;db_lon;distance_km;status\n';
    const csvRows = allFailed.map(row =>
      `"${row.source}";"${row.hotel_name}";"${row.external_city}";"${row.external_country}";${row.external_lat};${row.external_lon};"${row.db_city || ''}";"${row.db_country || ''}";${row.db_lat || ''};${row.db_lon || ''};${row.distance_km || ''};${row.status}`
    ).join('\n');
    
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(csvPath, csvHeader + csvRows, 'utf-8');
    console.log(`\n📄 Combined report saved: ${csvPath}`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});