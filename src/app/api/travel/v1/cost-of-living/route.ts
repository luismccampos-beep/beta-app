import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { lookupCostOfLivingDb } from '../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';

const CostOfLivingQuerySchema = z.object({
  city: z.string().min(1),
  country: z.string().min(1),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const { city, country } = CostOfLivingQuerySchema.parse(Object.fromEntries(url.searchParams));

  const result = await lookupCostOfLivingDb(city, country);
  if (!result) {
    return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, source: 'db', ...result });
});
