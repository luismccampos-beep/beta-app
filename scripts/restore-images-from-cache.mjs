/**
 * Restaura imagens no bundle a partir do cache existente (unsplash-cache.json).
 *
 * O bundle foi reconstruído e perdeu as referências de imagem, mas o cache
 * de 30k entradas ainda existe. Este script re-liga cache → bundle por:
 *   1. imagem_query normalizada (chave principal do cache antigo)
 *   2. "d:{lang}:{id}" (chave nova do cache)
 *   3. Nome do destino fuzzy
 *
 * Uso:
 *   node scripts/restore-images-from-cache.mjs
 *   node scripts/restore-images-from-cache.mjs --dry-run
 *   node scripts/restore-images-from-cache.mjs --status
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const CACHE = resolve(ROOT, 'src/data/travel-mock/unsplash-cache.json');

const dryRun = process.argv.includes('--dry-run');
const statusOnly = process.argv.includes('--status');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function normalize(s) {
  return String(s ?? '')
    .normalize('NFD').replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractUrl(val) {
  if (!val) return null;
  if (typeof val === 'string') return val.startsWith('http') ? val : null;
  if (typeof val === 'object' && val.url) return val.url;
  return null;
}

function isPlaceholder(url) {
  if (!url) return true;
  // The generic placeholder all destinos got after bundle rebuild
  if (url.includes('photo-146985')) return true;
  if (url.includes('placeholder')) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
if (!existsSync(BUNDLE)) { console.error('Bundle not found:', BUNDLE); process.exit(1); }
if (!existsSync(CACHE))  { console.error('Cache not found:', CACHE);  process.exit(1); }

const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
const cache  = JSON.parse(readFileSync(CACHE, 'utf8'));
const destinos = bundle.destinos ?? [];

// Status only
if (statusOnly) {
  const withReal = destinos.filter(d => !isPlaceholder(d.imagem_url)).length;
  console.log(`Bundle destinos : ${destinos.length}`);
  console.log(`Com imagem real : ${withReal}`);
  console.log(`Placeholder     : ${destinos.length - withReal}`);
  console.log(`Cache entries   : ${Object.keys(cache).length}`);
  process.exit(0);
}

// Build lookup maps from cache
// Cache keys can be:
//   "d:{lang}:{id}"  (new format)
//   "palavra1 palavra2 ... travel" (old format — the imagem_query value)
const byIdKey = new Map();   // "d:pt:123" -> url
const byQuery = new Map();   // normalized query -> url

for (const [key, val] of Object.entries(cache)) {
  const url = extractUrl(val);
  if (!url || isPlaceholder(url)) continue;

  if (key.startsWith('d:')) {
    byIdKey.set(key, url);
  } else {
    byQuery.set(normalize(key), url);
  }
}

console.log(`Cache loaded: ${byIdKey.size} id-keys, ${byQuery.size} query-keys`);

let restored = 0;
let alreadyOk = 0;
let notFound = 0;

for (const dest of destinos) {
  if (!isPlaceholder(dest.imagem_url)) {
    alreadyOk++;
    continue;
  }

  const lang = dest.lang ?? 'pt';

  // Strategy 1: new id-based key
  const idKey = `d:${lang}:${dest.id}`;
  let url = byIdKey.get(idKey);

  // Strategy 2: imagem_query key (old format)
  if (!url && dest.imagem_query) {
    url = byQuery.get(normalize(dest.imagem_query));
  }

  // Strategy 3: build common query patterns and look them up
  if (!url && dest.nome) {
    const nome = normalize(dest.nome);
    const pais = normalize(dest.pais ?? '');

    // Try various query patterns used by the old enrich script
    const patterns = [
      `${nome} ${pais} travel`,
      `${nome} ${pais} city travel`,
      `${nome} ${pais} beach travel`,
      `${nome} travel`,
      `${nome} ${pais}`,
    ];

    for (const pattern of patterns) {
      url = byQuery.get(normalize(pattern));
      if (url) break;
    }
  }

  if (url) {
    dest.imagem_url = url;
    if (!dest.imagem_query && dest.nome) {
      dest.imagem_query = `${dest.nome},${dest.pais ?? ''},travel`;
    }
    restored++;
  } else {
    notFound++;
  }
}

console.log(`\n=== Restore complete ===`);
console.log(`  Already had image : ${alreadyOk}`);
console.log(`  Restored          : ${restored}`);
console.log(`  Still no image    : ${notFound}`);
console.log(`  Total             : ${destinos.length}`);

if (!dryRun && restored > 0) {
  bundle.meta = bundle.meta ?? {};
  bundle.meta.imageCacheRestore = { at: new Date().toISOString(), restored, notFound };
  writeFileSync(BUNDLE, JSON.stringify(bundle));
  console.log(`\n✅ Bundle updated: ${BUNDLE}`);
  console.log(`   Run 'npm run travel:images:status' to verify.`);
} else if (dryRun) {
  console.log(`\n(dry-run — bundle not written)`);
}

if (notFound > 0) {
  console.log(`\n${notFound} destinos still without image.`);
  console.log(`  Run next: node scripts/enrich-images-wikimedia.mjs`);
}
