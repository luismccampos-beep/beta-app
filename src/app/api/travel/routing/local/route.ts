import { NextResponse } from 'next/server';

import {
  fetchLocalRouting,
  isLocalRoutingConfigured,
  type LocalRoutingMode,
} from '../../../../../lib/travel/local-routing';
import type { ValhallaCosting } from '../../../../../lib/travel/valhalla';

export const dynamic = 'force-dynamic';

function parseCoord(param: string | null): { lat: number; lon: number } | null {
  if (!param) return null;
  const parts = param.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) return null;
  return { lat: parts[0]!, lon: parts[1]! };
}

const STREET_MODES = new Set<ValhallaCosting>(['auto', 'pedestrian', 'bicycle', 'bus', 'motorcycle']);

function parseRoutingMode(
  modeParam: string | null,
  costingParam: string | null,
): LocalRoutingMode {
  const mode = (modeParam ?? '').trim().toLowerCase();
  if (mode === 'transit' || mode === 'public_transport' || mode === 'pt') return 'transit';

  const costing = (costingParam ?? modeParam ?? 'auto').trim().toLowerCase() as ValhallaCosting;
  if (STREET_MODES.has(costing)) return costing;
  return 'auto';
}

export async function GET(req: Request) {
  if (!isLocalRoutingConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        provider: null,
        message:
          'Routing not configured. Demo local: OTP_BASE_URL + npm run otp:up, VALHALLA_BASE_URL + docker compose up valhalla. Or TRIPGO_API_KEY.',
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

  const routingMode = parseRoutingMode(
    url.searchParams.get('mode'),
    url.searchParams.get('costing'),
  );
  const modes = url.searchParams.get('modes')?.trim() || undefined;
  const locale = url.searchParams.get('locale')?.trim() || 'en';
  const departAfterParam = url.searchParams.get('departAfter');
  const departAfter = departAfterParam ? parseInt(departAfterParam, 10) : undefined;
  const localOnly =
    url.searchParams.get('localOnly') === '1' ||
    url.searchParams.get('valhallaOnly') === '1';

  try {
    const result = await fetchLocalRouting({
      from,
      to,
      mode: routingMode,
      tripGoModes: modes,
      locale,
      departAfter: Number.isFinite(departAfter) ? departAfter : undefined,
      localOnly,
    });

    if (!result.plans.length) {
      return NextResponse.json(
        {
          ok: false,
          configured: result.configured,
          provider: result.provider,
          message: result.error ?? 'No routes',
          plans: [],
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      provider: result.provider,
      mode: routingMode,
      plans: result.plans,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        provider: null,
        message: e instanceof Error ? e.message : 'Routing failed',
        plans: [],
      },
      { status: 500 },
    );
  }
}
