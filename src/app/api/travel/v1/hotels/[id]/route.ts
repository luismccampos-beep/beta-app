import { NextResponse } from 'next/server';

import { buildDestinationSlug } from '../../../../../../lib/travel/destination-slug';
import { buildTravelMapMarkers } from '../../../../../../lib/travel/destination-map';
import {
  getDestinationBySlugFromDb,
  getHotelByIdFromDb,
  isTravelCatalogDbEnabled,
  mapMarkersFromDbHotels,
} from '../../../../../../lib/travel/catalog-db';
import {
  getMockHotelById,
  isTravelMockEnabled,
} from '../../../../../../lib/travel/mock-travel/load';
import { resolveMapMarkersForDestination } from '../../../../../../lib/travel/travel-map-markers';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ id: string }> };

/** GET /api/travel/v1/hotels/12345 */
export async function GET(_req: Request, ctx: RouteCtx) {
  const { id: idParam } = await ctx.params;
  const id = parseInt(idParam, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ ok: false, message: 'Invalid hotel id' }, { status: 400 });
  }

  if (isTravelCatalogDbEnabled()) {
    try {
      const row = await getHotelByIdFromDb(id);
      if (!row) {
        return NextResponse.json({ ok: false, message: 'Hotel not found' }, { status: 404 });
      }

      let mapMarkers = buildTravelMapMarkers(
        {
          nome: row.hotel.nome,
          latitude: row.hotel.latitude,
          longitude: row.hotel.longitude,
        },
        [],
      );

      if (row.dest?.slug) {
        const full = await getDestinationBySlugFromDb(row.dest.slug);
        if (full) {
          const fromDb = mapMarkersFromDbHotels(full.dest, full.hotels);
          if (fromDb.length) mapMarkers = fromDb;
        }
      }

      return NextResponse.json({
        ok: true,
        source: 'db',
        hotel: row.hotel,
        destination: row.dest,
        mapMarkers,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Database error';
      return NextResponse.json({ ok: false, message }, { status: 503 });
    }
  }

  const bundleRow = getMockHotelById(id);
  if (!bundleRow) {
    return NextResponse.json({ ok: false, message: 'Hotel not found in bundle' }, { status: 404 });
  }

  const { hotel, dest } = bundleRow;

  return NextResponse.json({
    ok: true,
    source: 'bundle',
    hotel,
    destination: {
      id: dest.id,
      nome: dest.nome,
      pais: dest.pais,
      slug: buildDestinationSlug(dest),
    },
    mapMarkers: resolveMapMarkersForDestination(dest),
    mock: isTravelMockEnabled(),
  });
}
