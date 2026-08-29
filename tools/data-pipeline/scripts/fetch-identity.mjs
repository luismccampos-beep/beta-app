#!/usr/bin/env node
/**
 * fetch-identity.mjs — Phase 1 identity import (countries + cities).
 *
 * Idempotent, configurable CLI that fetches country metadata from Wikidata SPARQL
 * and cities from GeoNames, then upserts into the database via Prisma.
 *
 * Usage:
 *   node scripts/fetch-identity.mjs                     # import everything
 *   node scripts/fetch-identity.mjs --countries          # countries only
 *   node scripts/fetch-identity.mjs --cities             # cities only
 *   node scripts/fetch-identity.mjs --min-pop 10000      # lower population threshold
 *   node scripts/fetch-identity.mjs --limit 500          # test with 500 cities
 *   node scripts/fetch-identity.mjs --force              # force re-download
 *   node scripts/fetch-identity.mjs --resume             # skip already-imported cities
 *   node scripts/fetch-identity.mjs --json               # structured JSON output
 */
import fetch from 'node-fetch';
import unzipper from 'unzipper';
import { parse } from 'csv-parse';
import { Command } from 'commander';
import pLimit from 'p-limit';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const program = new Command();
program
  .name('fetch-identity')
  .description('Import countries (Wikidata) + cities (GeoNames) into the DB')
  .option('--countries', 'Fetch countries from Wikidata only')
  .option('--cities', 'Fetch cities from GeoNames only')
  .option('--min-pop <number>', 'Minimum city population threshold', '15000')
  .option('--include-admin-capitals', 'Include admin capitals (PPLA*) even below min pop', true)
  .option('--force', 'Force re-download (ignore cache)')
  .option('--limit <number>', 'Limit number of cities (for testing)')
  .option('--resume', 'Skip cities that already have a geonamesId in the DB')
  .option('--json', 'Output structured JSON lines (for CI/CD)')
  .parse(process.argv);

const opts = program.opts();
const MIN_POP = parseInt(opts.minPop, 10);
const INCLUDE_ADMIN_CAPITALS = opts.includeAdminCapitals !== 'false';
const TEST_LIMIT = opts.limit ? parseInt(opts.limit, 10) : null;
const JSON_MODE = opts.json === true;

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(__dirname, '..', 'data', 'identity');
const WIKIDATA_CACHE_PATH = path.join(DATA_DIR, 'wikidata-countries.json');
const ADMIN1_CACHE_PATH = path.join(DATA_DIR, 'admin1-codes.json');
const ADMIN2_CACHE_PATH = path.join(DATA_DIR, 'admin2-codes.json');
const PROGRESS_PATH = path.join(DATA_DIR, 'import-progress.json');
const PRIORITY_CITIES_PATH = path.join(DATA_DIR, 'priority-cities.json');

// ---------------------------------------------------------------------------
// Wikidata SPARQL — enriched query (adds nameEn via language tag)
// ---------------------------------------------------------------------------
const WIKIDATA_SPARQL_URL = 'https://query.wikidata.org/sparql';

const COUNTRY_QUERY = `
SELECT
  ?country
  ?iso2
  ?iso3
  ?countryLabel
  ?countryLabelEn
  ?currencyCode
  ?plugTypeLabel
  ?continentLabel
  ?drivingSideLabel
  ?callingCode
  ?latitude
  ?longitude
  ?capitalLabel
  ?officialLanguageLabel
WHERE {
  ?country wdt:P31 wd:Q6256.
  ?country wdt:P297 ?iso2.

  OPTIONAL { ?country wdt:P298 ?iso3. }
  OPTIONAL {
    ?country wdt:P38 ?currency.
    ?currency wdt:P498 ?currencyCode.
  }
  OPTIONAL { ?country wdt:P2853 ?plugType. }
  OPTIONAL { ?country wdt:P30 ?continent. }
  OPTIONAL { ?country wdt:P1819 ?drivingSide. }
  OPTIONAL { ?country wdt:P473 ?callingCode. }
  OPTIONAL {
    ?country wdt:P625 ?coord.
    BIND(geof:latitude(?coord) AS ?latitude)
    BIND(geof:longitude(?coord) AS ?longitude)
  }
  OPTIONAL { ?country wdt:P36 ?capital. }
  OPTIONAL { ?country wdt:P37 ?officialLanguage. }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en".
    ?country rdfs:label ?countryLabel.
    ?country rdfs:label ?countryLabelEn.
    ?plugType rdfs:label ?plugTypeLabel.
    ?continent rdfs:label ?continentLabel.
    ?drivingSide rdfs:label ?drivingSideLabel.
    ?capital rdfs:label ?capitalLabel.
    ?officialLanguage rdfs:label ?officialLanguageLabel.
  }
}
ORDER BY ?countryLabel
`;

