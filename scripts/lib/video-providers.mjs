/**
 * Video provider — Pexels Video API.
 *
 * Requires PEXELS_API_KEY in .env.local.
 * Pexels rate limit: ~200 req/h (same key as photos).
 */

/**
 * Search Pexels for a video and return the best landscape HD video URL.
 * @param {string} apiKey  Pexels API key
 * @param {string} query   Search query (e.g. "Paris France travel")
 * @param {{ orientation?: string; minWidth?: number; perPage?: number }} [opts]
 * @returns {Promise<{ url: string | null; duration: number | null }>}
 */
export async function searchPexelsVideoUrl(apiKey, query, opts = {}) {
  const q = query.trim();
  if (!apiKey?.trim() || !q) return { url: null, duration: null };

  const perPage = Math.min(opts.perPage ?? 5, 15);
  const orientation = opts.orientation ?? 'landscape';
  const minWidth = opts.minWidth ?? 1280;

  const url = new URL('https://api.pexels.com/v1/videos/search');
  url.searchParams.set('query', q);
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('orientation', orientation);
  url.searchParams.set('size', 'medium');  // medium = up to 1920×1080

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: apiKey },
      signal: AbortSignal.timeout(15000),
    });

    if (res.status === 429) {
      throw new Error('Pexels rate limit exceeded (429)');
    }
    if (res.status === 403) {
      throw new Error('Pexels API key invalid or expired (403)');
    }
    if (!res.ok) return { url: null, duration: null };

    const data = await res.json();
    if (!data.videos?.length) return { url: null, duration: null };

    // Pick the first video with a landscape file >= minWidth
    for (const video of data.videos) {
      const files = (video.video_files ?? [])
        .filter(
          (f) =>
            f.width >= minWidth &&
            f.height >= 720 &&
            f.link &&
            f.link.startsWith('https'),
        )
        .sort((a, b) => b.width * b.height - a.width * a.height); // largest first

      if (files.length > 0) {
        return { url: files[0].link, duration: video.duration ?? null };
      }
    }

    return { url: null, duration: null };
  } catch (err) {
    if (err.message?.includes('rate limit') || err.message?.includes('429')) {
      throw err; // Bubble up rate limit so caller can stop
    }
    return { url: null, duration: null };
  }
}
