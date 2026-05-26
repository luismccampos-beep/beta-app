import { NextResponse } from 'next/server';

import {
  getHotelsNearbyFromDb,
  isTravelCatalogDbEnabled,
} from '../../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/travel/v1/hotels/nearby?lat=38.72&lng=-9.14&radiusKm=10&stars=4&limit=50
 */
export async function GET(req: Request) {
  if (!isTravelCatalogDbEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Set TRAVEL_CATALOG_SOURCE=db and run travel:catalog:backfill-geo',
      },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const lat = parseFloat(url.searchParams.get('lat') ?? '');
  const lng = parseFloat(url.searchParams.get('lng') ?? url.searchParams.get('lon') ?? '');

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { ok: false, message: 'Provide valid lat and lng (or lon)' },
      { status: 400 },
    );
  }

  const radiusKm = parseFloat(url.searchParams.get('radiusKm') ?? url.searchParams.get('radius') ?? '10');
  const starsParam = url.searchParams.get('stars') ?? url.searchParams.get('minStars');
  const minStars = starsParam ? parseInt(starsParam, 10) : undefined;
  const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);

  try {
    const hotels = await getHotelsNearbyFromDb({
      lat,
      lng,
      radiusKm: Number.isFinite(radiusKm) ? radiusKm : 10,
      minStars: minStars != null && Number.isFinite(minStars) ? minStars : undefined,
      limit: Number.isFinite(limit) ? limit : 50,
    });

    return NextResponse.json({
      ok: true,
      source: 'db',
      center: { lat, lng },
      radiusKm: Number.isFinite(radiusKm) ? radiusKm : 10,
      count: hotels.length,
      hotels,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Database error';
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }
}
