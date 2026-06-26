import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

function createSafeRatelimit(opts: {
  window: number;
  max: number;
  prefix: string;
}) {
  try {
    const redis = Redis.fromEnv();
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(opts.max, `${opts.window} s`),
      analytics: true,
      prefix: opts.prefix,
    });
  } catch {
    return null;
  }
}

export const publicRatelimit = createSafeRatelimit({
  window: 60,
  max: 30,
  prefix: 'ratelimit:public',
});

export const authRatelimit = createSafeRatelimit({
  window: 60,
  max: 120,
  prefix: 'ratelimit:auth',
});

export const adminRatelimit = createSafeRatelimit({
  window: 60,
  max: 1000,
  prefix: 'ratelimit:admin',
});

export async function checkRateLimit(req: Request, limiter: Ratelimit | null) {
  if (!limiter) {
    return { success: true as const, limit: 999, remaining: 999, reset: 0 };
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'anonymous';

  try {
    return await limiter.limit(ip);
  } catch {
    return { success: true as const, limit: 999, remaining: 999, reset: 0 };
  }
}

export function detectTier(req: Request): {
  limiter: Ratelimit | null;
  tier: 'public' | 'auth' | 'admin';
} {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey && apiKey === process.env.INTERNAL_API_KEY) {
    return { limiter: adminRatelimit, tier: 'admin' };
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return { limiter: authRatelimit, tier: 'auth' };
  }

  return { limiter: publicRatelimit, tier: 'public' };
}
