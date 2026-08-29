#!/usr/bin/env node
/**
 * enrich-embeddings.mjs — Generate text embeddings for cities.
 *
 * Creates rich text descriptions for each city, then generates embeddings
 * using OpenAI's text-embedding-3-small model. Stores in city_embeddings table.
 *
 * Prerequisites:
 *   - OPENAI_API_KEY environment variable set
 *   - Cities must exist in the database
 *
 * Usage:
 *   node scripts/enrich-embeddings.mjs                  # embed all cities
 *   node scripts/enrich-embeddings.mjs --limit 10       # test with 10 cities
 *   node scripts/enrich-embeddings.mjs --resume         # skip already-embedded
 *   node scripts/enrich-embeddings.mjs --force          # regenerate all
 *   node scripts/enrich-embeddings.mjs --json           # structured output
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
  .name('enrich-embeddings')
  .description('Generate embeddings for cities based on their attributes')
  .option('--limit <number>', 'Limit number of cities')
  .option('--resume', 'Skip already-embedded cities')
  .option('--force', 'Regenerate all embeddings')
  .option('--model <model>', 'Embedding model', 'text-embedding-3-small')
  .option('--json', 'Output structured JSON lines')
  .parse(process.argv);

const opts = program.opts();
const JSON_MODE = opts.json === true;
const TEST_LIMIT = opts.limit ? parseInt(opts.limit, 10) : null;
const FORCE = opts.force === true;
const MODEL = opts.model || 'text-embedding-3-small';

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
const DATA_DIR = path.join(__dirname, '..', 'data', 'embeddings');
const CHECKPOINT_PATH = path.join(DATA_DIR, 'embedded-city-ids.json');

// ---------------------------------------------------------------------------
// OpenAI Embeddings API
// ---------------------------------------------------------------------------
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateEmbedding(text) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      input: text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

// ---------------------------------------------------------------------------
// City text generation
// ---------------------------------------------------------------------------
function buildCityText(city, climate, metric) {
  const parts = [];

  // Basic info
  parts.push(`${city.name} is a city in ${city.country?.name || city.countryCode}.`);
  if (city.admin1Name) parts.push(`It is located in ${city.admin1Name}.`);

  // Population
  if (city.population) {
    if (city.population > 1_000_000) parts.push(`Population: ${(city.population / 1_000_000).toFixed(1)} million.`);
    else if (city.population > 1_000) parts.push(`Population: ${Math.round(city.population / 1_000)}k.`);
    else parts.push(`Population: ${city.population}.`);
  }

  // Coordinates
  if (city.latitude && city.longitude) {
    const hemisphere = city.latitude >= 0 ? 'Northern' : 'Southern';
    parts.push(`Located at ${Math.abs(city.latitude).toFixed(1)}° ${hemisphere} latitude.`);
  }

  // Climate (from monthly data)
  if (climate?.length > 0) {
    const avgAnnual = climate.reduce((s, m) => s + (m.avgTempAvgC || 0), 0) / climate.length;
    const totalPrecip = climate.reduce((s, m) => s + (m.precipitationMm || 0), 0);

    if (avgAnnual > 25) parts.push('Tropical climate with warm temperatures year-round.');
    else if (avgAnnual > 18) parts.push('Subtropical climate.');
    else if (avgAnnual > 10) parts.push('Temperate climate with distinct seasons.');
    else if (avgAnnual > 3) parts.push('Continental climate with cold winters and warm summers.');
    else parts.push('Cold climate.');

    if (totalPrecip > 1500) parts.push('Very high rainfall.');
    else if (totalPrecip > 800) parts.push('Moderate to high rainfall.');
    else if (totalPrecip < 300) parts.push('Very dry climate.');
  }

  // Cost
  if (metric?.avgDailyCostUsd) {
    if (metric.avgDailyCostUsd > 100) parts.push('Expensive destination for travelers.');
    else if (metric.avgDailyCostUsd > 60) parts.push('Moderate cost for travelers.');
    else parts.push('Budget-friendly destination.');
  }

  // Safety
  if (metric?.safetyScore) {
    if (metric.safetyScore >= 8) parts.push('Very safe city for tourists.');
    else if (metric.safetyScore >= 6) parts.push('Generally safe for tourists.');
    else parts.push('Exercise normal precautions.');
  }

  // Internet
  if (metric?.internetScore) {
    if (metric.internetScore >= 80) parts.push('Excellent internet infrastructure, great for digital nomads.');
    else if (metric.internetScore >= 60) parts.push('Good internet connectivity.');
  }

  // Transit
  if (metric?.transitScore) {
    if (metric.transitScore >= 7) parts.push('Excellent public transportation system.');
    else if (metric.transitScore >= 5) parts.push('Good public transit options.');
  }

  // Healthcare
  if (metric?.healthcareScore) {
    if (metric.healthcareScore >= 80) parts.push('World-class healthcare system.');
    else if (metric.healthcareScore >= 60) parts.push('Good healthcare facilities.');
  }

  // Air quality
  if (metric?.airQualityScore) {
    if (metric.airQualityScore >= 8) parts.push('Excellent air quality.');
    else if (metric.airQualityScore < 5) parts.push('Air quality may be a concern.');
  }

  // Timezone
  if (city.timezone) {
    parts.push(`Timezone: ${city.timezone}.`);
  }

  return parts.join(' ');
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
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!OPENAI_API_KEY) {
    logError('❌', 'OPENAI_API_KEY environment variable is required');
    process.exitCode = 1;
    return;
  }

  const start = Date.now();
  const prisma = await getPrisma();
  await fs.mkdir(DATA_DIR, { recursive: true });

  const checkpointIds = await loadCheckpoint();

  const cities = await prisma.city.findMany({
    select: {
      id: true,
      name: true,
      countryCode: true,
      admin1Name: true,
      population: true,
      latitude: true,
      longitude: true,
      timezone: true,
      country: { select: { name: true } },
    },
    orderBy: { population: { sort: 'desc', nulls: 'last' } },
  });

  let processed = 0;
  let embedded = 0;
  let skipped = 0;
  let errors = 0;

  const limit = pLimit(5);

  const tasks = cities
    .filter((c) => !TEST_LIMIT || processed < TEST_LIMIT)
    .filter((c) => !opts.resume || !checkpointIds.has(c.id))
    .map((city) =>
      limit(async () => {
        processed++;
        try {
          if (!FORCE) {
            const existing = await prisma.cityEmbedding.findFirst({ where: { cityId: city.id } });
            if (existing) { skipped++; return; }
          }

          // Fetch related data
          const [climate, metric] = await Promise.all([
            prisma.cityMonthlyMetric.findMany({
              where: { cityId: city.id },
              orderBy: { month: 'asc' },
            }),
            prisma.cityMetric.findUnique({ where: { cityId: city.id } }),
          ]);

          const text = buildCityText(city, climate, metric);
          const vector = await generateEmbedding(text);

          await prisma.cityEmbedding.create({
            data: {
              cityId: city.id,
              model: MODEL,
              vector,
              embeddingType: 'city_summary',
              sourceFields: JSON.stringify({
                hasClimate: climate.length > 0,
                hasMetric: !!metric,
                textLength: text.length,
              }),
            },
          });

          embedded++;
          checkpointIds.add(city.id);

          if (embedded % 25 === 0) {
            log('📊', `Progress: ${embedded} cities embedded, ${errors} errors`);
            await saveCheckpoint(checkpointIds);
          }

          // Rate limit: 500 requests/min for OpenAI
          await new Promise((r) => setTimeout(r, 150));
        } catch (err) {
          errors++;
          if (errors <= 5) {
            logError('❌', `Failed to embed ${city.name}: ${err.message}`);
          }
        }
      })
    );

  await Promise.all(tasks);
  await saveCheckpoint(checkpointIds);

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);

  const summary = { processed, embedded, skipped, errors, model: MODEL };
  if (JSON_MODE) {
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', emoji: '📊', msg: 'Embedding summary', ...summary }));
  } else {
    log('📊', 'Embedding summary:');
    console.log(`  • Processed: ${processed}`);
    console.log(`  • Embedded:  ${embedded}`);
    console.log(`  • Skipped:   ${skipped}`);
    console.log(`  • Errors:    ${errors}`);
    console.log(`  • Model:     ${MODEL}`);
    console.log(`  • Time:      ${elapsed}s`);
  }

  await disconnectPrisma();
}

main().catch((err) => {
  logError('❌', `Fatal error: ${err.message}`);
  process.exitCode = 1;
});
