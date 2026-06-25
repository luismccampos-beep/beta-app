import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { getFlightsFromDb, isTravelCatalogDbEnabled } from '../../../../../lib/travel/catalog-db';
import { loadMockTravelBundle } from '../../../../../lib/travel/mock-travel/load';

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

  if (isTravelCatalogDbEnabled()) {
    const flights = await getFlightsFromDb({ origin, destinoId: params.destinoId, destinoIata, limit: params.limit });
    return NextResponse.json({ ok: true, source: 'db', count: flights.length, flights });
  }

  const bundle = loadMockTravelBundle();
  let flights = bundle.voos.filter((f) => f.origem === origin);
  if (params.destinoId) flights = flights.filter((f) => f.destino_id === params.destinoId);
  if (destinoIata) flights = flights.filter((f) => f.destino_iata === destinoIata);

  flights = flights.slice(0, Math.min(params.limit, 50));

  return NextResponse.json({ ok: true, source: 'bundle', count: flights.length, flights });
});
