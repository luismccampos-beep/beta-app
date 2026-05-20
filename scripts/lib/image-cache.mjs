/**
 * Local image cache for providers that disallow permanent hotlinking (Pixabay).
 * Files are stored under public/travel-images/ and served as /travel-images/{file}.
 */
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_IMAGE_CACHE_DIR = resolve(__dirname, '../../public/travel-images');

/**
 * @param {number | string} destId
 * @param {string} [lang]
 * @param {'pixabay' | 'pexels' | 'unsplash'} provider
 */
export function cacheFileName(destId, lang, provider) {
  const safeLang = String(lang ?? 'pt').replace(/[^a-z0-9]/gi, '');
  return `dest-${safeLang}-${destId}-${provider}.jpg`;
}

/**
 * Download remote image and save locally. Returns public URL path.
 *
 * @param {string} remoteUrl
 * @param {string} fileName
 * @param {string} [cacheDir]
 * @returns {Promise<string | null>}
 */
export async function downloadAndCacheImage(remoteUrl, fileName, cacheDir = DEFAULT_IMAGE_CACHE_DIR) {
  if (!remoteUrl?.trim()) return null;

  mkdirSync(cacheDir, { recursive: true });
  const destPath = resolve(cacheDir, fileName);
  const publicPath = `/travel-images/${fileName}`;

  if (existsSync(destPath)) {
    return publicPath;
  }

  try {
    const res = await fetch(remoteUrl, { redirect: 'follow' });
    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) return null;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) return null;

    writeFileSync(destPath, buf);
    return publicPath;
  } catch {
    return null;
  }
}

/** Count cached image files in public/travel-images. */
export function countCachedImageFiles(cacheDir = DEFAULT_IMAGE_CACHE_DIR) {
  if (!existsSync(cacheDir)) return 0;
  try {
    return readdirSync(cacheDir).filter((f) => /\.(jpe?g|webp|png)$/i.test(f)).length;
  } catch {
    return 0;
  }
}
