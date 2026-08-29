#!/usr/bin/env node
/**
 * enrich-climate.mjs — Fetch climate data from Open-Meteo for all cities.
 *
 * Populates city_monthly_metrics with daily historical averages and
 * climate descriptions. Uses Open-Meteo's free historical weather API.
 *
 * Usage:
 *   node scripts/enrich-climate.mjs                    # enrich all cities
 *   node scripts/enrich-climate.mjs --limit 50         # test with 50 cities
 *   node scripts/enrich-climate.mjs --resume           # skip already-enriched
 *   node scripts/enrich-climate.mjs --force            # overwrite existing data
 *   node scripts/enrich-climate.mjs --json             # structured output
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
  .name('enrich-climate')
  .description('Fetch climate data from Open-Meteo for cities')
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
const DATA_DIR = path.join(__dirname, '..', 'data', 'climate');
const CHECKPOINT_PATH = path.join(DATA_DIR, 'enriched-city-ids.json');

// ---------------------------------------------------------------------------
// Open-Meteo constants
// ---------------------------------------------------------------------------
const OPEN_METEO_BASE = 'https://archive-api.open-meteo.com/v1/archive';
const CLIMATE_API = 'https://climate-api.open-meteo.com/v1/climate';
const HISTORICAL_YEARS = 10; // Use last 10 years for climate normals
const TARGET_YEAR = new Date().getFullYear() - 1;

// Month names
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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
    log('📂', `Loaded checkpoint (${arr.length} enriched cities)`);
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
// Open-Meteo API
// ---------------------------------------------------------------------------
async function fetchClimateData(lat, lon) {
  // Fetch historical daily data for the last 10 years
  const startDate = `${TARGET_YEAR - HISTORICAL_YEARS}-01-01`;
  const endDate = `${TARGET_YEAR}-12-31`;

  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    start_date: startDate,
    end_date: endDate,
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'rain_sum',
      'snowfall_sum',
      'sunshine_duration',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
  });

  const res = await fetch(`${OPEN_METEO_BASE}?${params}`);
  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

function aggregateByMonth(daily) {
  const monthly = Array.from({ length: 12 }, () => ({
    tempMax: [],
    tempMin: [],
    precipitation: [],
    rain: [],
    snowfall: [],
    sunshine: [],
    windMax: [],
    days: 0,
  }));

  const dates = daily.time || [];
  for (let i = 0; i < dates.length; i++) {
    const month = new Date(dates[i]).getMonth(); // 0-indexed
    const bucket = monthly[month];
    if (!bucket) continue;

    if (daily.temperature_2m_max?.[i] != null) bucket.tempMax.push(daily.temperature_2m_max[i]);
    if (daily.temperature_2m_min?.[i] != null) bucket.tempMin.push(daily.temperature_2m_min[i]);
    if (daily.precipitation_sum?.[i] != null) bucket.precipitation.push(daily.precipitation_sum[i]);
    if (daily.rain_sum?.[i] != null) bucket.rain.push(daily.rain_sum[i]);
    if (daily.snowfall_sum?.[i] != null) bucket.snowfall.push(daily.snowfall_sum[i]);
    if (daily.sunshine_duration?.[i] != null) bucket.sunshine.push(daily.sunshine_duration[i] / 3600); // seconds -> hours
    if (daily.wind_speed_10m_max?.[i] != null) bucket.windMax.push(daily.wind_speed_10m_max[i]);
    bucket.days++;
  }

  const avg = (arr) => arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null;
  const sum = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) * 10) / 10;

  return monthly.map((m, i) => ({
    month: i + 1,
    avgTempMaxC: avg(m.tempMax),
    avgTempMinC: avg(m.tempMin),
    avgTempAvgC: m.tempMax.length > 0
      ? Math.round(((avg(m.tempMax) + avg(m.tempMin)) / 2) * 10) / 10
      : null,
    precipitationMm: sum(m.precipitation),
    rainyDays: m.rain.length > 0 ? Math.round(m.rain.filter((d) => d > 0.5).length / Math.max(1, m.days) * 30) : null,
    sunshineHours: m.sunshine.length > 0 ? Math.round(sum(m.sunshine) / Math.max(1, m.days) * 30 * 10) / 10 : null,
    snowfallMm: sum(m.snowfall),
    windSpeedMaxKmh: avg(m.windMax),
  }));
}

function describeClimate(monthly) {
  const avgAnnualTemp = monthly.reduce((s, m) => s + (m.avgTempAvgC || 0), 0) / 12;
  const totalPrecip = monthly.reduce((s, m) => s + (m.precipitationMm || 0), 0);
  const wetMonth = monthly.reduce((max, m) => (m.precipitationMm || 0) > (max.precipitationMm || 0) ? m : max, monthly[0]);
  const dryMonth = monthly.reduce((min, m) => (m.precipitationMm || 10000) < (min.precipitationMm || 10000) ? m : min, monthly[0]);

  const descriptions = [];

  if (avgAnnualTemp > 25) descriptions.push('Tropical');
  else if (avgAnnualTemp > 18) descriptions.push('Subtropical');
  else if (avgAnnualTemp > 10) descriptions.push('Temperate');
  else if (avgAnnualTemp > 3) descriptions.push('Continental');
  else descriptions.push('Cold/Arctic');

  if (totalPrecip > 1500) descriptions.push('very wet');
  else if (totalPrecip > 800) descriptions.push('wet');
  else if (totalPrecip > 400) descriptions.push('moderate rainfall');
  else descriptions.push('dry');

  const hotMonth = monthly.reduce((max, m) => (m.avgTempMaxC || -100) > (max.avgTempMaxC || -100) ? m : max, monthly[0]);
  const coldMonth = monthly.reduce((min, m) => (m.avgTempMinC || 100) < (min.avgTempMinC || 100) ? m : min, monthly[0]);

  return `${descriptions.join(' ')} climate. Hot season: ${MONTH_NAMES[hotMonth.month - 1]} (${hotMonth.avgTempMaxC}°C). Cold season: ${MONTH_NAMES[coldMonth.month - 1]} (${coldMonth.avgTempMinC}°C). ${MONTH_NAMES[wetMonth.month - 1]} wettest (${wetMonth.precipitationMm}mm), ${MONTH_NAMES[dryMonth.month - 1]} driest (${dryMonth.precipitationMm}mm).`;
}

function idealTravelMonths(monthly) {
  // Find months with pleasant temps (15-28°C avg) and low precipitation
  return monthly
    .filter((m) => {
      const avg = m.avgTempAvgC || 0;
      return avg >= 15 && avg <= 28 && (m.precipitationMm || 0) < 100;
    })
    .map((m) => m.month);
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
    },
    orderBy: { population: { sort: 'desc', nulls: 'last' } },
  });

  let processed = 0;
  let enriched = 0;
  let skipped = 0;
  let errors = 0;

  const limit = pLimit(5); // 5 concurrent requests (respect rate limits)

  const tasks = cities
    .filter((c) => !TEST_LIMIT || processed < TEST_LIMIT)
    .filter((c) => !opts.resume || !checkpointIds.has(c.id))
    .map((city) =>
      limit(async () => {
        processed++;
        try {
          const data = await fetchClimateData(city.latitude, city.longitude);
          if (!data?.daily) {
            skipped++;
            return;
          }

          const monthly = aggregateByMonth(data.daily);
          const climateDesc = describeClimate(monthly);
          const idealMonths = idealTravelMonths(monthly);

          if (!FORCE) {
            const existing = await prisma.cityMonthlyMetric.findMany({
              where: { cityId: city.id },
            });
            if (existing.length > 0) {
              skipped++;
              return;
            }
          }

          for (const m of monthly) {
            await prisma.cityMonthlyMetric.upsert({
              where: {
                cityId_month: { cityId: city.id, month: m.month },
              },
              update: {
                avgTempMaxC: m.avgTempMaxC,
                avgTempMinC: m.avgTempMinC,
                avgTempAvgC: m.avgTempAvgC,
                precipitationMm: m.precipitationMm,
                rainyDays: m.rainyDays,
                sunshineHours: m.sunshineHours,
                snowfallMm: m.snowfallMm,
                windSpeedMaxKmh: m.windSpeedMaxKmh,
                climateDescription: m.month === 1 ? climateDesc : undefined,
                idealFor: m.month === 1 ? idealMonths : undefined,
              },
              create: {
                cityId: city.id,
                month: m.month,
                avgTempMaxC: m.avgTempMaxC,
                avgTempMinC: m.avgTempMinC,
                avgTempAvgC: m.avgTempAvgC,
                precipitationMm: m.precipitationMm,
                rainyDays: m.rainyDays,
                sunshineHours: m.sunshineHours,
                snowfallMm: m.snowfallMm,
                windSpeedMaxKmh: m.windSpeedMaxKmh,
                climateDescription: m.month === 1 ? climateDesc : null,
                idealFor: m.month === 1 ? idealMonths : [],
              },
            });
          }

          enriched++;
          checkpointIds.add(city.id);

          if (enriched % 25 === 0) {
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
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', emoji: '📊', msg: 'Climate enrichment summary', ...summary }));
  } else {
    log('📊', 'Climate enrichment summary:');
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
