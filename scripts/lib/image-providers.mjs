/**
 * Multi-provider image search (Pexels → Pixabay → Unsplash) via `images-map`.
 *
 * Pixabay: images are downloaded to public/travel-images/ (no permanent hotlinking).
 */
import ImageServicesPkg from 'images-map';

import { cacheFileName, downloadAndCacheImage } from './image-cache.mjs';

const ImageServices = ImageServicesPkg?.default ?? ImageServicesPkg;

/** Stable 0..n-1 from dest id or query (varies photo per destination). */
function pickVariantIndex(seed, n) {
  const s = String(seed ?? '0');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % Math.max(1, n);
}

/** @param {string} rawUrl */
export function imageUrlKey(rawUrl) {
  if (!rawUrl) return '';
  if (rawUrl.startsWith('/travel-images/')) return rawUrl;
  const m = rawUrl.match(/pexels\.com\/photos\/(\d+)/);
  if (m) return `pexels:${m[1]}`;
  try {
    const u = new URL(rawUrl);
    u.search = '';
    return u.toString();
  } catch {
    return rawUrl;
  }
}

/** @returns {InstanceType<typeof ImageServices> | null} */
export function createImageServicesFromEnv() {
  const unsplash = process.env.UNSPLASH_ACCESS_KEY?.trim();
  const pexels = process.env.PEXELS_API_KEY?.trim();
  const pixabay = process.env.PIXABAY_API_KEY?.trim();

  /** @type {Record<string, string>} */
  const services = {};
  if (unsplash) services.unsplash = unsplash;
  if (pexels) services.pexels = pexels;
  if (pixabay) services.pixabay = pixabay;

  if (Object.keys(services).length === 0) {
    return null;
  }
  return new ImageServices(services);
}

/**
 * @param {string} rawUrl
 * @param {number} width
 */
export function normalizeHeroImageUrl(rawUrl, width = 1400) {
  if (!rawUrl) return null;
  if (rawUrl.startsWith('/travel-images/')) return rawUrl;
  try {
    const u = new URL(rawUrl);
    u.searchParams.set('auto', 'format');
    u.searchParams.set('fit', 'crop');
    u.searchParams.set('w', String(width));
    u.searchParams.set('q', '80');
    return u.toString();
  } catch {
    return rawUrl;
  }
}

/**
 * @param {Set<string>} forbidden
 * @param {string} url
 */
function isForbiddenUrl(forbidden, url) {
  if (!url) return true;
  if (forbidden.has(url)) return true;
  const key = imageUrlKey(url);
  for (const f of forbidden) {
    if (imageUrlKey(f) === key) return true;
  }
  return false;
}

/**
 * @param {Array<{ url?: string }>} images
 * @param {number} startIdx
 */
function rotatedImages(images, startIdx) {
  if (!images?.length) return [];
  const out = [];
  for (let i = 0; i < images.length; i++) {
    out.push(images[(startIdx + i) % images.length]);
  }
  return out;
}

/**
 * @param {InstanceType<typeof ImageServices>} imageService
 * @param {string} query
 * @param {{ width?: number; destId?: number; destLang?: string; forbiddenUrls?: Set<string>; aggressive?: boolean }} [opts]
 * @returns {Promise<{ url: string | null; provider: 'pexels' | 'pixabay' | 'unsplash' | null; apiCalls: number }>}
 */
export async function fetchHeroPhotoUrl(imageService, query, opts = {}) {
  const width = opts.width ?? 1400;
  const queryText = query.trim();
  const seed = opts.destId ?? queryText;
  const forbidden = opts.forbiddenUrls ?? new Set();
  const aggressive = opts.aggressive ?? forbidden.size > 0;
  const perPage = aggressive ? 10 : 5;
  const maxPages = aggressive ? 8 : 2;
  const pickIdx = pickVariantIndex(seed, perPage);
  const basePage = 1 + pickVariantIndex(`${seed}:${queryText}`, aggressive ? 12 : 8);
  let apiCalls = 0;

  for (let pageOff = 0; pageOff < maxPages; pageOff++) {
    const page = basePage + pageOff;
    const params = { query: queryText, per_page: perPage, page };
    const pixabayParams = { query: queryText, per_page: Math.max(3, perPage), page };

    if (imageService.services?.pexels) {
      apiCalls += 1;
      try {
        const pex = await imageService.getSpecificServiceData(params, 'pexels');
        for (const img of rotatedImages(pex.images, pickIdx)) {
          if (!img?.url || pex.error) continue;
          const url = normalizeHeroImageUrl(img.url, width);
          if (url && !isForbiddenUrl(forbidden, url)) {
            return { url, provider: 'pexels', apiCalls };
          }
        }
      } catch {
        /* rede */
      }
    }

    if (imageService.services?.pixabay) {
      apiCalls += 1;
      try {
        const pix = await imageService.getSpecificServiceData(pixabayParams, 'pixabay');
        for (const img of rotatedImages(pix.images, pickIdx)) {
          if (!img?.url || pix.error) continue;
          const fileName = cacheFileName(opts.destId ?? query.slice(0, 24), opts.destLang, 'pixabay');
          const localUrl = await downloadAndCacheImage(img.url, fileName);
          if (localUrl && !isForbiddenUrl(forbidden, localUrl)) {
            return { url: localUrl, provider: 'pixabay', apiCalls };
          }
        }
      } catch {
        /* rede */
      }
    }

    if (imageService.services?.unsplash) {
      apiCalls += 1;
      try {
        const uns = await imageService.getSpecificServiceData(params, 'unsplash');
        for (const img of rotatedImages(uns.images, pickIdx)) {
          if (!img?.url || uns.error) continue;
          const url = normalizeHeroImageUrl(img.url, width);
          if (url && !isForbiddenUrl(forbidden, url)) {
            return { url, provider: 'unsplash', apiCalls };
          }
        }
      } catch {
        /* rede */
      }
    }
  }

  return { url: null, provider: null, apiCalls };
}
