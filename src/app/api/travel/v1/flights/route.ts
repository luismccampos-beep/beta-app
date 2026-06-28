import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { getFlightsFromDb } from '../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';

const FlightsQuerySchema = z.object({
  origin: z.string().min(1),
  destinoId: z.coerce.number().int().positive().optional(),
  destinoIata: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const params = FlightsQuerySchema.parse(Object.fromEntries(url.searchParams));
  const origin = params.origin.trim().toUpperCase();
  const destinoIata = params.destinoIata?.trim().toUpperCase();

  const flights = await getFlightsFromDb({ origin, destinoId: params.destinoId, destinoIata, limit: params.limit });
  return NextResponse.json({ ok: true, source: 'db', count: flights.length, flights });
});