const GEONAMES_CITIES_URL = 'https://download.geonames.org/export/dump/cities15000.zip';
const GEONAMES_ADMIN1_URL = 'https://download.geonames.org/export/dump/admin1CodesASCII.txt';
const GEONAMES_ADMIN2_URL = 'https://download.geonames.org/export/dump/admin2Codes.txt';

// ---------------------------------------------------------------------------
// Validation constants
// ---------------------------------------------------------------------------
const LAT_MIN = -90;
const LAT_MAX = 90;
const LON_MIN = -180;
const LON_MAX = 180;
const MAX_POPULATION = 100_000_000;
const VALID_FEATURE_PREFIXES = new Set(['P', 'A', 'H', 'L', 'R', 'S', 'T', 'U', 'V']);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CONTINENT_CODE_MAP = {
  'Africa': 'AF',
  'Asia': 'AS',
  'Europe': 'EU',
  'North America': 'NA',
  'South America': 'SA',
  'Oceania': 'OC',
  'Antarctica': 'AN',
};

const DRIVING_SIDE_MAP = {
  'Q1868517': 'left',
  'Q2070508': 'right',
};

function normalizePlugType(label) {
  if (!label) return null;
  const match = label.match(/[A-NO]/g);
  if (!match) return null;
  return [...new Set(match)].sort().join(',');
}

function resolveDrivingSide(raw) {
  if (!raw) return null;
  if (DRIVING_SIDE_MAP[raw]) return DRIVING_SIDE_MAP[raw];
  const lower = raw.toLowerCase();
  if (lower === 'left' || lower === 'right') return lower;
  return null;
}

function validateCoordinate(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  if (lat < LAT_MIN || lat > LAT_MAX) return false;
  if (lon < LON_MIN || lon > LON_MAX) return false;
  return true;
}

function validatePopulation(pop) {
  if (pop === undefined || pop === null) return true;
  if (!Number.isFinite(pop)) return false;
  if (pop < 0) return false;
  if (pop > MAX_POPULATION) return false;
  return true;
}

function validateTimezone(tz) {
  if (!tz) return true;
  return /^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/.test(tz);
}

function makeSlug(name, countryCode, existingSlugs) {
  let base = (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  let slug = `${base}-${countryCode.toLowerCase()}`;

  if (existingSlugs.has(slug)) {
    let counter = 2;
    while (existingSlugs.has(`${slug}-${counter}`)) {
      counter++;
    }
    slug = `${slug}-${counter}`;
  }

  existingSlugs.add(slug);
  return slug;
}

function isPrimaryCity(featureCode, name, countryCode, prioritySet) {
  if (!featureCode) return false;
  const primaryCodes = new Set(['PPLC', 'PPLC2']);
  if (primaryCodes.has(featureCode)) return true;
  if (INCLUDE_ADMIN_CAPITALS && featureCode.startsWith('PPLA')) return true;
  const key = `${name?.toLowerCase()},${countryCode?.toLowerCase()}`;
  if (prioritySet.has(key)) return true;
  return false;
}

function shouldIncludeCity(population, featureCode) {
  if (isPrimaryCity(featureCode, null, null, new Set())) return true;
  if (typeof population === 'number' && population >= MIN_POP) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------
function log(emoji, msg) {
  if (JSON_MODE) {
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', emoji, msg }));
  } else {
    console.log(`${emoji} ${msg}`);
  }
}

function logError(emoji, msg) {
  if (JSON_MODE) {
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'error', emoji, msg }));
  } else {
    console.error(`${emoji} ${msg}`);
  }
}

// ---------------------------------------------------------------------------
// Lazy Prisma — only import and instantiate when DB access is needed
// ---------------------------------------------------------------------------
let _prisma = null;

