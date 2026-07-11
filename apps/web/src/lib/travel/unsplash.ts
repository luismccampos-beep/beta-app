const GENERIC_PHOTO_ID = 'photo-1469854523086-cc02afe5c88';

export function isGenericDestinationImage(url: string | undefined | null): boolean {
  if (!url?.trim()) return true;
  if (url.startsWith('/travel-images/')) return false;
  return url.includes(GENERIC_PHOTO_ID) && /[?&]sig=\d+/.test(url);
}

export function buildDestinationImageQuery(input: {
  nome: string;
  pais?: string;
  tipo?: string;
  continente?: string;
}): string {
  const tipoHint =
    input.tipo === 'praia'
      ? 'beach'
      : input.tipo === 'montanha'
        ? 'mountains'
        : input.tipo === 'ilha'
          ? 'island'
          : input.tipo === 'campo'
            ? 'countryside'
            : 'city';
  const strip = (s: string) =>
    s
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  return [strip(input.nome), strip(input.pais ?? ''), tipoHint, 'travel'].filter(Boolean).join(' ');
}

export type UnsplashPhotoResult = {
  url: string;
  photographer?: string;
  photographerUrl?: string;
  unsplashUrl?: string;
};

/**
 * Search Unsplash for a destination hero image (server-side only).
 * Requires UNSPLASH_ACCESS_KEY.
 */
export async function fetchUnsplashDestinationPhoto(
  query: string,
  options?: { width?: number; orientation?: 'landscape' | 'portrait' | 'squarish' },
): Promise<UnsplashPhotoResult | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (!accessKey || !query.trim()) return null;

  const params = new URLSearchParams({
    query: query.trim(),
    per_page: '1',
    content_filter: 'high',
    orientation: options?.orientation ?? 'landscape',
  });

  const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      'Accept-Version': 'v1',
    },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    results?: Array<{
      urls?: { raw?: string; regular?: string; full?: string };
      user?: { name?: string; links?: { html?: string } };
      links?: { html?: string };
    }>;
  };

  const photo = data.results?.[0];
  if (!photo?.urls) return null;

  const base = photo.urls.raw ?? photo.urls.regular;
  if (!base) return null;

  const url = new URL(base);
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('w', String(options?.width ?? 1400));
  url.searchParams.set('q', '80');

  return {
    url: url.toString(),
    photographer: photo.user?.name,
    photographerUrl: photo.user?.links?.html,
    unsplashUrl: photo.links?.html,
  };
}
