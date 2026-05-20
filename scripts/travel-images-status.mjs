/**
 * Mostra progresso das imagens no bundle Wikivoyage (ou faker).
 *
 *   npm run travel:images:status
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { countCachedImageFiles } from './lib/image-cache.mjs';
import { isGenericPlaceholderImage } from './lib/unsplash-client.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE_WV = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const BUNDLE_FAKER = resolve(ROOT, 'src/data/travel-mock/bundle.json');
const CACHE_PATH = resolve(ROOT, 'src/data/travel-mock/unsplash-cache.json');

function loadCacheKeys() {
  if (!existsSync(CACHE_PATH)) return 0;
  try {
    return Object.keys(JSON.parse(readFileSync(CACHE_PATH, 'utf8'))).length;
  } catch {
    return 0;
  }
}

function countLocalInBundle(destinos) {
  return destinos.filter((d) => d.imagem_url?.startsWith('/travel-images/')).length;
}

function main() {
  const path = existsSync(BUNDLE_WV) ? BUNDLE_WV : BUNDLE_FAKER;
  if (!existsSync(path)) {
    console.error('Nenhum bundle encontrado. Gera com: npm run travel:demo:build');
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(path, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const total = destinos.length;
  const generic = destinos.filter((d) => isGenericPlaceholderImage(d.imagem_url)).length;
  const real = total - generic;
  const localPaths = countLocalInBundle(destinos);
  const cachedFiles = countCachedImageFiles();
  const pct = total ? ((100 * real) / total).toFixed(1) : '0';

  console.log(`Bundle: ${path.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
  console.log(`✅ Destinos com imagem real: ${real}`);
  console.log(`⏳ Ainda placeholder: ${generic}`);
  console.log(`📊 Total: ${total} (~${pct}% com foto)`);
  console.log(`📁 URLs locais (/travel-images/): ${localPaths} no bundle`);
  console.log(`🗂️  Ficheiros em public/travel-images/: ${cachedFiles}`);
  console.log(`🗃️  Cache URL (unsplash-cache.json): ${loadCacheKeys()} entradas`);
}

main();
