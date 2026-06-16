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

/** Wikivoyage titles like "Barcelona/Eixample" → leaf + parent for search. */
export function parseDestinationTitleParts(nome) {
  const parts = simplifyForSearch(nome)
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return { leaf: simplifyForSearch(nome), parent: null };
  return {
    leaf: parts[parts.length - 1],
    parent: parts.length > 1 ? parts[0] : null,
  };
}

/** Skip default PT / "Internacional" — they make thousands of near-identical API queries. */
export function shouldIncludeCountryInImageQuery(dest) {
  const pais = dest.pais?.trim();
  if (!pais || pais === 'Internacional' || dest.paisCode === 'XX') return false;
  if (dest.lang === 'pt' && pais === 'Portugal' && dest.paisCode === 'PT') {
    const blob = `${dest.nome ?? ''}`.toLowerCase();
    return /portugal|lisboa|porto|algarve|madeira|açores|azores|sintra|coimbra|braga|faro|alentejo|douro|minho|setúbal|setubal|cascais|évora|evora|guimarães|guimaraes|aveiro|leiria|viseu|guarda|castelo branco|santarém|santarem|beja|portalegre|évora|evora|matosinhos|maia|gaia|amadora|almada|oeiras|funchal|angra|ponta delgada|horta/i.test(
      blob,
    );
  }
  return true;
}

export function buildDestinationImageQuery(dest) {
  const { leaf, parent } = parseDestinationTitleParts(dest.nome);
  const tipoHint =
    dest.tipo === 'praia'
      ? 'beach'
      : dest.tipo === 'montanha'
        ? 'mountains'
        : dest.tipo === 'ilha'
          ? 'island'
          : 'landmark';
  const country = shouldIncludeCountryInImageQuery(dest)
    ? simplifyForSearch(dest.pais)
    : null;
  return [leaf, parent, country, tipoHint, 'travel']
    .filter(Boolean)
    .join(' ');
}

/** Fallback queries when the full query returns no photos. */
export function buildDestinationImageQueryFallbacks(dest) {
  const { leaf, parent } = parseDestinationTitleParts(dest.nome);
  const country = shouldIncludeCountryInImageQuery(dest)
    ? simplifyForSearch(dest.pais)
    : null;
  return [
    [leaf, parent, country, 'travel'].filter(Boolean).join(' '),
    [leaf, parent, 'travel'].filter(Boolean).join(' '),
    [leaf, country, 'travel'].filter(Boolean).join(' '),
    [leaf, 'travel'].join(' '),
    leaf,
  ].filter((q, i, arr) => q && arr.indexOf(q) === i);
}

export function isGenericPlaceholderImage(url) {
  if (!url) return true;
  if (url.startsWith('/travel-images/')) return false;
  // Default Unsplash placeholder: photo-1469854523086-cc02afe5c88 (with or without sig=)
  if (/photo-1469854523086-cc02afe5c88/.test(url)) return true;
  return /[?&]sig=\d+/.test(url);
}

/**
 * Search Unsplash for multiple photos (gallery use).
 * @param {string} accessKey
 * @param {string} query
 * @param {{ orientation?: string; width?: number; perPage?: number }} [opts]
 * @returns {Promise<string[]>}
 */
export async function searchUnsplashPhotoUrls(accessKey, query, opts = {}) {
  const q = query.trim();
  if (!accessKey?.trim() || !q) return [];

  const perPage = Math.min(opts.perPage ?? 5, 30);
  const params = new URLSearchParams({
    query: q,
    per_page: String(perPage),
    content_filter: 'high',
    orientation: opts.orientation ?? 'landscape',
  });

  const res = await fetch(`${API}?${params}`, {
    headers: {
      Authorization: `Client-ID ${accessKey.trim()}`,
      'Accept-Version': 'v1',
    },
  });

  if (!res.ok) {
    if (res.status === 429 || (res.status === 403 && /rate limit/i.test(await res.text().catch(() => '')))) {
      return 'RATE_LIMITED';
    }
    return [];
  }

  const data = await res.json();
  const photos = data?.results ?? [];
  if (!photos.length) return [];

  const w = opts.width ?? 800;
  return photos
    .map((photo) => {
      const base = photo?.urls?.raw ?? photo?.urls?.regular ?? photo?.urls?.full;
      if (!base) return null;
      const url = new URL(base);
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('w', String(w));
      url.searchParams.set('q', '75');
      return url.toString();
    })
    .filter(Boolean);
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
