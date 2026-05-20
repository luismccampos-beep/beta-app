/**
 * Multi-provider image search (Pexels → Pixabay → Unsplash) via `images-map`.
 *
 * Pixabay: images are downloaded to public/travel-images/ (no permanent hotlinking).
 */
import ImageServicesPkg from 'images-map';

import { cacheFileName, downloadAndCacheImage } from './image-cache.mjs';

const ImageServices = ImageServicesPkg?.default ?? ImageServicesPkg;

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
 * @param {InstanceType<typeof ImageServices>} imageService
 * @param {string} query
 * @param {{ width?: number; destId?: number; destLang?: string }} [opts]
 * @returns {Promise<{ url: string | null; provider: 'pexels' | 'pixabay' | 'unsplash' | null; apiCalls: number }>}
 */
export async function fetchHeroPhotoUrl(imageService, query, opts = {}) {
  const width = opts.width ?? 1400;
  const params = { query: query.trim(), per_page: 1 };
  let apiCalls = 0;

  if (imageService.services?.pexels) {
    apiCalls += 1;
    try {
      const pex = await imageService.getSpecificServiceData(params, 'pexels');
      if (!pex.error && Array.isArray(pex.images) && pex.images[0]?.url) {
        const url = normalizeHeroImageUrl(pex.images[0].url, width);
        if (url) return { url, provider: 'pexels', apiCalls };
      }
    } catch {
      /* rede */
    }
  }

  if (imageService.services?.pixabay) {
    apiCalls += 1;
    try {
      const pix = await imageService.getSpecificServiceData(params, 'pixabay');
      if (!pix.error && Array.isArray(pix.images) && pix.images[0]?.url) {
        const remote = pix.images[0].url;
        const fileName = cacheFileName(opts.destId ?? query.slice(0, 24), opts.destLang, 'pixabay');
        const localUrl = await downloadAndCacheImage(remote, fileName);
        if (localUrl) return { url: localUrl, provider: 'pixabay', apiCalls };
      }
    } catch {
      /* rede */
    }
  }

  if (imageService.services?.unsplash) {
    apiCalls += 1;
    try {
      const uns = await imageService.getSpecificServiceData(params, 'unsplash');
      if (!uns.error && Array.isArray(uns.images) && uns.images[0]?.url) {
        const url = normalizeHeroImageUrl(uns.images[0].url, width);
        if (url) return { url, provider: 'unsplash', apiCalls };
      }
    } catch {
      /* rede */
    }
  }

  return { url: null, provider: null, apiCalls };
}
