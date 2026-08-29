import { createMiddleware } from '@tanstack/react-start'
import {
  checkRateLimit,
  publicRatelimit,
  authRatelimit,
  adminRatelimit,
} from '@/lib/rate-limit'
import { unwrapResponse } from '@/lib/middleware'

function detectTier(request: Request): {
  limiter: typeof publicRatelimit
  tier: string
} {
  const apiKey = request.headers.get('x-api-key')
  const expected = process.env.INTERNAL_API_KEY?.trim()
  if (apiKey && expected && apiKey === expected) {
    return { limiter: adminRatelimit, tier: 'admin' }
  }
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return { limiter: authRatelimit, tier: 'auth' }
  }
  return { limiter: publicRatelimit, tier: 'public' }
}

export const rateLimitMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api')) return next()

    // Skip rate limiting in development
    if (process.env.NODE_ENV === 'development') {
      return next()
    }

    const { limiter, tier } = detectTier(request)
    const result = await checkRateLimit(request, limiter)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Rate limit exceeded',
          tier,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        },
      )
    }

    const nextResult = await next()
    const response = unwrapResponse(nextResult)
    if (!response) return nextResult

    const headers = new Headers(response.headers)
    headers.set('X-RateLimit-Tier', tier)
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
)
