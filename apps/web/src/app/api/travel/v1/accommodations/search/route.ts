import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { searchAccommodations } from '../../../../../../lib/travel/accommodation-search';

export const dynamic = 'force-dynamic';

const AccommodationSearchSchema = z.object({
  q: z.string().optional(),
  slug: z.string().optional(),
  destinoId: z.coerce.number().int().positive().optional(),
  sources: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
}).refine((data) => data.q || data.slug || data.destinoId, {
  message: 'Provide at least one of: q, slug, destinoId',
  path: ['q'],
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const params = AccommodationSearchSchema.parse(Object.fromEntries(url.searchParams));

  const sources = params.sources
    ? params.sources.split(',').map((s) => s.trim()) as ('wv_hotel' | 'hotel' | 'accommodation')[]
    : undefined;

  const result = await searchAccommodations({
    q: params.q,
    slug: params.slug,
    destinoId: params.destinoId,
    sources,
    limit: params.limit,
    offset: params.offset,
  });

  return NextResponse.json(result);
});
