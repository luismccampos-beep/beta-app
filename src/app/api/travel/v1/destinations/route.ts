import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api/handler';
import { checkRateLimit } from '@/lib/rate-limit';
import { searchDestinations } from '@/lib/travel/services/destination.service';

export const dynamic = 'force-dynamic';

async function safeCheckRateLimit(req: Request) {
  try {
    return await checkRateLimit(req);
  } catch {
    return { success: true as const, limit: 999, remaining: 999, reset: 0 };
  }
}

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const rawParams = Object.fromEntries(url.searchParams);

  const params: Record<string, string> = { ...rawParams };
  if (rawParams.pageSize && !rawParams.limit) params.limit = rawParams.pageSize;
  if (rawParams.page && !rawParams.offset) {
    const size = Number(rawParams.pageSize || 24);
    params.offset = String((Number(rawParams.page) - 1) * size);
  }
  if (rawParams.locale && !rawParams.lang) params.lang = rawParams.locale;

  const rateLimit = await safeCheckRateLimit(req);
  if (!rateLimit.success) {
    return NextResponse.json(
      { ok: false, error: 'Rate limited' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } },
    );
  }

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
