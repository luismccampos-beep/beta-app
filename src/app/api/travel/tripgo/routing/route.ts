import { NextResponse } from 'next/server';

import {
  fetchTripGoRouting,
  isTripGoConfigured,
  type TripGoLatLng,
} from '../../../../../lib/travel/tripgo';

export const dynamic = 'force-dynamic';

function parseCoord(param: string | null): TripGoLatLng | null {
  if (!param) return null;
  const parts = param.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) return null;
  return { lat: parts[0]!, lon: parts[1]! };
}

export async function GET(req: Request) {
  if (!isTripGoConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          'TripGo API key missing. Add TRIPGO_API_KEY to .env.local — https://tripgo.3scale.net/signup',
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

  const departAfterParam = url.searchParams.get('departAfter');
  const departAfter = departAfterParam ? parseInt(departAfterParam, 10) : undefined;
  const modes = url.searchParams.get('modes')?.trim() || undefined;
  const locale = url.searchParams.get('locale')?.trim() || 'en';

  try {
    const result = await fetchTripGoRouting(process.env.TRIPGO_API_KEY!.trim(), {
      from,
      to,
      departAfter: Number.isFinite(departAfter) ? departAfter : undefined,
      modes,
      locale,
    });

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
        message: e instanceof Error ? e.message : 'TripGo request failed',
        plans: [],
      },
      { status: 500 },
    );
  }
}
