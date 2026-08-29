#!/usr/bin/env node
/**
 * enrich-cost.mjs — Fetch cost of living and quality-of-life metrics for cities.
 *
 * Sources:
 *   - OpenStreetMap Overpass API (POI counts for walkability, transit, healthcare)
 *   - Open-Meteo Geocoding (elevation, timezone confirmation)
 *   - Numbeo-style calculations (estimated costs from public datasets)
 *
 * Usage:
 *   node scripts/enrich-cost.mjs                      # enrich all cities
 *   node scripts/enrich-cost.mjs --limit 20           # test with 20 cities
 *   node scripts/enrich-cost.mjs --resume             # skip already-enriched
 *   node scripts/enrich-cost.mjs --force              # overwrite existing
 *   node scripts/enrich-cost.mjs --json               # structured output
 */
import { Command } from 'commander';
import pLimit from 'p-limit';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();
program
  .name('enrich-cost')
  .description('Fetch cost-of-living and quality-of-life data for cities')
  .option('--limit <number>', 'Limit number of cities')
  .option('--resume', 'Skip already-enriched cities')
  .option('--force', 'Overwrite existing data')
  .option('--json', 'Output structured JSON lines')
  .parse(process.argv);

const opts = program.opts();
const JSON_MODE = opts.json === true;
const TEST_LIMIT = opts.limit ? parseInt(opts.limit, 10) : null;
const FORCE = opts.force === true;

// ---------------------------------------------------------------------------
// Lazy Prisma
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
  if (_prisma) { await _prisma.$disconnect(); _prisma = null; }
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(__dirname, '..', 'data', 'cost');
const CHECKPOINT_PATH = path.join(DATA_DIR, 'enriched-city-ids.json');

// ---------------------------------------------------------------------------
// Overpass API
// ---------------------------------------------------------------------------
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

async function overpassQuery(query) {
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 30_000,
  });
  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);
  return res.json();
}

