/**
 * Enrich bundle-wikivoyage.json with Pexels videos for the destination hero.
 *
 * Uses the Pexels Video API (`PEXELS_API_KEY` in `.env.local`).
 * Rate limit: ~200 req/h (shared with photo key).
 *
 *   node scripts/enrich-bundle-videos.mjs
 *   node scripts/enrich-bundle-videos.mjs --limit 20
 *   node scripts/enrich-bundle-videos.mjs --limit 50 --resume
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchPexelsVideoUrl } from './lib/video-providers.mjs';
import { buildDestinationImageQuery } from './lib/unsplash-client.mjs';
import { loadProjectEnv } from './lib/load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const CACHE_PATH = resolve(ROOT, 'src/data/travel-mock/video-cache.json');

// ── CLI args ──────────────────────────────────────────────────────────────────
const ARGS = process.argv.slice(2);
const LIMIT = parseInt(
  ARGS.find((_, i) => ARGS[i - 1] === '--limit') ??
    process.env.VIDEO_ENRICH_LIMIT ??
    '50',
  10,
);
const SKIP_EXISTING = !ARGS.includes('--reprocess');
const MAX_API_CALLS = parseInt(
  process.env.VIDEO_MAX_API_CALLS ?? '180',
  10,
);
const DELAY_MS = parseInt(
  process.env.VIDEO_DELAY_MS ?? '1200',
  10,
);
const SAVE_EVERY = parseInt(process.env.VIDEO_SAVE_EVERY ?? '5', 10);

// ── Helpers ───────────────────────────────────────────────────────────────────

loadProjectEnv(ROOT);

const PEXELS_KEY = process.env.PEXELS_API_KEY?.trim();
if (!PEXELS_KEY) {
  console.error('Set PEXELS_API_KEY in .env.local');
  process.exit(1);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadCache() {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  mkdirSync(dirname(CACHE_PATH), { recursive: true });
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function persist(bundle, cache) {
  saveCache(cache);
  writeFileSync(BUNDLE, JSON.stringify(bundle));
}

function destCacheKey(dest) {
  return `d:${dest.lang ?? 'pt'}:${dest.id}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`Missing ${BUNDLE}. Run: npm run travel:demo:build`);
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const cache = loadCache();
  const destinos = bundle.destinos ?? [];

  // Filter: destinations without videoUrl (skip existing by default)
  const candidates = destinos.filter((d) => {
    if (SKIP_EXISTING && d.videoUrl) return false;
    return true;
  });

  const alreadyDone = destinos.length - candidates.length;
  const toProcess = candidates.slice(0, LIMIT);
  const totalProcessedOffset = destinos.length - candidates.length;

  console.log(
    `Travel video enrich — ${toProcess.length} destinos (${candidates.length} total, ${alreadyDone} already have video)\n` +
      `  limit=${LIMIT}  max_api=${MAX_API_CALLS}  delay=${DELAY_MS}ms  skipExisting=${SKIP_EXISTING}\n`,
  );

  let updated = 0;
  let fromCache = 0;
  let failed = 0;
  let apiCalls = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const dest = toProcess[i];
    const key = destCacheKey(dest);

    // ── Cache hit ──────────────────────────────────────────────────────
    if (cache[key]) {
      dest.videoUrl = cache[key].url;
      fromCache += 1;
      updated += 1;
      process.stdout.write(
        `  [${i + 1}/${toProcess.length}] ${dest.nome} ⊞ cache\n`,
      );
      if (updated % SAVE_EVERY === 0) persist(bundle, cache);
      continue;
    }

    // ── Check rate limit budget ────────────────────────────────────────
    if (apiCalls >= MAX_API_CALLS) {
      console.log(
        `\nAPI budget reached (${MAX_API_CALLS}). Saving progress...`,
      );
      persist(bundle, cache);
      console.log(
        `Updated: ${updated} (${fromCache} cache) | Remaining: ~${Math.max(0, candidates.length - i)}`,
      );
      console.log('Run again to continue.');
      process.exit(0);
    }

    // ── Search ─────────────────────────────────────────────────────────
    try {
      const query = buildDestinationImageQuery(dest); // reuse image query logic
      apiCalls += 1;

      const { url, duration } = await searchPexelsVideoUrl(PEXELS_KEY, query, {
        minWidth: 1280,
        perPage: 5,
      });

      if (url) {
        dest.videoUrl = url;
        cache[key] = { url, duration };
        updated += 1;
        const dur = duration ? ` (${Math.round(duration)}s)` : '';
        process.stdout.write(
          `  [${i + 1}/${toProcess.length}] ${dest.nome} ✓${dur}\n`,
        );
      } else {
        failed += 1;
        // Don't cache empty results so we can retry later
        process.stdout.write(
          `  [${i + 1}/${toProcess.length}] ${dest.nome} — no video\n`,
        );
      }

      if (updated % SAVE_EVERY === 0) persist(bundle, cache);
    } catch (err) {
      // Rate limit or API error — save and exit
      persist(bundle, cache);
      if (err.message?.includes('rate limit') || err.message?.includes('429')) {
        console.log(`\n⚠ Pexels rate limit hit. Progress saved (${updated} updated).`);
        console.log(`  Remaining: ~${candidates.length - i}`);
        console.log('  Run again in ~1 hour.');
        process.exit(0);
      }
      console.error(`\nError on ${dest.nome}: ${err.message}`);
      process.exit(1);
    }

    await sleep(DELAY_MS);
  }

  // ── Final save ──────────────────────────────────────────────────────────
  persist(bundle, cache);

  console.log(
    `\nDone. Updated: ${updated} (${fromCache} cache), no video: ${failed}`,
  );
  console.log(`API calls: ${apiCalls}`);
  console.log(`Cache: ${CACHE_PATH}`);
  if (candidates.length > toProcess.length) {
    console.log(
      `\n~${candidates.length - toProcess.length} destinations remaining. Run again:`,
    );
    console.log('  node scripts/enrich-bundle-videos.mjs --resume');
  }
}

main();
