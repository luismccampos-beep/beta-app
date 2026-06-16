import { NextResponse } from 'next/server';

import {
  fetchTransitLandRouting,
  fetchTransitLandOperators,
  fetchTransitLandStops,
  isTransitLandConfigured,
  getTransitLandApiKey,
} from '../../../../../lib/travel/transitland';

export const dynamic = 'force-dynamic';

function parseCoord(param: string | null): { lat: number; lon: number } | null {
  if (!param) return null;
  const parts = param.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) return null;
  return { lat: parts[0]!, lon: parts[1]! };
}

export async function GET(req: Request) {
  if (!isTransitLandConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          'Transit.land API key missing. Add TRANSITLAND_API_KEY to .env.local — https://www.transit.land/plans-pricing',
        data: null,
      },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'routing';
  const apiKey = getTransitLandApiKey()!;

  switch (action) {
    // ── Routing ──────────────────────────────────────────────────────
    case 'routing': {
      const from = parseCoord(url.searchParams.get('from'));
      const to = parseCoord(url.searchParams.get('to'));

      if (!from || !to) {
        return NextResponse.json(
          {
            ok: false,
            message: 'Routing requires: from=lat,lon and to=lat,lon',
            plans: [],
          },
          { status: 400 },
        );
      }

      const departAfterParam = url.searchParams.get('departAfter');
      const departAfter = departAfterParam ? parseInt(departAfterParam, 10) : undefined;
      const modes = url.searchParams.get('modes')?.trim() || undefined;
      const locale = url.searchParams.get('locale')?.trim() || 'en';
      const maxParam = url.searchParams.get('maxItineraries');
      const maxItineraries = maxParam ? parseInt(maxParam, 10) : undefined;

      try {
        const result = await fetchTransitLandRouting(apiKey, {
          from,
          to,
          departAfter: Number.isFinite(departAfter) ? departAfter : undefined,
          modes,
          locale,
          maxItineraries: Number.isFinite(maxItineraries) ? maxItineraries : undefined,
        });

        if (result.error && !result.plans.length) {
          return NextResponse.json(
            { ok: false, configured: true, message: result.error, plans: [] },
            { status: 502 },
          );
        }

        return NextResponse.json({ ok: true, configured: true, plans: result.plans });
      } catch (e: unknown) {
        return NextResponse.json(
          {
            ok: false,
            configured: true,
            message: e instanceof Error ? e.message : 'Transit.land request failed',
            plans: [],
          },
          { status: 500 },
        );
      }
    }

    // ── Operators ────────────────────────────────────────────────────
    case 'operators': {
      const nearParam = url.searchParams.get('near');
      const limit = parseInt(url.searchParams.get('limit') || '20', 10);
      const near = nearParam ? parseCoord(nearParam) : undefined;

      const operators = await fetchTransitLandOperators(
        apiKey,
        near ?? undefined,
        Number.isFinite(limit) ? limit : 20,
      );

      return NextResponse.json({ ok: true, configured: true, operators });
    }

    // ── Stops ────────────────────────────────────────────────────────
    case 'stops': {
      const nearCoord = parseCoord(url.searchParams.get('near'));
      if (!nearCoord) {
        return NextResponse.json(
          { ok: false, message: 'Stops requires: near=lat,lon' },
          { status: 400 },
        );
      }

      const radius = parseFloat(url.searchParams.get('radius') || '1');
      const stopLimit = parseInt(url.searchParams.get('limit') || '20', 10);

      const stops = await fetchTransitLandStops(
        apiKey,
        nearCoord,
        Number.isFinite(radius) ? radius : 1,
        Number.isFinite(stopLimit) ? stopLimit : 20,
      );

      return NextResponse.json({ ok: true, configured: true, stops });
    }

    default:
      return NextResponse.json(
        { ok: false, message: `Unknown action: ${action}. Use: routing, operators, stops` },
        { status: 400 },
      );
  }
}