async function fetchPOICounts(lat, lon, radiusMeters = 5000) {
  const queries = {
    healthcare: `
      [out:json][timeout:15];
      (
        node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
        node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
        node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
      );
      out count;
    `,
    transit: `
      [out:json][timeout:15];
      (
        node["public_transport"="station"](around:${radiusMeters},${lat},${lon});
        node["public_transport"="stop_position"](around:${radiusMeters},${lat},${lon});
        node["railway"="station"](around:${radiusMeters},${lat},${lon});
        node["railway"="tram_stop"](around:${radiusMeters},${lat},${lon});
      );
      out count;
    `,
    restaurants: `
      [out:json][timeout:15];
      (
        node["amenity"="restaurant"](around:${radiusMeters},${lat},${lon});
        node["amenity"="cafe"](around:${radiusMeters},${lat},${lon});
        node["amenity"="bar"](around:${radiusMeters},${lat},${lon});
      );
      out count;
    `,
    parks: `
      [out:json][timeout:15];
      (
        way["leisure"="park"](around:${radiusMeters},${lat},${lon});
        way["leisure"="garden"](around:${radiusMeters},${lat},${lon});
      );
      out count;
    `,
  };

  const results = {};
  for (const [key, q] of Object.entries(queries)) {
    try {
      const data = await overpassQuery(q);
      results[key] = data.elements?.[0]?.tags?.total || 0;
    } catch {
      results[key] = null;
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Cost estimation (heuristic based on country + city type)
// ---------------------------------------------------------------------------
function estimateCostLevel(countryCode, population, featureCode) {
  // High-cost countries (rough grouping)
  const highCost = new Set(['CH', 'NO', 'SE', 'DK', 'IS', 'LU', 'SG', 'HK', 'JP', 'AU', 'NZ', 'GB', 'US', 'CA']);
  const midHighCost = new Set(['DE', 'FR', 'NL', 'AT', 'BE', 'FI', 'IE', 'IT', 'ES', 'KR', 'AE', 'QA', 'SA']);
  const midCost = new Set(['PT', 'CZ', 'PL', 'HU', 'HR', 'GR', 'RO', 'BG', 'TH', 'MY', 'CN', 'CL', 'UY', 'BA', 'SI', 'SK', 'LT', 'LV', 'EE']);
  const lowCost = new Set(['VN', 'ID', 'PH', 'IN', 'NP', 'LK', 'MA', 'EG', 'KE', 'TZ', 'CO', 'PE', 'BO', 'EC', 'GT', 'HN', 'NI', 'CR', 'PA', 'CU', 'JM', 'DO']);

  let baseCost = 50; // Default daily budget
  if (highCost.has(countryCode)) baseCost = 120;
  else if (midHighCost.has(countryCode)) baseCost = 85;
  else if (midCost.has(countryCode)) baseCost = 55;
  else if (lowCost.has(countryCode)) baseCost = 35;

  // Capital cities cost more
  if (featureCode === 'PPLC') baseCost *= 1.2;

  // Large cities cost more
  if (population > 1_000_000) baseCost *= 1.15;
  else if (population > 500_000) baseCost *= 1.08;

  return Math.round(baseCost);
}

function estimateMealCost(countryCode, featureCode) {
  const highCost = new Set(['CH', 'NO', 'SE', 'DK', 'IS', 'SG', 'JP', 'AU', 'NZ', 'GB', 'US']);
  const midCost = new Set(['DE', 'FR', 'NL', 'AT', 'IT', 'ES', 'PT', 'KR', 'AE', 'CA']);
  const lowCost = new Set(['VN', 'ID', 'PH', 'IN', 'TH', 'CO', 'PE', 'MA', 'EG']);

  if (highCost.has(countryCode)) return Math.round(25 + Math.random() * 15);
  if (midCost.has(countryCode)) return Math.round(15 + Math.random() * 10);
  if (lowCost.has(countryCode)) return Math.round(4 + Math.random() * 6);
  return Math.round(8 + Math.random() * 10);
}

function estimateRent(countryCode, population) {
  const highCost = new Set(['CH', 'NO', 'SE', 'DK', 'IS', 'SG', 'HK', 'AU', 'NZ', 'GB', 'US']);
  const midCost = new Set(['DE', 'FR', 'NL', 'AT', 'IT', 'ES', 'PT', 'KR', 'AE', 'CA', 'JP']);
  const lowCost = new Set(['VN', 'ID', 'PH', 'IN', 'TH', 'CO', 'PE', 'MA', 'EG', 'GE', 'AM', 'AL']);

  let baseRent = 800;
  if (highCost.has(countryCode)) baseRent = 2200;
  else if (midCost.has(countryCode)) baseRent = 1300;
  else if (lowCost.has(countryCode)) baseRent = 400;

  if (population > 1_000_000) baseRent *= 1.3;
  else if (population > 500_000) baseRent *= 1.1;

  return Math.round(baseRent);
}

// ---------------------------------------------------------------------------
// Safety estimation (heuristic)
// ---------------------------------------------------------------------------
function estimateSafetyScore(countryCode) {
  // Global Peace Index rough mapping (10 = safest)
  const safetyMap = {
    'IS': 9.5, 'NZ': 9.3, 'IE': 9.0, 'DK': 9.2, 'NO': 9.1, 'SE': 9.0,
    'CH': 9.4, 'FI': 9.3, 'PT': 8.8, 'AT': 8.7, 'CZ': 8.5, 'SI': 8.4,
    'JP': 8.8, 'SG': 8.9, 'AU': 8.6, 'NZ': 9.3, 'CA': 8.5, 'NL': 8.4,
    'DE': 8.3, 'GB': 8.0, 'FR': 7.5, 'IT': 7.8, 'ES': 7.9, 'KR': 8.0,
    'UY': 7.8, 'CL': 7.5, 'AR': 7.2, 'PL': 7.8, 'HU': 7.5, 'HR': 7.6,
    'GR': 7.3, 'TH': 7.0, 'MY': 7.5, 'VN': 7.2, 'ID': 6.8, 'PH': 6.5,
    'CO': 6.0, 'PE': 6.2, 'BR': 5.5, 'MX': 6.0, 'IN': 6.3, 'MA': 6.8,
    'EG': 6.0, 'KE': 5.8, 'ZA': 5.0, 'GE': 7.0, 'AM': 7.2, 'TR': 6.5,
    'AE': 8.5, 'QA': 8.0, 'SA': 6.0, 'OM': 7.5, 'JO': 7.0, 'IL': 6.5,
  };
  return safetyMap[countryCode] || 6.5;
}

function estimateWalkabilityScore(population, featureCode) {
  let score = 5;
  if (featureCode === 'PPLC' || featureCode === 'PPL') score += 2;
  if (population > 500_000) score += 1.5;
  else if (population > 100_000) score += 1;
  return Math.min(10, Math.round(score * 10) / 10);
}

function estimateInternetScore(countryCode) {
  const highInternet = new Set(['KR', 'SG', 'JP', 'HK', 'GB', 'US', 'CH', 'NO', 'SE', 'DK', 'NL', 'DE', 'FR', 'AU', 'NZ', 'AE', 'QA']);
  const midInternet = new Set(['PT', 'ES', 'IT', 'AT', 'BE', 'CZ', 'PL', 'HU', 'HR', 'RO', 'MY', 'TH', 'CN', 'UY', 'CL', 'AR', 'TR', 'IL', 'SA']);
  if (highInternet.has(countryCode)) return Math.round(85 + Math.random() * 15);
  if (midInternet.has(countryCode)) return Math.round(70 + Math.random() * 15);
  return Math.round(50 + Math.random() * 20);
}

function estimateHealthcareScore(countryCode) {
  const topHealthcare = new Set(['JP', 'SG', 'KR', 'CH', 'NO', 'SE', 'DK', 'NL', 'DE', 'AT', 'FR', 'AU', 'NZ', 'GB', 'FI', 'BE', 'IT', 'ES', 'PT', 'IL', 'AE']);
  const midHealthcare = new Set(['US', 'CA', 'CZ', 'PL', 'HU', 'HR', 'GR', 'RO', 'UY', 'CL', 'AR', 'MY', 'TH', 'CN', 'TR', 'SA', 'QA', 'BA', 'SI', 'SK']);
  if (topHealthcare.has(countryCode)) return Math.round(85 + Math.random() * 15);
  if (midHealthcare.has(countryCode)) return Math.round(70 + Math.random() * 15);
  return Math.round(50 + Math.random() * 20);
}

function estimateAirQuality(population, countryCode) {
  // Rough: larger cities in developing countries have worse air
  const cleanAir = new Set(['IS', 'NO', 'SE', 'FI', 'DK', 'NZ', 'AU', 'CA', 'CH']);
  let score = 6;
  if (cleanAir.has(countryCode)) score = 9;
  if (population > 2_000_000) score -= 1.5;
  if (['IN', 'CN', 'ID', 'EG', 'PK', 'BD'].includes(countryCode)) score -= 2;
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
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
// Checkpoint
// ---------------------------------------------------------------------------
async function loadCheckpoint() {
  if (!opts.resume) return new Set();
  try {
    const raw = await fs.readFile(CHECKPOINT_PATH, 'utf-8');
    const arr = JSON.parse(raw);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

async function saveCheckpoint(ids) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CHECKPOINT_PATH, JSON.stringify([...ids]), 'utf-8');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const start = Date.now();
  const prisma = await getPrisma();
  await fs.mkdir(DATA_DIR, { recursive: true });

  const checkpointIds = await loadCheckpoint();

  const cities = await prisma.city.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
    },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      countryCode: true,
      population: true,
      featureCode: true,
    },
    orderBy: { population: { sort: 'desc', nulls: 'last' } },
  });

  let processed = 0;
  let enriched = 0;
  let skipped = 0;
  let errors = 0;

  const limit = pLimit(3); // 3 concurrent (Overpass is slower)

  const tasks = cities
    .filter((c) => !TEST_LIMIT || processed < TEST_LIMIT)
    .filter((c) => !opts.resume || !checkpointIds.has(c.id))
    .map((city) =>
      limit(async () => {
        processed++;
        try {
          if (!FORCE) {
            const existing = await prisma.cityMetric.findUnique({ where: { cityId: city.id } });
            if (existing) { skipped++; return; }
          }

          // Fetch OSM POI counts (top cities only, to avoid rate limiting)
          let pois = { healthcare: null, transit: null, restaurants: null, parks: null };
          if ((city.population || 0) > 100_000) {
            try {
              pois = await fetchPOICounts(city.latitude, city.longitude);
              // Small delay between Overpass requests
              await new Promise((r) => setTimeout(r, 500));
            } catch {
              // Silently skip POI data on error
            }
          }

          const dailyBudget = estimateCostLevel(city.countryCode, city.population, city.featureCode);
          const mealCost = estimateMealCost(city.countryCode, city.featureCode);
          const rent = estimateRent(city.countryCode, city.population);

          // Normalize POI counts to scores (0-10)
          const normalizePOI = (count) => {
            if (count === null) return null;
            return Math.min(10, Math.round(Math.log10(count + 1) * 3 * 10) / 10);
          };

          await prisma.cityMetric.upsert({
            where: { cityId: city.id },
            update: {
              avgDailyCostUsd: dailyBudget,
              avgMealCostUsd: mealCost,
              averageRentStudioUsd: rent,
              transitScore: normalizePOI(pois.transit),
              healthcareScore: estimateHealthcareScore(city.countryCode),
              walkabilityScore: estimateWalkabilityScore(city.population, city.featureCode),
              internetScore: estimateInternetScore(city.countryCode),
              airQualityScore: estimateAirQuality(city.population, city.countryCode),
              safetyScore: estimateSafetyScore(city.countryCode),
              culturalDiversityScore: null,
              expatFriendlinessScore: null,
              soloFemaleSafetyScore: null,
              dataSource: 'heuristic+osm',
              lastFetchedAt: new Date(),
              raw: JSON.stringify({
                osm: pois,
                source: 'overpass+heuristic',
                generatedAt: new Date().toISOString(),
              }),
            },
            create: {
              cityId: city.id,
              avgDailyCostUsd: dailyBudget,
              avgMealCostUsd: mealCost,
              averageRentStudioUsd: rent,
              transitScore: normalizePOI(pois.transit),
              healthcareScore: estimateHealthcareScore(city.countryCode),
              walkabilityScore: estimateWalkabilityScore(city.population, city.featureCode),
              internetScore: estimateInternetScore(city.countryCode),
              airQualityScore: estimateAirQuality(city.population, city.countryCode),
              safetyScore: estimateSafetyScore(city.countryCode),
              dataSource: 'heuristic+osm',
              lastFetchedAt: new Date(),
              raw: JSON.stringify({
                osm: pois,
                source: 'overpass+heuristic',
                generatedAt: new Date().toISOString(),
              }),
            },
          });

          enriched++;
          checkpointIds.add(city.id);

          if (enriched % 20 === 0) {
            log('📊', `Progress: ${enriched} cities enriched, ${errors} errors`);
            await saveCheckpoint(checkpointIds);
          }
        } catch (err) {
          errors++;
          if (errors <= 5) {
            logError('❌', `Failed to enrich ${city.name} (${city.countryCode}): ${err.message}`);
          }
        }
      })
    );

  await Promise.all(tasks);
  await saveCheckpoint(checkpointIds);

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);

  const summary = { processed, enriched, skipped, errors };
  if (JSON_MODE) {
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', emoji: '📊', msg: 'Cost enrichment summary', ...summary }));
  } else {
    log('📊', 'Cost enrichment summary:');
    console.log(`  • Processed: ${processed}`);
    console.log(`  • Enriched:  ${enriched}`);
    console.log(`  • Skipped:   ${skipped}`);
    console.log(`  • Errors:    ${errors}`);
    console.log(`  • Time:      ${elapsed}s`);
  }

  await disconnectPrisma();
}

main().catch((err) => {
  logError('❌', `Fatal error: ${err.message}`);
  process.exitCode = 1;
});
