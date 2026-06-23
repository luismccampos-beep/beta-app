/**
 * Enriquece destinos sem imagem usando a API Wikimedia Commons.
 *
 * - 100% gratuito, sem API key
 * - Imagens com licença CC-BY, CC-BY-SA ou domínio público
 * - Atribui automaticamente o autor e licença (obrigatório CC-BY)
 * - Retoma onde parou (destinos com imagem são ignorados)
 *
 * Estratégias de pesquisa (por ordem):
 *   1. Wikipedia página do destino → imagem principal (pageimage)
 *   2. Wikimedia Commons search: "Destination Country"
 *   3. Wikimedia Commons search: "Destination" só
 *
 * Uso:
 *   node scripts/enrich-images-wikimedia.mjs
 *   node scripts/enrich-images-wikimedia.mjs --dry-run --limit 20
 *   node scripts/enrich-images-wikimedia.mjs --limit 500
 *   node scripts/enrich-images-wikimedia.mjs --country PT
 *   node scripts/enrich-images-wikimedia.mjs --status
 *   node scripts/enrich-images-wikimedia.mjs --lang pt   (só destinos PT)
 *
 * Rate limit: ~1 req/seg por cortesia (Wikimedia permite mais mas evitar abusos)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const ATTR_CACHE = resolve(ROOT, 'src/data/travel-mock/wikimedia-attribution-cache.json');
const USER_AGENT = 'beta-app-travel/1.0 (https://github.com/akmleva; contact: admin@akmleva.com)';

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const dryRun     = args.includes('--dry-run');
const statusOnly = args.includes('--status');

/** Extrai valor de --flag=value ou --flag value. Retorna '' se ausente. */
function argValue(flag) {
  const eq = args.find(a => a.startsWith(`${flag}=`));
  if (eq) return eq.split('=')[1];
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return '';
}

const limit      = parseInt(argValue('--limit')) || 0;
const country    = argValue('--country').toUpperCase();
const langFilter = argValue('--lang').toLowerCase();
const saveEvery  = 10;
const delay      = 1100; // ms between requests

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isPlaceholder(url) {
  if (!url) return true;
  if (url.includes('photo-146985')) return true;
  if (url.includes('placeholder')) return true;
  return false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function loadAttrCache() {
  if (!existsSync(ATTR_CACHE)) return {};
  try { return JSON.parse(readFileSync(ATTR_CACHE, 'utf8')); } catch { return {}; }
}

function saveAttrCache(c) { writeFileSync(ATTR_CACHE, JSON.stringify(c, null, 2)); }

// ---------------------------------------------------------------------------
// Wikimedia Commons API
// ---------------------------------------------------------------------------

/**
 * Get the main image from a Wikipedia article (pageimage).
 * Uses the Wikipedia API for the language of the destination.
 */
async function getWikipediaPageImage(destName, lang = 'pt') {
  const wikiLang = lang === 'pt' ? 'pt' : 'en';
  const url = new URL(`https://${wikiLang}.wikipedia.org/w/api.php`);
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', destName);
  url.searchParams.set('prop', 'pageimages|pageterms');
  url.searchParams.set('piprop', 'original');
  url.searchParams.set('format', 'json');
  url.searchParams.set('redirects', '1');
  url.searchParams.set('origin', '*');

  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data?.query?.pages ?? {});
    const page = pages[0];
    if (!page || page.missing !== undefined) return null;
    const imgUrl = page?.original?.source;
    if (!imgUrl) return null;

    // Filter out icons, flags, maps, coats of arms
    const skip = /flag|coat|arms|emblem|seal|logo|icon|map|locator|outline|blank|silhouette|shield/i;
    if (skip.test(imgUrl)) return null;

    return {
      url: imgUrl,
      source: 'wikipedia',
      license: 'see-wikipedia',
      attribution: `Wikipedia — ${destName}`,
      page_url: `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(destName)}`,
    };
  } catch { return null; }
}

/**
 * Search Wikimedia Commons for a destination image.
 * Returns a CC-licensed image URL.
 */
