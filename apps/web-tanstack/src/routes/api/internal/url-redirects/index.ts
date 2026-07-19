import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@akmleva/db'
import { requireInternalApiKey } from '@/lib/api/auth'

export const Route = createFileRoute('/api/internal/url-redirects/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authError = requireInternalApiKey(request)
        if (authError) return authError

        return Response.json({ ok: true, redirects: [] })
      },
    },
  },
})
