import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { getHotelsFromDb } from '../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';

const HotelsQuerySchema = z.object({
  slug: z.string().optional(),
  destinoId: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const { slug, destinoId, limit } = HotelsQuerySchema.parse(Object.fromEntries(url.searchParams));

  const hotels = await getHotelsFromDb({ slug, destinoId, limit });
  return NextResponse.json({ ok: true, source: 'db', count: hotels.length, hotels });
});