async function searchWikimediaCommons(query) {
  // Step 1: search for files
  const searchUrl = new URL('https://commons.wikimedia.org/w/api.php');
  searchUrl.searchParams.set('action', 'query');
  searchUrl.searchParams.set('list', 'search');
  searchUrl.searchParams.set('srsearch', `${query} filetype:bitmap`);
  searchUrl.searchParams.set('srnamespace', '6'); // File namespace
  searchUrl.searchParams.set('srlimit', '5');
  searchUrl.searchParams.set('format', 'json');
  searchUrl.searchParams.set('origin', '*');

  try {
    const res = await fetch(searchUrl.toString(), {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.query?.search ?? [];
    if (!results.length) return null;

    // Skip flags, coats, maps
    const skip = /flag|coat|arms|emblem|seal|logo|icon|map|locator|outline|blank|silhouette|shield/i;

    for (const r of results) {
      if (skip.test(r.title)) continue;

      // Step 2: get image info for this file
      const infoUrl = new URL('https://commons.wikimedia.org/w/api.php');
      infoUrl.searchParams.set('action', 'query');
      infoUrl.searchParams.set('titles', r.title);
      infoUrl.searchParams.set('prop', 'imageinfo');
      infoUrl.searchParams.set('iiprop', 'url|extmetadata');
      infoUrl.searchParams.set('iiurlwidth', '1200');
      infoUrl.searchParams.set('format', 'json');
      infoUrl.searchParams.set('origin', '*');

      await sleep(300); // small delay between info requests

      const infoRes = await fetch(infoUrl.toString(), {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(8000),
      });
      if (!infoRes.ok) continue;
      const infoData = await infoRes.json();
      const pages = Object.values(infoData?.query?.pages ?? {});
      const filePage = pages[0];
      const info = filePage?.imageinfo?.[0];
      if (!info?.url) continue;

      // Check license
      const meta = info.extmetadata ?? {};
      const license = meta?.LicenseShortName?.value ?? '';
      const licenseUrl = meta?.LicenseUrl?.value ?? '';
      const author = meta?.Artist?.value?.replace(/<[^>]+>/g, '').trim() ?? 'Wikimedia Commons';
      const description = meta?.ImageDescription?.value?.replace(/<[^>]+>/g, '').trim() ?? '';

      // Only accept free licenses
      const freeLicenses = /CC-BY|CC BY|CC0|Public Domain|PD-|pd-/i;
      if (!freeLicenses.test(license) && !freeLicenses.test(licenseUrl)) continue;

      // Prefer thumbnail URL (smaller, faster to load)
      const imgUrl = info.thumburl || info.url;
      if (skip.test(imgUrl)) continue;

      return {
        url: imgUrl,
        source: 'wikimedia-commons',
        license,
        license_url: licenseUrl,
        attribution: author,
        description,
        page_url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(r.title)}`,
      };
    }
    return null;
  } catch { return null; }
}

/**
 * Full geocoding strategy for a destination image.
 */
async function findImage(dest) {
  const nome = dest.nome ?? '';
  const pais = dest.pais ?? '';
  const lang = dest.lang ?? 'pt';

  // Strategy 1: Wikipedia pageimage (fastest, highest quality)
  const wp = await getWikipediaPageImage(nome, lang);
  if (wp) return { ...wp, strategy: 'wikipedia-pageimage' };

  await sleep(400);

  // Strategy 2: Commons search "Destination Country"
  const c1 = await searchWikimediaCommons(`${nome} ${pais}`);
  if (c1) return { ...c1, strategy: 'commons-nome-pais' };

  await sleep(400);

  // Strategy 3: Commons search "Destination" only
  const c2 = await searchWikimediaCommons(nome);
  if (c2) return { ...c2, strategy: 'commons-nome' };

  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
if (!existsSync(BUNDLE)) { console.error('Bundle not found. Run: npm run travel:demo:build'); process.exit(1); }

const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
const attrCache = loadAttrCache();
const destinos = bundle.destinos ?? [];

// Status
if (statusOnly) {
  const withImg = destinos.filter(d => !isPlaceholder(d.imagem_url)).length;
  const withWm  = destinos.filter(d => d.imagem_fonte === 'wikimedia-commons' || d.imagem_fonte === 'wikipedia').length;
  console.log(`\n=== Image status ===`);
  console.log(`  Total destinos     : ${destinos.length}`);
  console.log(`  Com imagem         : ${withImg} (${(withImg/destinos.length*100).toFixed(1)}%)`);
  console.log(`  Via Wikimedia      : ${withWm}`);
  console.log(`  Sem imagem         : ${destinos.length - withImg}`);
  console.log(`  Attribution cache  : ${Object.keys(attrCache).length} entries`);
  process.exit(0);
}

// Filter destinations that need images
let candidates = destinos.filter(d => isPlaceholder(d.imagem_url));
if (country)    candidates = candidates.filter(d => (d.paisCode ?? d.pais_code ?? '').toUpperCase() === country);
if (langFilter) candidates = candidates.filter(d => (d.lang ?? 'pt') === langFilter);
if (limit)      candidates = candidates.slice(0, limit);

const total = candidates.length;
console.log(`\n=== Wikimedia image enrichment ===`);
console.log(`  dry-run=${dryRun}  limit=${limit || 'ALL'}  country=${country || 'ALL'}  lang=${langFilter || 'ALL'}`);
console.log(`  Destinations to process: ${total}`);
console.log(`  Source: Wikipedia pageimage → Wikimedia Commons (CC-licensed)`);
console.log();

if (total === 0) {
  console.log('Nothing to do — all destinations already have images.');
  console.log('Run --status to check.');
  process.exit(0);
}

let found = 0;
let notFound = 0;

for (let i = 0; i < candidates.length; i++) {
  const dest = candidates[i];

  // Check attribution cache first (avoids repeat API calls on re-runs)
  const cacheKey = `${dest.lang ?? 'pt'}:${dest.id}`;
  if (attrCache[cacheKey]) {
    const cached = attrCache[cacheKey];
    dest.imagem_url = cached.url;
    dest.imagem_fonte = cached.source;
    dest.imagem_licenca = cached.license;
    dest.imagem_atribuicao = cached.attribution;
    found++;
    process.stdout.write(`\r[${i+1}/${total}] ✓ (cache) ${dest.nome.slice(0,40).padEnd(40)}`);
    continue;
  }

  const result = await findImage(dest);

  if (result) {
    dest.imagem_url = result.url;
    dest.imagem_fonte = result.source;
    dest.imagem_licenca = result.license;
    dest.imagem_atribuicao = result.attribution;
    dest.imagem_page_url = result.page_url;

    // Save to attribution cache
    if (!dryRun) {
      attrCache[cacheKey] = {
        url: result.url,
        source: result.source,
        license: result.license,
        attribution: result.attribution,
        page_url: result.page_url,
        strategy: result.strategy,
      };
    }

    found++;
    process.stdout.write(`\r[${i+1}/${total}] ✓ ${dest.nome.slice(0,30).padEnd(30)} [${result.strategy}]          \n`);
  } else {
    notFound++;
    process.stdout.write(`\r[${i+1}/${total}] ✗ ${dest.nome.slice(0,40).padEnd(40)}`);
  }

  // Save progress every N
  if (!dryRun && (i + 1) % saveEvery === 0) {
    bundle.meta = bundle.meta ?? {};
    bundle.meta.wikimediaImageEnrich = { at: new Date().toISOString(), found, notFound };
    writeFileSync(BUNDLE, JSON.stringify(bundle));
    saveAttrCache(attrCache);
  }

  await sleep(delay);
}

console.log(); // newline

// Final save
if (!dryRun && found > 0) {
  bundle.meta = bundle.meta ?? {};
  bundle.meta.wikimediaImageEnrich = { at: new Date().toISOString(), found, notFound };
  writeFileSync(BUNDLE, JSON.stringify(bundle));
  saveAttrCache(attrCache);
  console.log(`\n✅ Bundle updated`);
}

console.log(`\n=== Done ===`);
console.log(`  Found     : ${found}`);
console.log(`  Not found : ${notFound}`);
if (dryRun) console.log('  (dry-run — nothing written)');
else if (notFound > 0) {
  console.log(`\n  Re-run to continue with remaining ${notFound} destinations.`);
}
