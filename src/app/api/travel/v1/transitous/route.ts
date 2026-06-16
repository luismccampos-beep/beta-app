import { NextResponse } from 'next/server';

import {
  fetchTransitousRouting,
  isTransitousConfigured,
} from '../../../../../lib/travel/transitous';

export const dynamic = 'force-dynamic';

function parseCoord(param: string | null): { lat: number; lon: number } | null {
  if (!param) return null;
  const parts = param.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) return null;
  return { lat: parts[0]!, lon: parts[1]! };
}

export async function GET(req: Request) {
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
  const locale = url.searchParams.get('locale')?.trim() || 'en';

  try {
    const result = await fetchTransitousRouting(
      '', // Transitous doesn't need an API key
      {
        from,
        to,
        departAfter: Number.isFinite(departAfter) ? departAfter : undefined,
        locale,
      },
    );

    if (result.error && !result.plans.length) {
      return NextResponse.json(
        { ok: false, configured: true, message: result.error, plans: [] },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      plans: result.plans,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        message: e instanceof Error ? e.message : 'Transitous request failed',
        plans: [],
      },
      { status: 500 },
    );
  }
}
