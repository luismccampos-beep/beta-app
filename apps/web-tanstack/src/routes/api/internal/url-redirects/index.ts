import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@akmleva/db'
import { requireInternalApiKey } from '@/lib/api/auth'

export const Route = createFileRoute('/api/internal/url-redirects/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = requireInternalApiKey(request)
        if (denied) return denied

        try {
          const url = new URL(request.url)
          const activeOnly = url.searchParams.get('activeOnly') === 'true'
          const limit = Math.min(parseInt(url.searchParams.get('limit') || '500', 10), 1000)

          const where = activeOnly ? { is_active: true } : {}

          const redirects = await prisma.urlRedirect.findMany({
            where,
            take: limit,
            orderBy: { created_at: 'desc' },
          })

          return Response.json({ success: true, data: redirects })
        } catch (error) {
          console.error('[internal/url-redirects] Error:', error)
          return Response.json(
            { ok: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
            { status: 500 },
          )
        }
      },
    },
  },
})
