/**
 * download-geonames-hotels.mjs
 *
 * Descarrega os dumps do GeoNames (https://download.geonames.org/export/dump/),
 * extrai registos com feature code HTL (hotéis), conta por país,
 * e gera o ficheiro CSV de referência usado pelo validate-hotels-ge-distribution.
 *
 * Formato do dump GeoNames (tab-delimited, UTF-8):
 *   geonameid | name | asciiname | alternatenames | lat | lon | class | code | country | ...
 *   Feature code HTL está na coluna 8 (index 7, 0-based), classe 'S'.
 *
 * Fonte dos nomes de países: scripts/lib/country-names.mjs (ISO 3166-1 alpha-2)
 *
 * Uso:
 *   npm run travel:catalog:download-ge-hotels          # Download completo
 *   npm run travel:catalog:download-ge-hotels -- --dry-run --limit 5
 *   npm run travel:catalog:download-ge-hotels -- --max-countries 25
 *   npm run travel:catalog:download-ge-hotels -- --verbose
 *
 * Opções:
 *   --dry-run             Mostra o que vai fazer sem descarregar
 *   --limit N             Limita a N linhas processadas por país (debug)
 *   --max-countries N     Descarrega só os N maiores países
 *   --output PATH         Path do CSV de saída (default: data/hotels/ge-hotels-counts.csv)
 *   --verbose             Mostra progresso detalhado
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';
import { COUNTRY_NAMES } from './lib/country-names.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = 'https://download.geonames.org/export/dump/';

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

const DRY_RUN = args.includes('--dry-run');
const LIMIT = parseInt(argValue('--limit', '0'), 10) || 0;
const MAX_COUNTRIES = parseInt(argValue('--max-countries', '0'), 10) || 0;
const OUTPUT = argValue('--output', join(ROOT, 'data', 'hotels', 'ge-hotels-counts.csv'));
const VERBOSE = args.includes('--verbose');

// ─── GeoNames country codes to skip (non-standard) ──────────────────────────

const SKIP_CODES = new Set(['AN', 'CS', 'YU', '']);

// ─── Fetch + parse country ZIP ──────────────────────────────────────────────

/**
 * Download a single country ZIP, unzip, and count HTL (hotel) lines.
 * Returns { code, count, error? }
 *
 * Format: tab-delimited, columns:
 *   0: geonameid
 *   1: name
 *   2: asciiname
 *   3: alternatenames
 *   4: latitude
 *   5: longitude
 *   6: feature class
 *   7: feature code    ← HTL = hotel
 *   8: country code
 */
