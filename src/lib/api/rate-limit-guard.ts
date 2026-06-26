import { NextResponse } from 'next/server';
import { checkRateLimit, detectTier } from '../rate-limit';

export function withRateLimit(fn: (req: Request, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>): typeof fn {
  return async (req, ctx) => {
    const { limiter, tier } = detectTier(req);
    const result = await checkRateLimit(req, limiter);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests', code: 'RATE_LIMITED' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Tier': tier,
          },
        }
      );
    }

    const response = await fn(req, ctx);
    if (response instanceof NextResponse) {
      response.headers.set('X-RateLimit-Limit', String(result.limit));
      response.headers.set('X-RateLimit-Remaining', String(result.remaining));
      response.headers.set('X-RateLimit-Tier', tier);
    }
    return response;
  };
}
