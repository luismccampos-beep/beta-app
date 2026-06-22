#!/usr/bin/env node
/**
 * Geocode French classified hotels (Atout France dataset) by commune name.
 *
 * O dataset francês tem ~21k alojamentos com nome, classificação e commune,
 * mas sem coordenadas GPS. Este script usa a API Nominatim (OpenStreetMap)
 * para geocodificar cada commune única e gerar um lookup JSON.
 *
 * Uso:
 *   node scripts/geocode-french-hotels.mjs              (processa todas as communes)
 *   node scripts/geocode-french-hotels.mjs --limit 10    (teste com 10 communes)
 *   node scripts/geocode-french-hotels.mjs --resume      (continua de onde parou)
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout } from 'node:timers/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const HOTELS_DIR = resolve(ROOT, 'data/hotels');
const FR_CSV = resolve(HOTELS_DIR, 'france-hebergements-classes.csv');
const CACHE_JSON = resolve(HOTELS_DIR, 'france-communes-geocoded.json');
const LOOKUP_JSON = resolve(HOTELS_DIR, 'france-commune-coords.json');

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const RATE_LIMIT_MS = 1100; // 1 por segundo (Nominatim ToS: max 1 req/s)
const MAX_RETRIES = 3;

function parseArgs() {
  const args = {
    limit: 0,
    resume: process.argv.includes('--resume'),
  };

  const limitIdx = process.argv.findIndex(a => a === '--limit');
  if (limitIdx >= 0) {
    const next = process.argv[limitIdx + 1];
    if (next && !next.startsWith('--')) {
      args.limit = parseInt(next, 10);
    }
  }
  const limitEq = process.argv.find(a => a.startsWith('--limit='));
  if (limitEq) {
    args.limit = parseInt(limitEq.split('=')[1], 10);
  }

  return args;
}

function parseCsvLine(line) {
  // Simple CSV parser for semicolon-delimited French CSV
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ';' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

async function geocodeCommune(commune, retry = 0) {
  // Skip if already cached
  const cacheKey = commune.toLowerCase().normalize('NFD').replace(/[^a-z0-9 ]/g, '');
  if (cacheKey.length < 2) return null;

  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(commune)}+France&format=json&limit=1&addressdetails=0`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'beta-app/1.0 (hotel-geocoding; academic-research)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      if (response.status === 429 && retry < MAX_RETRIES) {
        console.log(`  429 rate limited, waiting 30s before retry ${retry + 1}...`);
        await setTimeout(30000);
        return geocodeCommune(commune, retry + 1);
      }
      console.log(`  HTTP ${response.status} for "${commune}"`);
      return null;
    }

    const data = await response.json();
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
      };
    }

    // Try with "commune" suffix
    if (!commune.toLowerCase().includes('commune')) {
      const url2 = `${NOMINATIM_URL}?q=${encodeURIComponent(commune)}+commune+France&format=json&limit=1&addressdetails=0`;
      const response2 = await fetch(url2, {
        headers: { 'User-Agent': 'beta-app/1.0 (hotel-geocoding; academic-research)' },
        signal: AbortSignal.timeout(10000),
      });
      if (response2.ok) {
        const data2 = await response2.json();
        if (data2 && data2.length > 0) {
          return {
            lat: parseFloat(data2[0].lat),
            lon: parseFloat(data2[0].lon),
            displayName: data2[0].display_name,
          };
        }
      }
    }

    return null;
  } catch (err) {
    if (retry < MAX_RETRIES) {
      console.log(`  Error for "${commune}", retrying in 10s... (${err.message})`);
      await setTimeout(10000);
      return geocodeCommune(commune, retry + 1);
    }
    console.log(`  Failed for "${commune}": ${err.message}`);
    return null;
  }
}

async function main() {
  const args = parseArgs();
  console.log('=== French Hotels Geocoding ===');
  if (args.limit > 0) console.log(`Limit: ${args.limit} communes`);

  if (!existsSync(FR_CSV)) {
    console.error(`ERROR: French CSV not found at ${FR_CSV}`);
    console.error('Download it first with:');
    console.error('  curl -L -o data/hotels/france-hebergements-classes.csv "https://data.classement.atout-france.fr/static/exportHebergementsClasses/hebergements_classes.csv"');
    process.exit(1);
  }

  // Read French CSV and extract unique communes
  // Node.js não suporta 'utf-8-sig', remover BOM manualmente
  const raw = readFileSync(FR_CSV, 'utf-8');
  const content = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
  const lines = content.split('\n').filter(l => l.trim());
  const header = lines[0];
  const dataLines = lines.slice(1);

  // Find COMMMUNE column index from header
  const cols = parseCsvLine(header);
  const communeIdx = cols.findIndex(c => c.trim() === 'COMMUNE');
  if (communeIdx < 0) {
    console.error('ERROR: Could not find COMMUNE column in CSV header');
    console.error('Columns found:', cols);
    process.exit(1);
  }

  console.log(`French CSV: ${dataLines.length} lines, COMMUNE column at index ${communeIdx}`);

  // Extract unique communes
  const communeSet = new Set();
  for (const line of dataLines) {
    const fields = parseCsvLine(line);
    const commune = (fields[communeIdx] || '').trim().toUpperCase();
    if (commune && commune.length >= 2) {
      communeSet.add(commune);
    }
  }

  const communes = [...communeSet].sort();
  console.log(`Unique communes to geocode: ${communes.length}`);

  if (communes.length === 0) {
    console.log('No communes found. Exiting.');
    return;
  }

  // Load existing cache if resuming
  let results = {};
  if (args.resume && existsSync(CACHE_JSON)) {
    try {
      results = JSON.parse(readFileSync(CACHE_JSON, 'utf-8'));
      console.log(`Loaded ${Object.keys(results).length} cached results`);
    } catch {
      console.log('Could not load cache, starting fresh');
    }
  }

  // Geocode each commune
  const toProcess = args.limit > 0 ? communes.slice(0, args.limit) : communes;
  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const commune = toProcess[i];

    // Skip if already cached
    if (results[commune]) {
      skipped++;
      continue;
    }

    if (i % 50 === 0) {
      console.log(`Progress: ${i}/${toProcess.length} (success: ${success}, failed: ${failed}, skipped: ${skipped})`);
    }

    const coords = await geocodeCommune(commune);

    if (coords) {
      results[commune] = coords;
      success++;
    } else {
      results[commune] = null;
      failed++;
    }

    // Save cache every 50 results
    if ((i + 1) % 50 === 0) {
      writeFileSync(CACHE_JSON, JSON.stringify(results, null, 2), 'utf-8');
      console.log(`  Cached ${Object.keys(results).length} results`);
    }

    // Rate limit
    if (i < toProcess.length - 1) {
      await setTimeout(RATE_LIMIT_MS);
    }
  }

  // Save final results
  writeFileSync(CACHE_JSON, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\nResults saved to ${CACHE_JSON}`);

  // Create a compact lookup (just lat, lon)
  const lookup = {};
  for (const [commune, coords] of Object.entries(results)) {
    if (coords) {
      lookup[commune] = { lat: coords.lat, lon: coords.lon };
    }
  }
  writeFileSync(LOOKUP_JSON, JSON.stringify(lookup, null, 2), 'utf-8');

  console.log(`\nFinal Stats:`);
  console.log(`  Total communes: ${toProcess.length}`);
  console.log(`  Successfully geocoded: ${success}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Skipped (cached): ${skipped}`);
  console.log(`  Coverage: ${((Object.keys(lookup).length / communes.length) * 100).toFixed(1)}%`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
