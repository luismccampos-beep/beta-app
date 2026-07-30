import { createFileRoute } from '@tanstack/react-router'
import { requireInternalApiKey } from '@/lib/api/auth'
import { prisma } from '@akmleva/db'

export const Route = createFileRoute('/api/internal/url-redirects/$id/visit')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const denied = requireInternalApiKey(request)
        if (denied) return denied

        try {
          const { id } = params

          await prisma.urlRedirect.update({
            where: { id },
            data: {
              visit_count: { increment: 1 },
              last_visited_at: new Date(),
            },
          })

          return Response.json({ success: true })
        } catch (error) {
          console.error('[internal/url-redirects/visit] Error:', error)
          return Response.json({ success: true })
        }
      },
    },
  },
})
