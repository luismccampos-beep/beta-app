import { NextResponse } from 'next/server';
import { searchAccommodations } from '../../../../../../lib/travel/accommodation-search';

export const dynamic = 'force-dynamic';

/**
 * GET /api/travel/v1/accommodations/search
 *
 * Aggregates accommodation results from all three sources:
 * - wv_hotel   (Wikivoyage catalog)
 * - hotel      (agency-managed)
 * - accommodation (trip planning)
 *
 * Query params:
 *   q        – full-text search on name
 *   slug     – destination slug (e.g. "pt-42-lisboa")
 *   destinoId – numeric destination ID
 *   sources  – comma-separated: wv_hotel,hotel,accommodation (default: all)
 *   limit    – max results (default: 20, max: 100)
 *   offset   – pagination offset
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() || undefined;
  const slug = url.searchParams.get('slug')?.trim() || undefined;
  const destinoIdParam = url.searchParams.get('destinoId');
  const destinoId = destinoIdParam ? parseInt(destinoIdParam, 10) : undefined;
  const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);
  const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

  const sourcesRaw = url.searchParams.get('sources')?.trim();
  const sources = sourcesRaw
    ? (sourcesRaw.split(',').map((s) => s.trim()) as ('wv_hotel' | 'hotel' | 'accommodation')[])
    : undefined;

  if (!q && !slug && !destinoId) {
    return NextResponse.json(
      { ok: false, message: 'Provide at least one of: q, slug, destinoId' },
      { status: 400 },
    );
  }

  try {
    const result = await searchAccommodations({ q, slug, destinoId, sources, limit, offset });
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Search failed';
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }
}
