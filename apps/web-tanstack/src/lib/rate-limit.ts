import { createHash, timingSafeEqual } from 'node:crypto'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const isProd = process.env.NODE_ENV === 'production'

function createSafeRatelimit(opts: { window: number; max: number; prefix: string }) {
  try {
    const redis = Redis.fromEnv()
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(opts.max, `${opts.window} s`),
      analytics: true,
      prefix: opts.prefix,
    })
  } catch {
    if (isProd) {
      console.error(`[rate-limit] Redis not configured — rate limiting DISABLED for "${opts.prefix}"`)
    }
    return null
  }
}

export const publicRatelimit = createSafeRatelimit({ window: 60, max: 100, prefix: 'ratelimit:public' })
export const authRatelimit = createSafeRatelimit({ window: 60, max: 120, prefix: 'ratelimit:auth' })
export const adminRatelimit = createSafeRatelimit({ window: 60, max: 1000, prefix: 'ratelimit:admin' })

export async function checkRateLimit(req: Request, limiter: Ratelimit | null, failClosed = isProd) {
  if (!limiter) {
    if (failClosed) {
      return { success: false as const, limit: 0, remaining: 0, reset: Date.now() + 60000 }
    }
    return { success: true as const, limit: 999, remaining: 999, reset: 0 }
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'anonymous'

  try {
    return await limiter.limit(ip)
  } catch {
    if (failClosed) {
      return { success: false as const, limit: 0, remaining: 0, reset: Date.now() + 60000 }
    }
    return { success: true as const, limit: 999, remaining: 999, reset: 0 }
  }
}

/** Constant-time key comparison via SHA-256 digest. */
function safeKeyEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a, 'utf8').digest()
  const hb = createHash('sha256').update(b, 'utf8').digest()
  return timingSafeEqual(ha, hb)
}

export function detectTier(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  const expected = process.env.INTERNAL_API_KEY?.trim()
  if (apiKey && expected && safeKeyEqual(apiKey, expected)) {
    return { limiter: adminRatelimit, tier: 'admin' as const }
  }
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return { limiter: authRatelimit, tier: 'auth' as const }
  }
  return { limiter: publicRatelimit, tier: 'public' as const }
}
