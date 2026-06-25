import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import {
  fetchTransitLandRouting,
  fetchTransitLandOperators,
  fetchTransitLandStops,
  isTransitLandConfigured,
  getTransitLandApiKey,
} from '../../../../../lib/travel/transitland';

export const dynamic = 'force-dynamic';

const CoordSchema = z.string().transform((val, ctx) => {
  const parts = val.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Expected lat,lon' });
    return z.NEVER;
  }
  return { lat: parts[0]!, lon: parts[1]! };
});

const TransitLandQuerySchema = z.object({
  action: z.enum(['routing', 'operators', 'stops']).default('routing'),
  from: CoordSchema.optional(),
  to: CoordSchema.optional(),
  near: CoordSchema.optional(),
  departAfter: z.coerce.number().int().optional(),
  modes: z.string().optional(),
  locale: z.string().default('en'),
  maxItineraries: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(20),
  radius: z.coerce.number().min(0.1).default(1),
});

export const GET = apiHandler(async (req: Request) => {
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
  const params = TransitLandQuerySchema.parse(Object.fromEntries(url.searchParams));
  const apiKey = getTransitLandApiKey()!;

  switch (params.action) {
    case 'routing': {
      if (!params.from || !params.to) {
        return NextResponse.json(
          { ok: false, message: 'Routing requires: from=lat,lon and to=lat,lon', plans: [] },
          { status: 400 },
        );
      }

      const result = await fetchTransitLandRouting(apiKey, {
        from: params.from,
        to: params.to,
        departAfter: Number.isFinite(params.departAfter) ? params.departAfter : undefined,
        modes: params.modes?.trim() || undefined,
        locale: params.locale,
        maxItineraries: params.maxItineraries,
      });

      if (result.error && !result.plans.length) {
        return NextResponse.json(
          { ok: false, configured: true, message: result.error, plans: [] },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true, configured: true, plans: result.plans });
    }

    case 'operators': {
      const operators = await fetchTransitLandOperators(
        apiKey,
        params.near ?? undefined,
        params.limit,
      );
      return NextResponse.json({ ok: true, configured: true, operators });
    }

    case 'stops': {
      if (!params.near) {
        return NextResponse.json(
          { ok: false, message: 'Stops requires: near=lat,lon' },
          { status: 400 },
        );
      }

      const stops = await fetchTransitLandStops(
        apiKey,
        params.near,
        params.radius,
        params.limit,
      );
      return NextResponse.json({ ok: true, configured: true, stops });
    }
  }
});
