import { createMiddleware } from '@tanstack/react-start'
import { checkRateLimit, publicRatelimit, authRatelimit, adminRatelimit } from '@/lib/rate-limit'

function detectTier(request: Request): { limiter: typeof publicRatelimit; tier: string } {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey && apiKey === process.env.INTERNAL_API_KEY) {
    return { limiter: adminRatelimit, tier: 'admin' }
  }
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return { limiter: authRatelimit, tier: 'auth' }
  }
  return { limiter: publicRatelimit, tier: 'public' }
}

export const rateLimitMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url)
  if (!url.pathname.startsWith('/api')) return next()

  const { limiter, tier } = detectTier(request)
  const result = await checkRateLimit(request, limiter)

  if (!result.success) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Rate limit exceeded', tier }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const nextResult = await next()
  return nextResult
})
