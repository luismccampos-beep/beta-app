import { NextResponse } from 'next/server';
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit';

import {
  listDistinctContinentsFromDb,
  listDistinctCountriesFromDb,
} from '../../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';

/** GET /api/travel/v1/destinations/countries — also returns continents */
export async function GET(req: Request) {
  const rateLimitResult = await checkRateLimit(req, publicRatelimit);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests', code: 'RATE_LIMITED' },
      { status: 429 },
    );
  }

  try {
    const [countries, continents] = await Promise.all([
      listDistinctCountriesFromDb(),
      listDistinctContinentsFromDb(),
    ]);
    return NextResponse.json({ ok: true, source: 'db', countries, continents });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Database query failed';
    return NextResponse.json({ ok: false, source: 'db', message }, { status: 503 });
  }
}
