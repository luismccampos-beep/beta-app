import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api/handler';
import { checkRateLimit } from '@/lib/rate-limit';
import { searchDestinations } from '@/lib/travel/services/destination.service';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req: Request) => {
  const rateLimit = await checkRateLimit(req);
  if (!rateLimit.success) {
    return NextResponse.json(
      { ok: false, error: 'Rate limited' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } },
    );
  }

  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams);
  const result = await searchDestinations(params);
  return NextResponse.json({
    ok: true,
    ...result,
    headers: {
      'X-RateLimit-Limit': String(rateLimit.limit),
      'X-RateLimit-Remaining': String(rateLimit.remaining),
    },
  });
});
