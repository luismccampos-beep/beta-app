import { NextResponse } from 'next/server';

import { fetchLiteApiPlaces, isLiteApiConfigured } from '../../../../../lib/travel/liteapi';

export const dynamic = 'force-dynamic';

/**
 * Proxy for LiteAPI GET /v3.0/data/places (hotel/city autocomplete).
 *
 * Query: ?q=Lisboa  or  ?textQuery=Lisboa
 * Optional: type=locality,airport,hotel  language=pt  sessionId=...
 */
export async function GET(req: Request) {
  if (!isLiteApiConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message: 'LITEAPI_API_KEY not configured (sandbox: sand_…, production: prod_…)',
      },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const textQuery =
    url.searchParams.get('textQuery')?.trim() ||
    url.searchParams.get('q')?.trim() ||
    '';

  if (!textQuery) {
    return NextResponse.json(
      { ok: false, message: 'Provide ?q= or ?textQuery= (e.g. Lisboa)' },
      { status: 400 },
    );
  }

  const type = url.searchParams.get('type')?.trim() || undefined;
  const language = url.searchParams.get('language')?.trim() || undefined;
  const sessionId = url.searchParams.get('sessionId')?.trim() || undefined;

  const forwarded = req.headers.get('x-forwarded-for');
  const clientIP =
    forwarded?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    undefined;

  try {
    const places = await fetchLiteApiPlaces({
      textQuery,
      type,
      language,
      sessionId,
      clientIP,
    });

    return NextResponse.json({
      ok: true,
      configured: true,
      textQuery,
      places,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'LiteAPI places request failed';
    const status = message.includes('textQuery is required') ? 400 : 502;
    return NextResponse.json({ ok: false, configured: true, message }, { status });
  }
}
