import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api/handler';
import { searchDestinations } from '@/lib/travel/services/destination.service';

export const dynamic = 'force-dynamic';

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

  const result = await searchDestinations(params);
  return NextResponse.json({
    ok: true,
    ...result,
  });
});
