/**
 * Enrich bundle-wikivoyage.json with gallery images (multiple photos per destination)
 * via Unsplash search, stored in the `galleryImages` field.
 *
 *   node scripts/enrich-bundle-gallery-images.mjs
 *   node scripts/enrich-bundle-gallery-images.mjs --limit 50 --photos 4
 *
 * Requires UNSPLASH_ACCESS_KEY in .env.local.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDestinationImageQuery,
  buildDestinationImageQueryFallbacks,
  isGenericPlaceholderImage,
  searchUnsplashPhotoUrls,
  sleep,
} from './lib/unsplash-client.mjs';
import { loadProjectEnv } from './lib/load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const CACHE_PATH = resolve(ROOT, 'src/data/travel-mock/gallery-cache.json');

loadProjectEnv(ROOT);

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY?.trim();
if (!UNSPLASH_KEY) {
  console.error('Set UNSPLASH_ACCESS_KEY in .env.local');
  process.exit(1);
}

// ── CLI flags ─────────────────────────────────────────────────────
const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg
  ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10)
  : 50;

const photosArg = process.argv.find((a) => a.startsWith('--photos'));
const PHOTOS_PER_DEST = photosArg
  ? parseInt(photosArg.split('=')[1] ?? process.argv[process.argv.indexOf('--photos') + 1], 10)
  : 4;

const RESUME = process.argv.includes('--resume');
const FORCE = process.argv.includes('--force'); // re-fetch even if already has gallery images
const DELAY_MS = parseInt(process.env.GALLERY_DELAY_MS ?? '3000', 10); // ~20 req/min safe for demo tier

// ── Cache ─────────────────────────────────────────────────────────
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

function cacheKey(dest) {
  return `g:${dest.lang ?? 'pt'}:${dest.id}`;
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`Missing ${BUNDLE}. Run: npm run travel:demo:build`);
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const cache = loadCache();

  // --resume: skip destinations that already have gallery images (project convention)
  // --force: re-process all destinations, using cache when available
  let candidates = destinos.filter((d) => {
    if (FORCE) return true;
    if (RESUME && Array.isArray(d.galleryImages) && d.galleryImages.length > 0) return false;
    return true;
  });

  const toProcess = candidates.slice(0, LIMIT);

  console.log(
    `Gallery images enrich — Unsplash\n` +
    `  ${toProcess.length} destinos | ${PHOTOS_PER_DEST} fotos cada | delay ${DELAY_MS}ms\n` +
    `  ${candidates.length - toProcess.length} restantes para próximas execuções\n`,
  );

  let updated = 0;
  let fromCache = 0;
  let totalPhotos = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const dest = toProcess[i];
    const key = cacheKey(dest);

    // Check cache — always use it if available
    if (Array.isArray(cache[key]) && cache[key].length > 0) {
      dest.galleryImages = cache[key];
      fromCache++;
      updated++;
      totalPhotos += cache[key].length;
      process.stdout.write(`  [${i + 1}/${toProcess.length}] ${dest.nome} ✓ (${cache[key].length} cache)\n`);
      if (updated % 15 === 0) {
        writeFileSync(BUNDLE, JSON.stringify(bundle));
        saveCache(cache);
      }
      continue;
    }

    // Build queries, trying the main one and fallbacks
    const mainQuery = buildDestinationImageQuery(dest);
    const queries = [mainQuery, ...buildDestinationImageQueryFallbacks(dest).filter((q) => q !== mainQuery)];

    let urls = [];
    for (const q of queries) {
      if (urls.length >= PHOTOS_PER_DEST) break;
      try {
        const results = await searchUnsplashPhotoUrls(UNSPLASH_KEY, q, {
          perPage: PHOTOS_PER_DEST,
          width: 800,
        });
        if (results === 'RATE_LIMITED') {
          console.log('\n⏸ Rate limited (Unsplash). Saving progress...');
          writeFileSync(BUNDLE, JSON.stringify(bundle));
          saveCache(cache);
          console.log(`\nUpdated ${updated} so far. Run again later.`);
          process.exit(0);
        }
        // Merge, deduplicate — skip if it matches the hero image (unless hero is placeholder)
        const skipHero = !isGenericPlaceholderImage(dest.imagem_url);
        for (const u of results) {
          if (!urls.includes(u) && (!skipHero || u !== dest.imagem_url)) urls.push(u);
          if (urls.length >= PHOTOS_PER_DEST) break;
        }
        if (urls.length >= PHOTOS_PER_DEST) break;
        await sleep(500);
      } catch {
        // next query
      }
    }

    if (urls.length > 0) {
      dest.galleryImages = urls;
      cache[key] = urls;
      updated++;
      totalPhotos += urls.length;
      process.stdout.write(`  [${i + 1}/${toProcess.length}] ${dest.nome} ✓ (${urls.length} fotos)
`);
    } else {
      // Don't cache empty results — allow retry on next run
      process.stdout.write(`  [${i + 1}/${toProcess.length}] ${dest.nome} — sem resultados\n`);
    }

    // Save progress every 10
    if ((i + 1) % 10 === 0 || i === toProcess.length - 1) {
      writeFileSync(BUNDLE, JSON.stringify(bundle));
      saveCache(cache);
      process.stdout.write(`  [checkpoint] saved\n`);
    }

    await sleep(DELAY_MS);
  }

  // Final save
  writeFileSync(BUNDLE, JSON.stringify(bundle));
  saveCache(cache);

  const remaining = candidates.length - toProcess.length;
  console.log(
    `\nDone. ${updated} updated (${fromCache} cache), ${totalPhotos} photos total.` +
    (remaining > 0 ? `\n~${remaining} remaining — run again.` : ''),
  );
}

main().catch((e) => {
  console.error('\nFatal:', e);
  process.exit(1);
});