async function getPrisma() {
  if (!_prisma) {
    const { PrismaClient } = await import('@prisma/client');
    _prisma = new PrismaClient();
  }
  return _prisma;
}

async function disconnectPrisma() {
  if (_prisma) {
    await _prisma.$disconnect();
    _prisma = null;
  }
}

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------
async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function downloadFile(url, destPath, label) {
  if (!opts.force) {
    try {
      const content = await fs.readFile(destPath, 'utf-8');
      return content;
    } catch {
      // Cache miss, download
    }
  }

  log('⬇️', `Downloading ${label}...`);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AKMLEVA-TravelIntel/1.0' },
    timeout: 30_000,
  });
  if (!res.ok) throw new Error(`Failed to download ${label}: ${res.status}`);

  const content = await res.text();

  // Validate content isn't an HTML error page
  if (content.trimStart().startsWith('<!') || content.length < 10) {
    // Delete partial/corrupt file if it was written
    try { await fs.unlink(destPath); } catch { /* ignore */ }
    throw new Error(`Downloaded ${label} appears corrupt (HTML or too short)`);
  }

  await fs.writeFile(destPath, content, 'utf-8');
  return content;
}

async function downloadBinaryFile(url, destPath, label) {
  if (!opts.force) {
    try {
      await fs.access(destPath);
      log('📦', `Using cached ${label}`);
      return;
    } catch {
      // Cache miss, download
    }
  }

  log('⬇️', `Downloading ${label}...`);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AKMLEVA-TravelIntel/1.0' },
    timeout: 60_000,
  });
  if (!res.ok) throw new Error(`Failed to download ${label}: ${res.status}`);

  // Stream to a temp file, then rename (atomic write)
  const tmpPath = `${destPath}.tmp`;
  try {
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(tmpPath, buffer);

    // Basic size sanity check (cities15000.txt should be >1MB)
    if (buffer.length < 10_000) {
      try { await fs.unlink(tmpPath); } catch { /* ignore */ }
      throw new Error(`Downloaded ${label} too small (${buffer.length} bytes), likely corrupt`);
    }

    await fs.rename(tmpPath, destPath);
  } catch (err) {
    // Clean up partial file on any error
    try { await fs.unlink(tmpPath); } catch { /* ignore */ }
    throw err;
  }
}

async function loadPriorityCities() {
  try {
    const raw = await fs.readFile(PRIORITY_CITIES_PATH, 'utf-8');
    const arr = JSON.parse(raw);
    const set = new Set(arr.map((s) => s.toLowerCase().trim()));
    log('🏙️', `Loaded ${set.size} priority cities from ${path.basename(PRIORITY_CITIES_PATH)}`);
    return set;
  } catch (err) {
    logError('⚠️', `Failed to load priority cities (${err.message}), using empty set`);
    return new Set();
  }
}

async function loadAdminCodes() {
  log('📂', 'Loading admin codes...');

  const admin1Map = new Map();
  try {
    const raw1 = await downloadFile(GEONAMES_ADMIN1_URL, ADMIN1_CACHE_PATH, 'admin1CodesASCII.txt');
    for (const line of raw1.split('\n')) {
      const parts = line.split('\t');
      if (parts.length < 3) continue;
      const code = parts[0]?.trim();
      const name = parts[1]?.trim();
      if (code && name) admin1Map.set(code, name);
    }
  } catch (err) {
    logError('⚠️', `Failed to load admin1 codes: ${err.message}`);
  }

  const admin2Map = new Map();
  try {
    const raw2 = await downloadFile(GEONAMES_ADMIN2_URL, ADMIN2_CACHE_PATH, 'admin2Codes.txt');
    for (const line of raw2.split('\n')) {
      const parts = line.split('\t');
      if (parts.length < 3) continue;
      const code = parts[0]?.trim();
      const name = parts[1]?.trim();
      if (code && name) admin2Map.set(code, name);
    }
  } catch (err) {
    logError('⚠️', `Failed to load admin2 codes: ${err.message}`);
  }

  log('📋', `Loaded ${admin1Map.size} admin1 codes, ${admin2Map.size} admin2 codes`);
  return { admin1Map, admin2Map };
}

