import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { getHotelsNearbyFromDb } from '../../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';

const NearbyHotelsQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  lon: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().min(0.1).max(500).default(10),
  radius: z.coerce.number().min(0.1).max(500).optional(),
  stars: z.coerce.number().int().min(0).max(5).optional(),
  minStars: z.coerce.number().int().min(0).max(5).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const params = NearbyHotelsQuerySchema.parse(Object.fromEntries(url.searchParams));
  const lng = params.lng ?? params.lon!;
  const radiusKm = params.radiusKm ?? params.radius ?? 10;
  const minStars = params.stars ?? params.minStars;

  const hotels = await getHotelsNearbyFromDb({
    lat: params.lat,
    lng,
    radiusKm,
    minStars: minStars != null && Number.isFinite(minStars) ? minStars : undefined,
    limit: params.limit,
  });

  return NextResponse.json({
    ok: true,
    source: 'db',
    center: { lat: params.lat, lng },
    radiusKm,
    count: hotels.length,
    hotels,
  });
});