async function countHotelsInCountry(code, countryName) {
  const url = `${BASE_URL}${code}.zip`;
  const label = `${code} ${countryName || ''}`.trim();

  if (VERBOSE) console.log(`  [${label}] Downloading ${url}...`);

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(120_000) });

    if (!resp.ok) {
      if (resp.status === 404) {
        if (VERBOSE) console.log(`  [${label}] 404 — no data file`);  
        return { code, count: 0, error: '404' };
      }
      throw new Error(`HTTP ${resp.status}`);
    }

    // Read as ArrayBuffer and extract from ZIP via adm-zip
    const buffer = Buffer.from(await resp.arrayBuffer());
    const zip = new AdmZip(buffer);
    const entry = zip.getEntry(`${code}.txt`);
    if (!entry) {
      if (VERBOSE) console.log(`  [${label}] entry ${code}.txt not found in ZIP`);
      return { code, count: 0, error: 'no_entry' };
    }
    const text = zip.readAsText(entry);

    // Count HTL lines (tab-delimited, column 8 is feature code at index 7)
    let count = 0;
    let totalLines = 0;

    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      totalLines++;

      // Quick check: if line doesn't contain "HTL" skip it entirely
      // This is a performance optimization
      if (!trimmed.includes('HTL')) continue;

      const cols = trimmed.split('\t');
      if (cols.length >= 9 && cols[6]?.trim() === 'S' && cols[7]?.trim() === 'HTL') {
        count++;
      }

      if (LIMIT > 0 && totalLines >= LIMIT) break;
    }

    if (VERBOSE) console.log(`  [${label}] ${count} hotels (${totalLines.toLocaleString()} total lines)`);
    return { code, count };

  } catch (err) {
    if (VERBOSE) console.error(`  [${label}] ERROR: ${err.message}`);
    return { code, count: 0, error: err.message };
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  🏨 GeoNames Hotel Counter — Download & Extract');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  console.log(`  Source  : ${BASE_URL}`);
  console.log(`  Output  : ${OUTPUT}`);
  console.log(`  Mode    : ${DRY_RUN ? 'DRY RUN (no downloads)' : 'LIVE'}`);
  console.log(`  Limit   : ${LIMIT > 0 ? `${LIMIT} lines/country` : 'no limit'}`);
  if (MAX_COUNTRIES > 0) console.log(`  Max ctry: ${MAX_COUNTRIES}`);
  console.log();

  // Build country list sorted by expected size / importance
  const countryCodes = Object.keys(COUNTRY_NAMES)
    .filter(c => !SKIP_CODES.has(c) && c.length === 2)
    .sort();

  let targetCodes = countryCodes;
  if (MAX_COUNTRIES > 0) {
    targetCodes = countryCodes.slice(0, MAX_COUNTRIES);
  }
  
  console.log(`  Countries: ${targetCodes.length} (of ${countryCodes.length} total known)`);
  console.log();

  if (DRY_RUN) {
    console.log('  (dry-run — nothing downloaded)\n');
    console.log('  Countries que seriam processados:');
    for (const cc of targetCodes.slice(0, 20)) {
      console.log(`    ${cc}  ${COUNTRY_NAMES[cc]}`);
    }
    if (targetCodes.length > 20) {
      console.log(`    ... e mais ${targetCodes.length - 20} países`);
    }
    console.log();
    console.log('  Usa --no-dry-run para executar o download.\n');
    return;
  }

  // Download and count
  const results = [];
  let errors = 0;
  let totalHotels = 0;

  for (let i = 0; i < targetCodes.length; i++) {
    const cc = targetCodes[i];
    const name = COUNTRY_NAMES[cc] || cc;
    process.stdout.write(`  [${String(i + 1).padStart(3)}/${targetCodes.length}] ${cc} ${name.padEnd(30)} ... `);
    
    const result = await countHotelsInCountry(cc, name);
    
    if (result.error) {
      console.log(`❌ ${result.error === '404' ? 'no file' : result.error}`);
      errors++;
    } else {
      console.log(`${result.count.toLocaleString().padStart(7)} hotéis`);
      results.push(result);
      totalHotels += result.count;
    }

    // Small delay between downloads to be nice to the server
    if (i < targetCodes.length - 1) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Sort by count descending
  results.sort((a, b) => b.count - a.count);

  // Write CSV
  const outputDir = dirname(OUTPUT);
  mkdirSync(outputDir, { recursive: true });

  const header = 'country_code;country_name;ge_hotel_count\n';
  const rows = results
    .filter(r => r.count > 0)
    .map(r => `${r.code};${COUNTRY_NAMES[r.code] || r.code};${r.count}`)
    .join('\n');

  writeFileSync(OUTPUT, header + rows + '\n', 'utf-8');

  // Summary
  console.log();
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  ✅ Download completo!');
  console.log('═══════════════════════════════════════════════════════════════════\n');
  console.log(`  Países processados : ${results.length}`);
  console.log(`  Países com hotéis  : ${results.filter(r => r.count > 0).length}`);
  console.log(`  Erros              : ${errors}`);
  console.log(`  Total hotéis       : ${totalHotels.toLocaleString()}`);
  console.log(`  CSV guardado em    : ${OUTPUT}`);
  console.log();

  // Top 20 preview
  console.log('  Top 20 países por número de hotéis:');
  console.log('  ─────────────────────────────────────────────────────');
  for (const r of results.slice(0, 20)) {
    const name = (COUNTRY_NAMES[r.code] || r.code).padEnd(25);
    const count = r.count.toLocaleString().padStart(8);
    console.log(`   ${r.code}  ${name} ${count}`);
  }
  if (results.length > 20) {
    console.log(`   ... e mais ${results.length - 20} países`);
  }
  console.log();
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exitCode = 1;
});
