import { createFileRoute } from '@tanstack/react-router'
import { apiHandler } from '@/lib/api/handler'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'

export const Route = createFileRoute('/api/travel/cruises')({
  server: {
    handlers: {
      GET: apiHandler(async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
        }
        return Response.json({
          ok: true,
          message: 'Cruise offers are not available yet',
          results: [],
        })
      }),
    },
  },
})