import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/api/auth'

export const Route = createFileRoute('/api/admin/url-redirects/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authError = requireAdmin(request)
        if (authError) return authError

        return Response.json({ ok: true, redirects: [] })
      },
    },
  },
})
