#!/usr/bin/env node
/**
 * Backfill hotéis do OpenStreetMap (Overpass API) para o hotel-index.
 *
 * Query OSM por tourism=hotel em países selecionados e exporta CSV.
 *
 * Uso:
 *   node scripts/backfill-hotels-from-osm.mjs
 *   node scripts/backfill-hotels-from-osm.mjs --countries pt,es,fr,it
 *   node scripts/backfill-hotels-from-osm.mjs --countries pt --limit 500
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync, appendFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'data/hotels');
const OUT_CSV = resolve(OUT_DIR, 'osm-hotels.csv');

// Mapeamento de países
// Mapeamento de países - usar nomes LOCAIS (OSM usa name local para geocodeArea)
// Mapeamento de países - usar nomes LOCAIS (OSM usa name local para geocodeArea).
// NOTA: Nominatim/geocodeArea funciona melhor com nomes em inglês.
const COUNTRIES = {
  pt: { name: 'Portugal', iso: 'PT' },
  es: { name: 'Spain', iso: 'ES' },
  fr: { name: 'France', iso: 'FR' },
  it: { name: 'Italy', iso: 'IT' },
  gb: { name: 'United Kingdom', iso: 'GB' },
  de: { name: 'Germany', iso: 'DE' },
  nl: { name: 'Netherlands', iso: 'NL' },
  be: { name: 'Belgium', iso: 'BE' },
  ch: { name: 'Switzerland', iso: 'CH' },
  at: { name: 'Austria', iso: 'AT' },
  ie: { name: 'Ireland', iso: 'IE' },
  gr: { name: 'Greece', iso: 'GR' },
  hr: { name: 'Croatia', iso: 'HR' },
  ma: { name: 'Morocco', iso: 'MA' },
  br: { name: 'Brazil', iso: 'BR' },
};

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const RATE_LIMIT_MS = 12000; // 12 segundos entre queries para evitar rate limiting (HTTP 429)

function parseArgs() {
  // Parse --countries=pt,es,fr,it or --countries pt,es,fr,it
  const countriesIdx = process.argv.findIndex(a => a === '--countries');
  let countries = ['pt', 'es', 'fr', 'it'];
  if (countriesIdx >= 0) {
    const next = process.argv[countriesIdx + 1];
    if (next && !next.startsWith('--')) {
      countries = next.split(',');
    }
  }
  // Also check --countries=pt,es format
  const countriesEq = process.argv.find(a => a.startsWith('--countries='));
  if (countriesEq) {
    countries = countriesEq.split('=')[1].split(',');
  }

  // Parse --limit=500 or --limit 500
  const limitIdx = process.argv.findIndex(a => a === '--limit');
  let limit = 0;
  if (limitIdx >= 0) {
    const next = process.argv[limitIdx + 1];
    if (next && !next.startsWith('--')) {
      limit = parseInt(next, 10);
    }
  }
  const limitEq = process.argv.find(a => a.startsWith('--limit='));
  if (limitEq) {
    limit = parseInt(limitEq.split('=')[1], 10);
  }

  return {
    countries,
    limit: isNaN(limit) ? 0 : limit,
    dryRun: process.argv.includes('--dry-run'),
  };
}

function buildQuery(countryName, limit) {
  const limitClause = limit > 0 ? ` ${limit}` : '';

  return `[out:json][timeout:180];
area["name"="${countryName}"]->.searchArea;
(
  node["tourism"="hotel"](area.searchArea);
  way["tourism"="hotel"](area.searchArea);
  rel["tourism"="hotel"](area.searchArea);
);
out center${limitClause};
`;
}

function osmToCsvRow(element, isoCode) {
  const tags = element.tags || {};
  const lat = element.lat || (element.center && element.center.lat) || '';
  const lon = element.lon || (element.center && element.center.lon) || '';
  const name = (tags.name || tags['name:en'] || tags['name:pt'] || tags['short_name'] || '').replace(/"/g, '""');
  const stars = tags.stars ? parseInt(tags.stars, 10) : 3;
  const website = (tags.website || '').replace(/"/g, '""');
  const phone = (tags.phone || '').replace(/"/g, '""');
  const addrStreet = (tags['addr:street'] || '').replace(/"/g, '""');
  const addrCity = (tags['addr:city'] || tags['addr:place'] || tags['addr:suburb'] || '').replace(/"/g, '""');
  const addrPostcode = (tags['addr:postcode'] || '').replace(/"/g, '""');
  const wikidata = tags.wikidata || '';

  if (!name) return null; // skip nameless

  return [
    `"${name}"`,
    stars,
    lat,
    lon,
    `"${addrStreet}"`,
    `"${addrCity}"`,
    `"${addrPostcode}"`,
    `"${website}"`,
    `"${phone}"`,
    `"${addrCity}"`, // city
    isoCode,           // country_code
    `"${wikidata}"`,
  ].join(',');
}

async function queryCountry(countryCode, limit) {
  const info = COUNTRIES[countryCode];
  if (!info) {
    console.log(`  Skipping unknown country: ${countryCode}`);
    return [];
  }

  const query = buildQuery(info.name, limit);
  console.log(`\nQuerying ${info.name} (${countryCode})...`);

  try {
    const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'beta-app/1.0 (hotel-backfill; academic-research) node-fetch',
      },
      signal: AbortSignal.timeout(200000), // 200s timeout
    });

    if (!response.ok) {
      console.log(`  HTTP ${response.status}: ${response.statusText}`);
      const text = await response.text();
      console.log(`  Response: ${text.slice(0, 300)}`);
      return [];
    }

    const data = await response.json();
    const elements = data.elements || [];
    console.log(`  Got ${elements.length} hotel elements`);

    if (elements.length === 0) {
      console.warn(`  ⚠️  WARNING: 0 elements returned for "${info.name}". The geocodeArea name may be wrong.`);
    }

    const rows = [];
    for (const el of elements) {
      const row = osmToCsvRow(el, info.iso);
      if (row) rows.push(row);
    }
    console.log(`  ${rows.length} valid hotels after filtering`);

    return rows;
  } catch (err) {
    console.log(`  Error: ${err.message}`);
    return [];
  }
}

async function main() {
  const args = parseArgs();
  console.log('=== OSM Hotels Backfill ===');
  console.log(`Countries: ${args.countries.join(', ')}`);
  if (args.dryRun) console.log('DRY RUN - no files will be written');
  if (args.limit > 0) console.log(`Limit per country: ${args.limit}`);

  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  // CSV header
  const CSV_HEADER = 'name,stars,latitude,longitude,address_street,address_city,address_postcode,website,phone,city,country_code,wikidata_id\n';

  const fileExists = existsSync(OUT_CSV) && readFileSync(OUT_CSV, 'utf-8').trim().length > 0;

  if (!args.dryRun && !fileExists) {
    writeFileSync(OUT_CSV, CSV_HEADER, 'utf-8');
  } else if (!args.dryRun && fileExists) {
    console.log(`Appending to existing ${OUT_CSV}`);
  }

  let total = 0;
  for (const cc of args.countries) {
    // Rate limit
    if (total > 0) {
      await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
    }

    const rows = await queryCountry(cc, args.limit);
    if (rows.length > 0 && !args.dryRun) {
      appendFileSync(OUT_CSV, rows.join('\n') + '\n', 'utf-8');
    }
    total += rows.length;
    console.log(`  Total so far: ${total}`);
  }

  console.log(`\nDone! ${total} hotels exported to ${OUT_CSV}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