// ---------------------------------------------------------------------------
// Progress tracking (for --resume)
// ---------------------------------------------------------------------------
async function loadProgress() {
  if (!opts.resume) return new Set();
  try {
    const raw = await fs.readFile(PROGRESS_PATH, 'utf-8');
    const arr = JSON.parse(raw);
    log('📂', `Loaded progress file (${arr.length} completed geonamesIds)`);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

async function saveProgress(completedIds) {
  const arr = [...completedIds];
  await fs.writeFile(PROGRESS_PATH, JSON.stringify(arr), 'utf-8');
}

// ---------------------------------------------------------------------------
// Countries
// ---------------------------------------------------------------------------
async function fetchCountries() {
  const prisma = await getPrisma();
  log('🌍', 'Fetching countries from Wikidata...');

  await ensureDataDir();

  if (!opts.force) {
    try {
      const cached = await fs.readFile(WIKIDATA_CACHE_PATH, 'utf-8');
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        log('📦', `Using cached Wikidata countries (${parsed.length}) — use --force to refresh`);
        await upsertCountries(parsed, prisma);
        return;
      }
    } catch {
      // Cache miss, continue to fetch
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  try {
    const url = `${WIKIDATA_SPARQL_URL}?query=${encodeURIComponent(COUNTRY_QUERY)}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/sparql-results+json',
        'User-Agent': 'AKMLEVA-TravelIntel/1.0',
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Wikidata SPARQL failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    clearTimeout(timeout);

    const countryMap = new Map();

    for (const row of data.results.bindings) {
      const iso2 = row.iso2?.value;
      if (!iso2 || iso2.length !== 2) continue;

      if (!countryMap.has(iso2)) {
        const wikidataUrl = row.country?.value || '';
        const wikidataId = wikidataUrl.split('/').pop() || null;
        const continent = row.continentLabel?.value || null;

        countryMap.set(iso2, {
          iso2,
          iso3: row.iso3?.value || null,
          name: row.countryLabel?.value || iso2,
          nameEn: row.countryLabelEn?.value || row.countryLabel?.value || iso2,
          wikidataId,
          currencyCode: row.currencyCode?.value || null,
          continent,
          continentCode: continent ? CONTINENT_CODE_MAP[continent] || null : null,
          latitude: row.latitude ? parseFloat(row.latitude.value) : null,
          longitude: row.longitude ? parseFloat(row.longitude.value) : null,
          drivingSide: resolveDrivingSide(row.drivingSideLabel?.value),
          callingCode: row.callingCode?.value || null,
          capitalCity: row.capitalLabel?.value || null,
          officialLanguage: row.officialLanguageLabel?.value || null,
          plugTypes: new Set(),
        });
      }

      const c = countryMap.get(iso2);

      if (row.plugTypeLabel?.value) {
        const norm = normalizePlugType(row.plugTypeLabel.value);
        if (norm) {
          norm.split(',').forEach((p) => {
            if (p) c.plugTypes.add(p.trim());
          });
        }
      }
    }

    const countries = Array.from(countryMap.values()).map((c) => ({
      ...c,
      plugType: c.plugTypes.size > 0 ? [...c.plugTypes].sort().join(',') : null,
      plugTypes: undefined,
    }));

    countries.sort((a, b) => a.name.localeCompare(b.name));

    await fs.writeFile(WIKIDATA_CACHE_PATH, JSON.stringify(countries, null, 2), 'utf-8');
    log('💾', `Cached ${countries.length} countries to ${WIKIDATA_CACHE_PATH}`);

    await upsertCountries(countries, prisma);
  } catch (err) {
    clearTimeout(timeout);
    logError('❌', `Failed to fetch countries from Wikidata: ${err.message}`);
    throw err;
  }
}

async function upsertCountries(countries, prisma) {
  log('💾', `Upserting ${countries.length} countries...`);

  const limit = pLimit(10);
  let successCount = 0;
  let errorCount = 0;

  await Promise.all(
    countries.map((c) =>
      limit(async () => {
        try {
          await prisma.country.upsert({
            where: { iso2: c.iso2 },
            update: {
              iso3: c.iso3,
              name: c.name,
              nameEn: c.nameEn,
              wikidataId: c.wikidataId,
              currency: c.currencyCode,
              plugTypes: c.plugType ? [c.plugType] : undefined,
              continent: c.continent,
              continentCode: c.continentCode,
              latitude: c.latitude,
              longitude: c.longitude,
              drivingSide: c.drivingSide,
              callingCode: c.callingCode ? `+${c.callingCode}` : undefined,
              capitalCity: c.capitalCity,
            },
            create: {
              iso2: c.iso2,
              iso3: c.iso3,
              name: c.name,
              nameEn: c.nameEn,
              wikidataId: c.wikidataId,
              currency: c.currencyCode,
              plugTypes: c.plugType ? [c.plugType] : undefined,
              continent: c.continent,
              continentCode: c.continentCode,
              latitude: c.latitude,
              longitude: c.longitude,
              drivingSide: c.drivingSide,
              callingCode: c.callingCode ? `+${c.callingCode}` : undefined,
              capitalCity: c.capitalCity,
              isSovereign: true,
            },
          });
          successCount++;
        } catch (err) {
          logError('⚠️', `Failed to upsert country ${c.iso2} (${c.name}): ${err.message}`);
          errorCount++;
        }
      })
    )
  );

  log('✅', `Countries upserted: ${successCount} succeeded, ${errorCount} failed`);
}

// ---------------------------------------------------------------------------
// Cities
// ---------------------------------------------------------------------------
async function fetchCities() {
  const prisma = await getPrisma();
  log('🏙️', `Fetching cities (min pop: ${MIN_POP}, include admin capitals: ${INCLUDE_ADMIN_CAPITALS})...`);

  const prioritySet = await loadPriorityCities();

  const dbCountries = await prisma.country.findMany({
    select: { id: true, iso2: true },
  });

  const countryMap = new Map();
  for (const c of dbCountries) {
    countryMap.set(c.iso2, c.id);
  }

  if (countryMap.size === 0) {
    throw new Error('No countries found in DB. Run with --countries first.');
  }

  log('🔗', `Linked to ${countryMap.size} countries`);

  const { admin1Map, admin2Map } = await loadAdminCodes();

  const completedIds = await loadProgress();
  const existingSlugs = new Set();
  if (!opts.resume) {
    const existingCities = await prisma.city.findMany({ select: { slug: true } });
    for (const c of existingCities) existingSlugs.add(c.slug);
  }

  // Download zip to a temp path first, then extract
  const zipPath = path.join(DATA_DIR, 'cities15000.zip');
  await downloadBinaryFile(GEONAMES_CITIES_URL, zipPath, 'cities15000.zip');

  let processed = 0;
  let included = 0;
  let skippedNoCountry = 0;
  let skippedFiltered = 0;
  let skippedInvalid = 0;
  let skippedResumed = 0;
  let upsertErrors = 0;
  let validationErrors = 0;

  const upsertTasks = [];
  const limit = pLimit(20);

  const zipStream = (await fs.readFile(zipPath)).buffer;

  await new Promise((resolve, reject) => {
    const { Readable } = require('stream');
    const readable = Readable.from(zipStream);

    readable
      .pipe(unzipper.ParseOne('cities15000.txt'))
      .pipe(
        parse({
          delimiter: '\t',
          relax_quotes: true,
          skip_empty_lines: true,
          bom: true,
        })
      )
      .on('data', (row) => {
        processed++;

        try {
          const geoNamesId = parseInt(row[0], 10);
          const name = row[1]?.trim();
          const asciiName = row[2]?.trim() || null;
          const lat = parseFloat(row[4]);
          const lon = parseFloat(row[5]);
          const featureClass = row[6]?.trim() || null;
          const featureCode = row[7]?.trim() || null;
          const countryCode = row[8]?.trim().toUpperCase();
          const admin1Code = row[10]?.trim() || null;
          const admin2Code = row[11]?.trim() || null;
          const populationRaw = row[14]?.trim();
          const population = populationRaw ? parseInt(populationRaw, 10) : 0;
          const timezone = row[17]?.trim() || null;

          if (!geoNamesId || !name || !countryCode) {
            skippedInvalid++;
            return;
          }

          if (!validateCoordinate(lat, lon)) {
            validationErrors++;
            return;
          }

          if (!validatePopulation(population)) {
            validationErrors++;
            return;
          }

          if (!validateTimezone(timezone)) {
            validationErrors++;
            return;
          }

          if (featureClass && !VALID_FEATURE_PREFIXES.has(featureClass)) {
            validationErrors++;
            return;
          }

          const countryId = countryMap.get(countryCode);
          if (!countryId) {
            skippedNoCountry++;
            return;
          }

          if (!shouldIncludeCity(population, featureCode)) {
            skippedFiltered++;
            return;
          }

          if (opts.resume && completedIds.has(geoNamesId)) {
            skippedResumed++;
            return;
          }

          if (TEST_LIMIT && included >= TEST_LIMIT) return;

          included++;

          const admin1Name = admin1Code ? admin1Map.get(`${countryCode}.${admin1Code}`) || null : null;
          const admin2Name = admin2Code ? admin2Map.get(`${countryCode}.${admin1Code}.${admin2Code}`) || null : null;

          const task = limit(async () => {
            try {
              const slug = makeSlug(asciiName || name, countryCode, existingSlugs);
              await prisma.city.upsert({
                where: { geonamesId },
                update: {
                  name,
                  asciiName,
                  latitude: lat,
                  longitude: lon,
                  population: population || null,
                  timezone,
                  countryCode,
                  admin1Code,
                  admin1Name,
                  admin2Code,
                  admin2Name,
                  featureClass,
                  featureCode,
                  isPrimary: isPrimaryCity(featureCode, name, countryCode, prioritySet),
                },
                create: {
                  geonamesId,
                  slug,
                  name,
                  asciiName,
                  latitude: lat,
                  longitude: lon,
                  population: population || null,
                  timezone,
                  countryCode,
                  admin1Code,
                  admin1Name,
                  admin2Code,
                  admin2Name,
                  featureClass,
                  featureCode,
                  isPrimary: isPrimaryCity(featureCode, name, countryCode, prioritySet),
                  countryId,
                },
              });
              completedIds.add(geoNamesId);
            } catch (err) {
              upsertErrors++;
              if (upsertErrors <= 5) {
                logError('❌', `Failed to upsert city geonameId=${geoNamesId} (${name}): ${err.message}`);
              }
            }
          });

          upsertTasks.push(task);
        } catch {
          skippedInvalid++;
        }
      })
      .on('end', async () => {
        log('💾', `Writing ${upsertTasks.length} city records to database...`);
        const writeStart = Date.now();

        try {
          await Promise.all(upsertTasks);
          const writeMs = Date.now() - writeStart;

          if (opts.resume) {
            await saveProgress(completedIds);
          }

          const summary = {
            processed,
            included,
            skippedFiltered,
            skippedNoCountry,
            skippedInvalid,
            skippedResumed,
            upsertErrors,
            validationErrors,
            dbWriteTimeMs: writeMs,
          };

          if (JSON_MODE) {
            console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', emoji: '📊', msg: 'City import summary', ...summary }));
          } else {
            log('📊', 'City import summary:');
            console.log(`  • Processed:          ${processed.toLocaleString()}`);
            console.log(`  • Included:           ${included.toLocaleString()}`);
            console.log(`  • Skipped (filtered): ${skippedFiltered.toLocaleString()}`);
            console.log(`  • Skipped (no country): ${skippedNoCountry.toLocaleString()}`);
            console.log(`  • Skipped (invalid):  ${skippedInvalid.toLocaleString()}`);
            console.log(`  • Skipped (resumed):  ${skippedResumed.toLocaleString()}`);
            console.log(`  • Validation errors:  ${validationErrors.toLocaleString()}`);
            console.log(`  • Upsert errors:      ${upsertErrors.toLocaleString()}`);
            console.log(`  • DB write time:      ${writeMs}ms`);
          }
          log('✅', 'Cities import complete');
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const start = Date.now();

  try {
    await ensureDataDir();

    const runCountries = !opts.cities || opts.countries;
    const runCities = !opts.countries || opts.cities;

    if (runCountries) {
      await fetchCountries();
    }

    if (runCities) {
      await fetchCities();
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    log('🚀', `Phase 1 identity import finished in ${elapsed}s`);
  } catch (err) {
    logError('❌', `Fatal error: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await disconnectPrisma();
  }
}

main();
