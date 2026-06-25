import { NextResponse } from 'next/server';
import { travelRatelimit } from '../rate-limit';

export function withRateLimit(fn: (req: Request, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>): typeof fn {
  return async (req, ctx) => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? 'anonymous';

    const { success, limit, remaining, reset } = await travelRatelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests', code: 'RATE_LIMITED' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      );
    }

    const response = await fn(req, ctx);
    if (response instanceof NextResponse) {
      response.headers.set('X-RateLimit-Limit', String(limit));
      response.headers.set('X-RateLimit-Remaining', String(remaining));
    }
    return response;
  };
}
