/**
 * Enrich bundle-wikivoyage.json com fotos reais via `images-map`:
 * Pexels → Pixabay (cache local) → Unsplash
 *
 * Variáveis (`.env.local` carregado automaticamente):
 *   PIXABAY_API_KEY      — ~100 req/min; imagens guardadas em public/travel-images/
 *   PEXELS_API_KEY       — ~200 req/h
 *   UNSPLASH_ACCESS_KEY  — fallback (~50 req/h demo)
 *
 *   npm run travel:images:enrich
 *   npm run travel:images:status
 *
 *   TRAVEL_IMAGES_REFRESH=duplicates  — volta a buscar foto nos destinos com URL repetida
 *   TRAVEL_IMAGES_REFRESH=dedupe      — só duplicados; força URL não usada noutro destino
 *   TRAVEL_IMAGES_REFRESH=all         — re-enriquece todos os que já têm foto
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDestinationImageQuery,
  buildDestinationImageQueryFallbacks,
  isGenericPlaceholderImage,
  sleep,
} from './lib/unsplash-client.mjs';
import {
  createImageServicesFromEnv,
  fetchHeroPhotoUrl,
  imageUrlKey,
} from './lib/image-providers.mjs';
import { loadProjectEnv } from './lib/load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const CACHE_PATH = resolve(ROOT, 'src/data/travel-mock/unsplash-cache.json');

loadProjectEnv(ROOT);

const HAS_PIXABAY = Boolean(process.env.PIXABAY_API_KEY?.trim());
const HAS_PEXELS = Boolean(process.env.PEXELS_API_KEY?.trim());
const HAS_UNSPLASH = Boolean(process.env.UNSPLASH_ACCESS_KEY?.trim());

/** Máx. destinos por execução */
const LIMIT = parseInt(
  process.env.UNSPLASH_ENRICH_LIMIT ??
    (HAS_PIXABAY ? '250' : HAS_PEXELS ? '120' : '40'),
  10,
);
/** Orçamento de pedidos HTTP às APIs de pesquisa (não inclui download Pixabay). */
const MAX_API_CALLS = parseInt(
  process.env.UNSPLASH_MAX_API_CALLS ??
    (HAS_PIXABAY ? '300' : HAS_PEXELS ? '200' : '45'),
  10,
);
const DELAY_MS = parseInt(
  process.env.UNSPLASH_DELAY_MS ?? (HAS_PIXABAY ? '400' : HAS_PEXELS ? '900' : '2500'),
  10,
);
const WIDTH = parseInt(process.env.UNSPLASH_IMAGE_WIDTH ?? '1400', 10);
const ONLY_IATA = process.env.UNSPLASH_ONLY_IATA === '1';
const SAVE_EVERY = parseInt(process.env.UNSPLASH_SAVE_EVERY ?? '10', 10);
const REFRESH_MODE = process.env.TRAVEL_IMAGES_REFRESH?.trim().toLowerCase() ?? '';
const REFRESH_DUPLICATES =
  REFRESH_MODE === 'duplicates' || REFRESH_MODE === 'duplicate' || REFRESH_MODE === '1';
const REFRESH_ALL = REFRESH_MODE === 'all';

/** @param {typeof bundle.destinos} destinos */
function buildUrlUsage(destinos) {
  /** @type {Map<string, unknown[]>} */
  const byUrl = new Map();
  for (const d of destinos) {
    if (isGenericPlaceholderImage(d.imagem_url)) continue;
    const u = d.imagem_url;
    if (!byUrl.has(u)) byUrl.set(u, []);
    byUrl.get(u).push(d);
  }
  return byUrl;
}

function isDuplicateImage(dest, urlUsage) {
  const list = urlUsage.get(dest.imagem_url);
  return Boolean(list && list.length > 1);
}

