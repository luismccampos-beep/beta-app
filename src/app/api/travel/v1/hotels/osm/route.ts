import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import {
  enrichPlaceWithWikidataImage,
  searchHotelsViaBizData,
} from '../../../../../../lib/travel/osm';

export const dynamic = 'force-dynamic';

const OsmHotelsQuerySchema = z.object({
  location: z.string().min(1),
  radius_km: z.coerce.number().min(0.1).max(500).default(5),
  radius: z.coerce.number().min(0.1).max(500).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  enrich: z.string().optional(),
  category: z.string().optional(),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const params = OsmHotelsQuerySchema.parse(Object.fromEntries(url.searchParams));
  const radiusKm = params.radius_km ?? params.radius ?? 5;
  const enrich = params.enrich?.split(',') ?? [];
  const withWikidataImages = enrich.includes('wikidata');

  const result = await searchHotelsViaBizData({
    location: params.location,
    radiusKm: Number.isFinite(radiusKm) ? radiusKm : 5,
    limit: params.limit,
    category: params.category?.trim() || 'hotel',
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
    location: params.location,
    locationResolved: result.locationResolved,
    total: result.total,
    count: places.length,
    dataQuality: result.dataQuality,
    hotels: places,
  });
});
