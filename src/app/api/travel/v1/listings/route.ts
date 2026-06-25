import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { getListingsFromDb, isTravelCatalogDbEnabled } from '../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';

const ListingsQuerySchema = z.object({
  slug: z.string().optional(),
  destinoId: z.coerce.number().int().positive().optional(),
  type: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(30),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const params = ListingsQuerySchema.parse(Object.fromEntries(url.searchParams));

  if (!isTravelCatalogDbEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Listings require TRAVEL_CATALOG_SOURCE=db and npm run travel:catalog:import -- --listings',
      },
      { status: 503 },
    );
  }

  const listings = await getListingsFromDb({ slug: params.slug, destinoId: params.destinoId, type: params.type, limit: params.limit });
  return NextResponse.json({ ok: true, source: 'db', count: listings.length, listings });
});
