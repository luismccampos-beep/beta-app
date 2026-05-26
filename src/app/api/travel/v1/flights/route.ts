import { NextResponse } from 'next/server';

import { getFlightsFromDb, isTravelCatalogDbEnabled } from '../../../../../lib/travel/catalog-db';
import { loadMockTravelBundle } from '../../../../../lib/travel/mock-travel/load';

export const dynamic = 'force-dynamic';

/** GET /api/travel/v1/flights?origin=LIS&destinoId=42 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.searchParams.get('origin')?.trim().toUpperCase();
  const destinoIdParam = url.searchParams.get('destinoId');
  const destinoIata = url.searchParams.get('destinoIata')?.trim().toUpperCase();
  const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);

  if (!origin) {
    return NextResponse.json({ ok: false, message: 'origin IATA required' }, { status: 400 });
  }

  const destinoId = destinoIdParam ? parseInt(destinoIdParam, 10) : undefined;

  if (isTravelCatalogDbEnabled()) {
    try {
      const flights = await getFlightsFromDb({ origin, destinoId, destinoIata, limit });
      return NextResponse.json({ ok: true, source: 'db', count: flights.length, flights });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Database error';
      return NextResponse.json({ ok: false, message }, { status: 503 });
    }
  }

  const bundle = loadMockTravelBundle();
  let flights = bundle.voos.filter((f) => f.origem === origin);
  if (destinoId) flights = flights.filter((f) => f.destino_id === destinoId);
  if (destinoIata) flights = flights.filter((f) => f.destino_iata === destinoIata);

  flights = flights.slice(0, Math.min(limit, 50));

  return NextResponse.json({ ok: true, source: 'bundle', count: flights.length, flights });
}
