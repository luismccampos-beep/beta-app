import { NextResponse } from 'next/server';

import {
  enrichPlaceWithWikidataImage,
  searchHotelsViaBizData,
} from '../../../../../../lib/travel/osm';

export const dynamic = 'force-dynamic';

/**
 * Hotéis OpenStreetMap via BizData (Overpass encapsulado).
 * GET /api/travel/v1/hotels/osm?location=Porto, Portugal&radius_km=5&limit=20&enrich=wikidata
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const location = url.searchParams.get('location')?.trim();
  if (!location) {
    return NextResponse.json(
      { ok: false, message: 'Provide location (city or lat,lng)' },
      { status: 400 },
    );
  }

  const radiusKm = parseFloat(url.searchParams.get('radius_km') ?? url.searchParams.get('radius') ?? '5');
  const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
  const enrich = url.searchParams.get('enrich')?.split(',') ?? [];
  const withWikidataImages = enrich.includes('wikidata');

  try {
    const result = await searchHotelsViaBizData({
      location,
      radiusKm: Number.isFinite(radiusKm) ? radiusKm : 5,
      limit: Number.isFinite(limit) ? limit : 50,
      category: url.searchParams.get('category')?.trim() || 'hotel',
    });

    let places = result.places;
    if (withWikidataImages) {
      places = await Promise.all(
        places.map((p) => enrichPlaceWithWikidataImage(p)),
      );
    }

    return NextResponse.json({
      ok: true,
      source: 'osm-bizdata',
      location,
      locationResolved: result.locationResolved,
      total: result.total,
      count: places.length,
      dataQuality: result.dataQuality,
      hotels: places,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'BizData request failed';
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
