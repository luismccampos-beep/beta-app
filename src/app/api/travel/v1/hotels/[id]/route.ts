import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { buildDestinationSlug } from '../../../../../../lib/travel/destination-slug';
import { buildTravelMapMarkers } from '../../../../../../lib/travel/destination-map';
import {
  getDestinationBySlugFromDb,
  getHotelByIdFromDb,
  mapMarkersFromDbHotels,
} from '../../../../../../lib/travel/catalog-db';
import { resolveMapMarkersForDestination } from '../../../../../../lib/travel/travel-map-markers';

export const dynamic = 'force-dynamic';

/** GET /api/travel/v1/hotels/12345 */
export const GET = apiHandler(async (_req: Request, ctx) => {
  const id = z.coerce.number().int().positive().parse((await ctx.params).id);

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
});
