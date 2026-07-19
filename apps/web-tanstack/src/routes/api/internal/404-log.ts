import { createFileRoute } from '@tanstack/react-router'
import { requireInternalApiKey } from '@/lib/api/auth'

export const Route = createFileRoute('/api/internal/404-log')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authError = requireInternalApiKey(request)
        if (authError) return authError

        return Response.json({ ok: true })
      },
    },
  },
})
