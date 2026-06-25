import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
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

/** GET /api/travel/v1/hotels/12345 */
export const GET = apiHandler(async (_req: Request, ctx) => {
  const id = z.coerce.number().int().positive().parse((await ctx.params).id);

  if (isTravelCatalogDbEnabled()) {
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
});
