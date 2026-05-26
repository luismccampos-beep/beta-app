import { NextResponse } from 'next/server';

import { getListingsFromDb, isTravelCatalogDbEnabled } from '../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';

/** GET /api/travel/v1/listings?slug=pt-42&type=sleep */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug')?.trim() || undefined;
  const destinoIdParam = url.searchParams.get('destinoId');
  const type = url.searchParams.get('type')?.trim() || undefined;
  const limit = parseInt(url.searchParams.get('limit') ?? '30', 10);
  const destinoId = destinoIdParam ? parseInt(destinoIdParam, 10) : undefined;

  if (!isTravelCatalogDbEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Listings require TRAVEL_CATALOG_SOURCE=db and npm run travel:catalog:import -- --listings',
      },
      { status: 503 },
    );
  }

  try {
    const listings = await getListingsFromDb({ slug, destinoId, type, limit });
    return NextResponse.json({ ok: true, source: 'db', count: listings.length, listings });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Database error';
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }
}
