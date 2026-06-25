import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { searchPlacesViaPhoton } from '../../../../../../lib/travel/osm';

export const dynamic = 'force-dynamic';

const GeocodeQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(50).default(8),
  hotelsOnly: z.enum(['0', '1', 'true', 'false']).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const params = GeocodeQuerySchema.parse(Object.fromEntries(url.searchParams));
  const lon = params.lon ?? params.lng;

  const places = await searchPlacesViaPhoton({
    q: params.q,
    limit: params.limit,
    hotelsOnly: params.hotelsOnly === '1' || params.hotelsOnly === 'true',
    lat: params.lat,
    lon: Number.isFinite(lon!) ? lon : undefined,
  });

  return NextResponse.json({
    ok: true,
    source: 'photon',
    q: params.q,
    count: places.length,
    results: places,
  });
});
