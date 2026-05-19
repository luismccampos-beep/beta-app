/**
 * Enrich bundle-wikivoyage.json with real Unsplash photos per destination.
 *
 * Requires: UNSPLASH_ACCESS_KEY in .env.local
 *
 * Demo Unsplash: ~50 API requests/hour — use defaults or:
 *   UNSPLASH_ENRICH_LIMIT=40
 *   UNSPLASH_MAX_API_CALLS=45
 *
 * Safe to re-run: skips destinations already enriched; uses cache.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDestinationImageQuery,
  buildDestinationImageQueryFallbacks,
  isGenericPlaceholderImage,
  searchUnsplashPhotoUrl,
  UnsplashRateLimitError,
  sleep,
} from './lib/unsplash-client.mjs';
import { loadProjectEnv } from './lib/load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const CACHE_PATH = resolve(ROOT, 'src/data/travel-mock/unsplash-cache.json');

loadProjectEnv(ROOT);

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY?.trim();
/** Max destinations to attempt this run (default safe for demo tier). */
const LIMIT = parseInt(process.env.UNSPLASH_ENRICH_LIMIT ?? '40', 10);
/** Max HTTP calls to Unsplash per run (fallbacks count too). */
const MAX_API_CALLS = parseInt(process.env.UNSPLASH_MAX_API_CALLS ?? '45', 10);
const DELAY_MS = parseInt(process.env.UNSPLASH_DELAY_MS ?? '2500', 10);
const WIDTH = parseInt(process.env.UNSPLASH_IMAGE_WIDTH ?? '1400', 10);
const ONLY_IATA = process.env.UNSPLASH_ONLY_IATA === '1';
const SAVE_EVERY = parseInt(process.env.UNSPLASH_SAVE_EVERY ?? '10', 10);

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

function cacheLookup(cache, dest) {
  const keys = [
    buildDestinationImageQuery(dest).toLowerCase(),
    ...(dest.imagem_query ? [dest.imagem_query.toLowerCase()] : []),
    ...buildDestinationImageQueryFallbacks(dest).map((q) => q.toLowerCase()),
  ];
  for (const k of keys) {
    if (cache[k]) return { url: cache[k], key: k };
  }
  return null;
}

async function fetchPhotoUrl(dest, query, apiBudget) {
  if (apiBudget.remaining <= 0) return { url: null, stopped: 'budget' };

  apiBudget.remaining -= 1;
  let url = await searchUnsplashPhotoUrl(ACCESS_KEY, query, { width: WIDTH });
  if (url) return { url, stopped: null };

  for (const alt of buildDestinationImageQueryFallbacks(dest)) {
    if (alt === query) continue;
    if (apiBudget.remaining <= 0) return { url: null, stopped: 'budget' };
    apiBudget.remaining -= 1;
    url = await searchUnsplashPhotoUrl(ACCESS_KEY, alt, { width: WIDTH });
    if (url) return { url, stopped: null };
    await sleep(300);
  }
  return { url: null, stopped: null };
}

async function main() {
  if (!ACCESS_KEY) {
    console.error(
      'Missing UNSPLASH_ACCESS_KEY. Add it to .env.local or set the variable in the shell.\n' +
        '  https://unsplash.com/oauth/applications',
    );
    process.exit(1);
  }
  if (!existsSync(BUNDLE)) {
    console.error(`Missing ${BUNDLE}. Run: npm run travel:demo:build`);
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const cache = loadCache();
  const destinos = bundle.destinos ?? [];

  const candidates = destinos.filter((d) => {
    if (ONLY_IATA && !d.iata) return false;
    return isGenericPlaceholderImage(d.imagem_url);
  });

  const alreadyDone = destinos.length - candidates.length;
  const toProcess = candidates.slice(0, LIMIT);

  console.log(
    `Unsplash enrich — ${toProcess.length} destinos nesta execução (${candidates.length} por fazer, ${alreadyDone} já com foto).\n` +
      `  limit=${LIMIT}  max_api_calls=${MAX_API_CALLS}  delay=${DELAY_MS}ms  (demo ≈50 req/h)\n`,
  );

  let updated = 0;
  let fromCache = 0;
  let failed = 0;
  const apiBudget = { remaining: MAX_API_CALLS };

  for (const dest of toProcess) {
    const query = buildDestinationImageQuery(dest);
    const cached = cacheLookup(cache, dest);

    if (cached) {
      dest.imagem_url = cached.url;
      dest.imagem_query = query;
      cache[cached.key] = cached.url;
      fromCache += 1;
      updated += 1;
      continue;
    }

    try {
      const { url, stopped } = await fetchPhotoUrl(dest, query, apiBudget);

      if (stopped === 'budget') {
        console.log(
          `\nLimite de pedidos API atingido (${MAX_API_CALLS}/execução). Progresso guardado.`,
        );
        persist(bundle, cache);
        printResumeHint(updated, fromCache, failed, candidates.length - updated);
        process.exit(0);
      }

      if (url) {
        dest.imagem_url = url;
        dest.imagem_query = query;
        cache[query.toLowerCase()] = url;
        updated += 1;
        process.stdout.write(`  ✓ ${dest.nome}\n`);
        if (updated % SAVE_EVERY === 0) persist(bundle, cache);
      } else {
        failed += 1;
        process.stdout.write(`  – ${dest.nome} (sem resultado)\n`);
      }
    } catch (e) {
      persist(bundle, cache);
      if (e instanceof UnsplashRateLimitError) {
        console.error(`\n${e.message}`);
        console.log(`\nProgresso guardado (${updated} fotos nesta sessão).`);
        printResumeHint(updated, fromCache, failed, candidates.length - updated);
        process.exit(0);
      }
      console.error(`\nErro: ${e.message}`);
      process.exit(1);
    }

    await sleep(DELAY_MS);
  }

  persist(bundle, cache);

  console.log(`\nConcluído. Atualizados: ${updated} (${fromCache} do cache), sem foto: ${failed}`);
  console.log(`Cache: ${CACHE_PATH}`);
  if (candidates.length > updated + failed) {
    console.log(`\nAinda faltam ~${candidates.length - updated - failed} destinos. Corre de novo mais tarde:`);
    console.log('  npm run travel:unsplash:enrich');
  }
  console.log('\nReinicia o Next.js dev server para ver as imagens nos resultados.');
}

function printResumeHint(updated, fromCache, failed, remaining) {
  console.log(
    `\nPara continuar (após ~1 hora no plano demo):\n` +
      `  npm run travel:unsplash:enrich\n` +
      `Ou só destinos com aeroporto:\n` +
      `  $env:UNSPLASH_ONLY_IATA=1; npm run travel:unsplash:enrich`,
  );
  if (remaining > 0) {
    console.log(`Restam ~${remaining} destinos com imagem genérica.`);
  }
}

main();
