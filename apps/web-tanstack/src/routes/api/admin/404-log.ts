import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/api/auth'

export const Route = createFileRoute('/api/admin/404-log')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const forbidden = await requireAdmin(request)
        if (forbidden) return forbidden

        try {
          const body = (await request.json()) as { url?: string; referer?: string; entries?: Array<{ url?: string; referer?: string }> }

          const entries = body.entries ? body.entries : [body]

          for (const entry of entries) {
            console.debug('[404-log]', entry.url, entry.referer ?? '')
          }

          return Response.json({ success: true, logged: entries.length })
        } catch {
          return Response.json({ success: true })
        }
      },
    },
  },
})
