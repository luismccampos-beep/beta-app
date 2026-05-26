import { NextResponse } from 'next/server';

import { getHotelsFromDb, isTravelCatalogDbEnabled } from '../../../../../lib/travel/catalog-db';
import {
  getMockDestinationBySlug,
  getMockHotelsForDestination,
} from '../../../../../lib/travel/mock-travel/load';
import { parseDestinationSlug } from '../../../../../lib/travel/destination-slug';

export const dynamic = 'force-dynamic';

/** GET /api/travel/v1/hotels?slug=pt-42 | ?destinoId=42 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug')?.trim() || undefined;
  const destinoIdParam = url.searchParams.get('destinoId');
  const destinoId = destinoIdParam ? parseInt(destinoIdParam, 10) : undefined;
  const limit = parseInt(url.searchParams.get('limit') ?? '24', 10);

  if (isTravelCatalogDbEnabled()) {
    try {
      const hotels = await getHotelsFromDb({ slug, destinoId, limit });
      return NextResponse.json({ ok: true, source: 'db', count: hotels.length, hotels });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Database error';
      return NextResponse.json({ ok: false, message }, { status: 503 });
    }
  }

  let id = destinoId;
  if (!id && slug) {
    const parsed = parseDestinationSlug(slug);
    if (parsed) id = parsed.id;
  }
  if (!id) {
    return NextResponse.json(
      { ok: false, message: 'Provide slug or destinoId' },
      { status: 400 },
    );
  }

  const hotels = getMockHotelsForDestination(id).slice(0, Math.min(limit, 50));
  return NextResponse.json({ ok: true, source: 'bundle', count: hotels.length, hotels });
}
