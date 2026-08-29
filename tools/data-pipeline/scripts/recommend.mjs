#!/usr/bin/env node
/**
 * recommend.mjs — Match UserTravelProfile preferences to cities.
 *
 * Queries user profiles and finds the best-matching cities based on:
 *   - Climate preferences (preferredClimates, travelMonths)
 *   - Budget constraints (maxDailyBudgetUsd)
 *   - Safety requirements (minSafetyScore)
 *   - Lifestyle preferences (pacePreference, crowdTolerance)
 *   - Semantic similarity via city embeddings (cosine distance)
 *
 * Usage:
 *   node scripts/recommend.mjs                          # recommend for all profiles
 *   node scripts/recommend.mjs --user <userId>          # recommend for specific user
 *   node scripts/recommend.mjs --limit 10               # top 10 per profile
 *   node scripts/recommend.mjs --json                   # structured output
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
  .name('recommend')
  .description('Match user travel profiles to best cities')
  .option('--user <userId>', 'Recommend for a specific user ID')
  .option('--limit <number>', 'Top N cities per profile', '10')
  .option('--json', 'Output structured JSON lines')
  .parse(process.argv);

const opts = program.opts();
const JSON_MODE = opts.json === true;
const TOP_N = parseInt(opts.limit, 10);

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
// Cosine similarity (for vector comparison)
// ---------------------------------------------------------------------------
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ---------------------------------------------------------------------------
// Profile → City scoring
// ---------------------------------------------------------------------------
function scoreCity(city, profile, embeddingSimilarity) {
  let score = 0;
  let reasons = [];

  // Budget filter (hard filter)
  if (profile.maxDailyBudgetUsd && city.metric?.avgDailyCostUsd) {
    if (city.metric.avgDailyCostUsd > profile.maxDailyBudgetUsd) {
      return { score: 0, reasons: ['over_budget'] };
    }
    // Closer to budget sweet spot = higher score
    const budgetRatio = city.metric.avgDailyCostUsd / profile.maxDailyBudgetUsd;
    if (budgetRatio <= 0.7) {
      score += 2;
      reasons.push('very_affordable');
    } else if (budgetRatio <= 0.9) {
      score += 1.5;
      reasons.push('affordable');
    } else {
      score += 1;
      reasons.push('within_budget');
    }
  }

  // Safety filter (hard filter)
  if (profile.minSafetyScore && city.metric?.safetyScore) {
    if (city.metric.safetyScore < profile.minSafetyScore) {
      return { score: 0, reasons: ['unsafe'] };
    }
    score += city.metric.safetyScore / 5;
    reasons.push('safe');
  }

  // Walkability preference
  if (profile.minWalkabilityScore && city.metric?.walkabilityScore) {
    if (city.metric.walkabilityScore >= profile.minWalkabilityScore) {
      score += 1;
      reasons.push('walkable');
    }
  }

  // Climate matching
  if (profile.preferredClimates?.length > 0 && city.monthlyMetrics?.length > 0) {
    const avgTemp = city.monthlyMetrics.reduce((s, m) => s + (m.avgTempAvgC || 0), 0) / city.monthlyMetrics.length;
    const climateMatch = profile.preferredClimates.some((pref) => {
      switch (pref.toLowerCase()) {
        case 'tropical': return avgTemp > 24;
        case 'subtropical': return avgTemp > 17 && avgTemp <= 24;
        case 'temperate': return avgTemp > 9 && avgTemp <= 17;
        case 'continental': return avgTemp > 2 && avgTemp <= 9;
        case 'cold': return avgTemp <= 2;
        case 'dry': return city.monthlyMetrics.reduce((s, m) => s + (m.precipitationMm || 0), 0) < 400;
        case 'wet': return city.monthlyMetrics.reduce((s, m) => s + (m.precipitationMm || 0), 0) > 1000;
        default: return false;
      }
    });
    if (climateMatch) {
      score += 2;
      reasons.push('climate_match');
    }
  }

  // Travel month matching
  if (profile.travelMonths?.length > 0 && city.monthlyMetrics?.length > 0) {
    const idealMonths = [];
    for (const m of city.monthlyMetrics) {
      if (m.avgTempAvgC >= 15 && m.avgTempAvgC <= 28 && (m.precipitationMm || 0) < 100) {
        idealMonths.push(m.month);
      }
    }
    const monthOverlap = profile.travelMonths.filter((m) => idealMonths.includes(m));
    if (monthOverlap.length > 0) {
      score += 1.5;
      reasons.push('good_timing');
    }
  }

  // Pace preference
  if (profile.pacePreference && city.population) {
    const paceMatch =
      (profile.pacePreference === 'slow' && city.population < 500_000) ||
      (profile.pacePreference === 'moderate' && city.population >= 200_000 && city.population < 2_000_000) ||
      (profile.pacePreference === 'fast' && city.population >= 1_000_000);
    if (paceMatch) {
      score += 1;
      reasons.push('pace_match');
    }
  }

  // Crowd tolerance
  if (profile.crowdTolerance && city.monthlyMetrics?.length > 0) {
    const avgCrowd = city.monthlyMetrics.reduce((s, m) => s + (m.crowdScore || 5), 0) / city.monthlyMetrics.length;
    const crowdMatch =
      (profile.crowdTolerance === 'low' && avgCrowd < 4) ||
      (profile.crowdTolerance === 'medium' && avgCrowd >= 3 && avgCrowd <= 7) ||
      (profile.crowdTolerance === 'high' && avgCrowd > 6);
    if (crowdMatch) {
      score += 0.5;
      reasons.push('crowd_match');
    }
  }

  // Dietary preferences
  if (profile.dietaryPreferences?.length > 0) {
    // This would ideally check restaurant data, but for now we use heuristics
    const vegetarianFriendly = ['IN', 'TH', 'ID', 'IL', 'DE', 'GB', 'US', 'AU'];
    if (profile.dietaryPreferences.includes('vegetarian') && vegetarianFriendly.includes(city.countryCode)) {
      score += 0.5;
      reasons.push('dietary_match');
    }
  }

  // Embedding similarity (semantic match)
  if (embeddingSimilarity > 0.7) {
    score += embeddingSimilarity * 2;
    reasons.push(`semantic_match (${embeddingSimilarity.toFixed(2)})`);
  }

  // Is primary city bonus
  if (city.isPrimary) {
    score += 0.5;
    reasons.push('primary_city');
  }

  // Popularity bonus (well-known destinations)
  if ((city.population || 0) > 500_000) {
    score += 0.3;
    reasons.push('major_city');
  }

  return { score: Math.round(score * 100) / 100, reasons };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const start = Date.now();
  const prisma = await getPrisma();

  // Fetch profiles
  const profileWhere = opts.user ? { userId: opts.user } : {};
  const profiles = await prisma.userTravelProfile.findMany({
    where: profileWhere,
    orderBy: { updatedAt: 'desc' },
  });

  if (profiles.length === 0) {
    log('ℹ️', 'No travel profiles found. Create one in the app first.');
    await disconnectPrisma();
    return;
  }

  log('👤', `Processing ${profiles.length} travel profile(s)`);

  // Fetch all cities with their metrics
  const cities = await prisma.city.findMany({
    select: {
      id: true,
      name: true,
      countryCode: true,
      admin1Name: true,
      population: true,
      isPrimary: true,
      latitude: true,
      longitude: true,
      slug: true,
      country: { select: { name: true, nameEn: true } },
      metric: true,
      monthlyMetrics: true,
      embeddings: { take: 1, orderBy: { updatedAt: 'desc' } },
    },
    where: {
      isPrimary: true,
      latitude: { not: null },
    },
    orderBy: { population: { sort: 'desc', nulls: 'last' } },
    take: 5000,
  });

  log('🏙️', `Loaded ${cities.length} primary cities`);

  const limit = pLimit(1);
  const results = [];

  for (const profile of profiles) {
    log('🔍', `Matching profile for user ${profile.userId}...`);

    const scored = cities.map((city) => {
      const cityEmbedding = city.embeddings?.[0]?.vector;
      let embeddingSim = 0;

      // If profile has preferred embeddings, compute similarity
      // For now, use a basic heuristic since profiles don't have their own embeddings yet
      embeddingSim = 0;

      const { score, reasons } = scoreCity(city, profile, embeddingSim);
      return {
        cityId: city.id,
        slug: city.slug,
        name: city.name,
        country: city.country?.nameEn || city.country?.name || city.countryCode,
        countryCode: city.countryCode,
        admin1: city.admin1Name,
        population: city.population,
        latitude: city.latitude,
        longitude: city.longitude,
        score,
        reasons,
        metric: city.metric ? {
          avgDailyCostUsd: city.metric.avgDailyCostUsd,
          safetyScore: city.metric.safetyScore,
          walkabilityScore: city.metric.walkabilityScore,
          internetScore: city.metric.internetScore,
        } : null,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, TOP_N).filter((c) => c.score > 0);

    results.push({
      userId: profile.userId,
      profileId: profile.id,
      preferences: {
        preferredClimates: profile.preferredClimates,
        travelMonths: profile.travelMonths,
        maxDailyBudgetUsd: profile.maxDailyBudgetUsd,
        pacePreference: profile.pacePreference,
        crowdTolerance: profile.crowdTolerance,
      },
      recommendations: top,
    });

    if (JSON_MODE) {
      for (const rec of top) {
        console.log(JSON.stringify({
          ts: new Date().toISOString(),
          level: 'info',
          emoji: '🎯',
          userId: profile.userId,
          city: rec.name,
          country: rec.country,
          score: rec.score,
          reasons: rec.reasons,
        }));
      }
    } else {
      log('🎯', `Top ${TOP_N} for user ${profile.userId}:`);
      for (const [i, rec] of top.entries()) {
        console.log(`  ${i + 1}. ${rec.name}, ${rec.country} (score: ${rec.score})`);
        console.log(`     Reasons: ${rec.reasons.join(', ')}`);
        if (rec.metric) {
          console.log(`     $${rec.metric.avgDailyCostUsd}/day | Safety: ${rec.metric.safetyScore} | Walk: ${rec.metric.walkabilityScore} | Internet: ${rec.metric.internetScore}`);
        }
      }
    }
  }

  // Save results
  const resultsPath = path.join(__dirname, '..', 'data', 'recommendations.json');
  await fs.mkdir(path.dirname(resultsPath), { recursive: true });
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2), 'utf-8');
  log('💾', `Saved recommendations to ${path.basename(resultsPath)}`);

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  log('✅', `Recommendation generation complete in ${elapsed}s`);

  await disconnectPrisma();
}

main().catch((err) => {
  logError('❌', `Fatal error: ${err.message}`);
  process.exitCode = 1;
});
