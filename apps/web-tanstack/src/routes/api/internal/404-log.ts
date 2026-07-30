import { createFileRoute } from '@tanstack/react-router'
import { requireInternalApiKey } from '@/lib/api/auth'

export const Route = createFileRoute('/api/internal/404-log')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = requireInternalApiKey(request)
        if (denied) return denied

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
