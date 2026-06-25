import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import {
  fetchTransitousRouting,
  isTransitousConfigured,
} from '../../../../../lib/travel/transitous';

export const dynamic = 'force-dynamic';

const CoordSchema = z.string().transform((val, ctx) => {
  const parts = val.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Expected lat,lon' });
    return z.NEVER;
  }
  return { lat: parts[0]!, lon: parts[1]! };
});

const TransitousQuerySchema = z.object({
  from: CoordSchema,
  to: CoordSchema,
  departAfter: z.coerce.number().int().optional(),
  locale: z.string().default('en'),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const params = TransitousQuerySchema.parse(Object.fromEntries(url.searchParams));

  const result = await fetchTransitousRouting('', {
    from: params.from,
    to: params.to,
    departAfter: Number.isFinite(params.departAfter) ? params.departAfter : undefined,
    locale: params.locale,
  });

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
});
