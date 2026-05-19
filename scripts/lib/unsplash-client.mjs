/**
 * Unsplash API (Search Photos) — server/scripts only.
 * @see https://unsplash.com/documentation#search-photos
 */

const API = 'https://api.unsplash.com/search/photos';

export class UnsplashRateLimitError extends Error {
  constructor(message = 'Unsplash rate limit exceeded') {
    super(message);
    this.name = 'UnsplashRateLimitError';
  }
}

/**
 * @param {string} accessKey
 * @param {string} query
 * @param {{ orientation?: string; width?: number }} [opts]
 * @returns {Promise<string | null>}
 */
export async function searchUnsplashPhotoUrl(accessKey, query, opts = {}) {
  const q = query.trim();
  if (!accessKey?.trim() || !q) return null;

  const params = new URLSearchParams({
    query: q,
    per_page: '1',
    content_filter: 'high',
    orientation: opts.orientation ?? 'landscape',
  });

  const res = await fetch(`${API}?${params}`, {
    headers: {
      Authorization: `Client-ID ${accessKey.trim()}`,
      'Accept-Version': 'v1',
    },
  });

  const bodyText = !res.ok ? await res.text().catch(() => '') : '';

  if (res.status === 429 || (res.status === 403 && /rate limit/i.test(bodyText))) {
    throw new UnsplashRateLimitError(
      `Unsplash rate limit (${res.status}). Demo apps: ~50 requests/hour. Wait ~1h and run again.`,
    );
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Unsplash auth failed (${res.status}): ${bodyText.slice(0, 120)}`);
  }
  if (!res.ok) return null;

  const data = await res.json();
  const photo = data?.results?.[0];
  if (!photo?.urls) return null;

  const w = opts.width ?? 1200;
  const base = photo.urls.raw ?? photo.urls.regular ?? photo.urls.full;
  if (!base) return null;

  const url = new URL(base);
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('w', String(w));
  url.searchParams.set('q', '80');
  return url.toString();
}

/** Strip accents for better Unsplash search matches. */
export function simplifyForSearch(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildDestinationImageQuery(dest) {
  const tipoHint =
    dest.tipo === 'praia'
      ? 'beach'
      : dest.tipo === 'montanha'
        ? 'mountains'
        : dest.tipo === 'ilha'
          ? 'island'
          : 'city';
  return [simplifyForSearch(dest.nome), simplifyForSearch(dest.pais), tipoHint, 'travel']
    .filter(Boolean)
    .join(' ');
}

/** Fallback queries when the full query returns no photos. */
export function buildDestinationImageQueryFallbacks(dest) {
  const nome = simplifyForSearch(dest.nome);
  const pais = simplifyForSearch(dest.pais);
  return [
    [nome, pais, 'travel'].filter(Boolean).join(' '),
    [nome, 'travel'].join(' '),
    nome,
  ].filter((q, i, arr) => q && arr.indexOf(q) === i);
}

export function isGenericPlaceholderImage(url) {
  if (!url) return true;
  return /photo-1469854523086-cc02afe5c88/.test(url) && /[?&]sig=\d+/.test(url);
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
