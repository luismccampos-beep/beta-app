import { NextResponse } from 'next/server';

import { searchPlacesViaPhoton } from '../../../../../../lib/travel/osm';

export const dynamic = 'force-dynamic';

/**
 * Pesquisa por nome / morada (Photon).
 * GET /api/travel/v1/hotels/geocode?q=Hotel Mundial Lisboa&hotelsOnly=1&limit=8
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim();
  if (!q) {
    return NextResponse.json({ ok: false, message: 'Provide q' }, { status: 400 });
  }

  const limit = parseInt(url.searchParams.get('limit') ?? '8', 10);
  const hotelsOnly =
    url.searchParams.get('hotelsOnly') === '1' ||
    url.searchParams.get('hotelsOnly') === 'true';
  const lat = parseFloat(url.searchParams.get('lat') ?? '');
  const lon = parseFloat(url.searchParams.get('lon') ?? url.searchParams.get('lng') ?? '');

  try {
    const places = await searchPlacesViaPhoton({
      q,
      limit: Number.isFinite(limit) ? limit : 8,
      hotelsOnly,
      lat: Number.isFinite(lat) ? lat : undefined,
      lon: Number.isFinite(lon) ? lon : undefined,
    });

    return NextResponse.json({
      ok: true,
      source: 'photon',
      q,
      count: places.length,
      results: places,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Photon request failed';
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
