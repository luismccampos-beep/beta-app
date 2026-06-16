import { NextResponse } from 'next/server';

import {
  fetchNavitiaJourney,
  isNavitiaConfigured,
  getNavitiaApiKey,
} from '../../../../../lib/travel/navitia';

export const dynamic = 'force-dynamic';

function parseCoord(param: string | null): { lat: number; lon: number } | null {
  if (!param) return null;
  const parts = param.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) return null;
  return { lat: parts[0]!, lon: parts[1]! };
}

export async function GET(req: Request) {
  if (!isNavitiaConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          'Navitia API key missing. Add NAVITIA_API_KEY to .env.local — https://navitia.io/signup',
        plans: [],
      },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const from = parseCoord(url.searchParams.get('from'));
  const to = parseCoord(url.searchParams.get('to'));

  if (!from || !to) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Query params required: from=lat,lon and to=lat,lon',
        plans: [],
      },
      { status: 400 },
    );
  }

  const datetime = url.searchParams.get('datetime') || undefined;
  const datetimeRep = (url.searchParams.get('datetimeRep') as 'departure' | 'arrival') || undefined;
  const locale = url.searchParams.get('locale')?.trim() || 'en';

  try {
    const apiKey = getNavitiaApiKey()!;
    const result = await fetchNavitiaJourney(apiKey, { from, to, datetime, datetimeRepresents: datetimeRep, locale });

    if (result.error && !result.plans.length) {
      return NextResponse.json(
        { ok: false, configured: true, message: result.error, plans: [], region: result.region },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      region: result.region,
      plans: result.plans,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        message: e instanceof Error ? e.message : 'Navitia request failed',
        plans: [],
      },
      { status: 500 },
    );
  }
}
