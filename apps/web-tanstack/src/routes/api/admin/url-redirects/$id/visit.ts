import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/api/auth'

export const Route = createFileRoute('/api/admin/url-redirects/$id/visit')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const forbidden = await requireAdmin(request)
        if (forbidden) return forbidden

        return Response.json({ success: true })
      },
    },
  },
})
