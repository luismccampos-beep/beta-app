import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { getHotelsFromDb, isTravelCatalogDbEnabled } from '../../../../../lib/travel/catalog-db';
import {
  getMockDestinationBySlug,
  getMockHotelsForDestination,
} from '../../../../../lib/travel/mock-travel/load';
import { parseDestinationSlug } from '../../../../../lib/travel/destination-slug';

export const dynamic = 'force-dynamic';

const HotelsQuerySchema = z.object({
  slug: z.string().optional(),
  destinoId: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const { slug, destinoId, limit } = HotelsQuerySchema.parse(Object.fromEntries(url.searchParams));

  if (isTravelCatalogDbEnabled()) {
    const hotels = await getHotelsFromDb({ slug, destinoId, limit });
    return NextResponse.json({ ok: true, source: 'db', count: hotels.length, hotels });
  }

  let id = destinoId;
  if (!id && slug) {
    const parsed = parseDestinationSlug(slug);
    if (parsed) id = parsed.id;
  }
  if (!id) {
    return NextResponse.json(
      { ok: false, message: 'Provide slug or destinoId' },
      { status: 400 },
    );
  }

  const hotels = getMockHotelsForDestination(id).slice(0, Math.min(limit, 50));
  return NextResponse.json({ ok: true, source: 'bundle', count: hotels.length, hotels });
});