function shouldRefreshDest(dest, urlUsage) {
  if (REFRESH_ALL && !isGenericPlaceholderImage(dest.imagem_url)) return true;
  if (REFRESH_DUPLICATES && isDuplicateImage(dest, urlUsage)) return true;
  return false;
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

function cacheLookup(cache, dest) {
  const idKey = destCacheKey(dest);
  if (cache[idKey]) return { url: cache[idKey], key: idKey };
  return null;
}

/** URLs já usadas por outros destinos — evita repetir a mesma foto. */
function buildForbiddenUrls(dest, destinos) {
  /** @type {Set<string>} */
  const forbidden = new Set();
  const lang = dest.lang ?? 'pt';
  for (const d of destinos) {
    if (d.id === dest.id && (d.lang ?? 'pt') === lang) continue;
    if (!isGenericPlaceholderImage(d.imagem_url)) forbidden.add(d.imagem_url);
  }
  return forbidden;
}

/** Destinos que partilham URL (exceto o primeiro de cada grupo — mantém-se). */
function listDuplicateDestsToFix(destinos) {
  const byUrl = buildUrlUsage(destinos);
  /** @type {typeof destinos} */
  const out = [];
  for (const list of byUrl.values()) {
    if (list.length < 2) continue;
    for (let i = 1; i < list.length; i++) out.push(list[i]);
  }
  return out;
}

/** @param {Set<string>} forbidden @param {string} url */
function urlIsForbidden(forbidden, url) {
  if (!url || forbidden.has(url)) return true;
  const key = imageUrlKey(url);
  for (const f of forbidden) {
    if (imageUrlKey(f) === key) return true;
  }
  return false;
}

/** @param {Awaited<ReturnType<createImageServicesFromEnv>>} imageService */
async function fetchPhotoUrl(imageService, dest, query, apiBudget, forbiddenUrls) {
  const aggressive = forbiddenUrls.size > 0;
  const queries = [
    query,
    ...buildDestinationImageQueryFallbacks(dest).filter((q) => q !== query),
  ];
  if (aggressive) {
    queries.push(`${query} ${dest.id}`, `${dest.nome} photo ${dest.id}`);
  }

  for (const q of queries) {
    if (apiBudget.remaining <= 0) return { url: null, stopped: 'budget', provider: null };

    const { url, provider, apiCalls } = await fetchHeroPhotoUrl(imageService, q, {
      width: WIDTH,
      destId: dest.id,
      destLang: dest.lang ?? 'pt',
      forbiddenUrls,
      aggressive,
    });
    apiBudget.remaining -= apiCalls;

    if (url) return { url, stopped: null, provider };

    await sleep(aggressive ? 150 : 250);
  }

  return { url: null, stopped: null, provider: null };
}

async function main() {
  const imageService = createImageServicesFromEnv();

  if (!imageService) {
    console.error(
      'Define pelo menos uma chave no .env.local:\n' +
        '  PIXABAY_API_KEY — https://pixabay.com/api/docs/ (recomendado para volume)\n' +
        '  PEXELS_API_KEY — https://www.pexels.com/api/\n' +
        '  UNSPLASH_ACCESS_KEY — https://unsplash.com/oauth/applications',
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
  const urlUsage = buildUrlUsage(destinos);
  const duplicateDestCount = destinos.filter((d) => isDuplicateImage(d, urlUsage)).length;

  const DEDUPE_ONLY = REFRESH_MODE === 'dedupe' || REFRESH_MODE === 'unique';
  const duplicateFixList = listDuplicateDestsToFix(destinos);

  const candidates = DEDUPE_ONLY
    ? duplicateFixList.filter((d) => !ONLY_IATA || d.iata)
    : destinos.filter((d) => {
        if (ONLY_IATA && !d.iata) return false;
        if (isGenericPlaceholderImage(d.imagem_url)) return true;
        if (shouldRefreshDest(d, urlUsage)) return true;
        return false;
      });

  const alreadyDone = destinos.length - candidates.length;
  const toProcess = candidates.slice(0, LIMIT);

  const providers = [
    HAS_PIXABAY ? 'Pixabay (local cache)' : null,
    HAS_PEXELS ? 'Pexels' : null,
    HAS_UNSPLASH ? 'Unsplash' : null,
  ]
    .filter(Boolean)
    .join(' → ');

  const refreshLabel = DEDUPE_ONLY
    ? `dedupe (${duplicateFixList.length} destinos, URL única forçada)`
    : REFRESH_ALL
      ? 'all'
      : REFRESH_DUPLICATES
        ? `duplicates (${duplicateDestCount} destinos com URL partilhada)`
        : 'off';

  console.log(
    `Travel images enrich — ${toProcess.length} destinos nesta execução (${candidates.length} por fazer, ${alreadyDone} já com foto).\n` +
      `  APIs: ${providers || '(n/a)'}\n` +
      `  limit=${LIMIT}  max_http=${MAX_API_CALLS}  delay=${DELAY_MS}ms  refresh=${refreshLabel}\n`,
  );

  let updated = 0;
  let fromCache = 0;
  let refreshed = 0;
  let failed = 0;
  let pexelsHits = 0;
  let pixabayHits = 0;
  let unsplashHits = 0;
  const apiBudget = { remaining: MAX_API_CALLS };

  for (const dest of toProcess) {
    const query = buildDestinationImageQuery(dest);
    const refreshing = shouldRefreshDest(dest, urlUsage);
    const needsUniqueUrl =
      refreshing ||
      DEDUPE_ONLY ||
      (REFRESH_DUPLICATES && isDuplicateImage(dest, urlUsage));
    if (needsUniqueUrl) delete cache[destCacheKey(dest)];

    const forbiddenUrls = needsUniqueUrl ? buildForbiddenUrls(dest, destinos) : new Set();

    const cachedEntry = cacheLookup(cache, dest);
    if (cachedEntry && !needsUniqueUrl && !urlIsForbidden(forbiddenUrls, cachedEntry.url)) {
      dest.imagem_url = cachedEntry.url;
      dest.imagem_query = query;
      cache[cachedEntry.key] = cachedEntry.url;
      fromCache += 1;
      updated += 1;
      continue;
    }

    try {
      const { url, stopped, provider } = await fetchPhotoUrl(
        imageService,
        dest,
        query,
        apiBudget,
        forbiddenUrls,
      );

      if (stopped === 'budget') {
        console.log(
          `\nOrçamento HTTP atingido (${MAX_API_CALLS}/execução). Progresso guardado.`,
        );
        persist(bundle, cache);
        printResumeHint(candidates.length, toProcess.length);
        process.exit(0);
      }

      if (url) {
        dest.imagem_url = url;
        dest.imagem_query = query;
        cache[destCacheKey(dest)] = url;
        if (provider === 'pexels') pexelsHits += 1;
        if (provider === 'pixabay') pixabayHits += 1;
        if (provider === 'unsplash') unsplashHits += 1;
        updated += 1;
        if (needsUniqueUrl) refreshed += 1;
        const tag = DEDUPE_ONLY ? 'dedupe' : needsUniqueUrl ? 'refresh' : provider;
        process.stdout.write(`  ✓ ${dest.nome} (${tag})\n`);
        if (updated % SAVE_EVERY === 0) persist(bundle, cache);
      } else {
        failed += 1;
        process.stdout.write(`  – ${dest.nome} (sem resultado)\n`);
      }
    } catch (e) {
      persist(bundle, cache);
      console.error(`\nErro: ${e.message}`);
      process.exit(1);
    }

    await sleep(DELAY_MS);
  }

  persist(bundle, cache);

  console.log(
    `\nConcluído. Atualizados: ${updated} (${fromCache} cache, ${refreshed} refresh), sem foto: ${failed}`,
  );
  console.log(
    `  Por API: Pixabay ${pixabayHits} | Pexels ${pexelsHits} | Unsplash ${unsplashHits}`,
  );
  console.log(`Cache URLs: ${CACHE_PATH}`);
  if (candidates.length > toProcess.length) {
    console.log(`\nFaltam ~${candidates.length - toProcess.length} destinos. Corre de novo:`);
    console.log('  npm run travel:images:enrich');
  }
  console.log('\nReinicia o Next.js dev server para ver as imagens nos resultados.');
}

function printResumeHint(candidatesCount, batchSize) {
  console.log(
    `\nPara continuar:\n` +
      `  npm run travel:images:enrich\n` +
      `Corrigir fotos repetidas (URL única):\n` +
      `  npm run travel:images:dedupe\n` +
      `  $env:TRAVEL_IMAGES_REFRESH=duplicates; npm run travel:images:enrich\n` +
      `Só IATA:\n` +
      `  $env:UNSPLASH_ONLY_IATA=1; npm run travel:images:enrich`,
  );
  console.log(`Restam ~${Math.max(0, candidatesCount - batchSize)} destinos placeholder neste bundle.`);
}

main();
