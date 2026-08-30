import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/csp-report')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          console.warn('[csp-report]', JSON.stringify(body, null, 2))
        } catch {
          console.warn('[csp-report] (unparseable body)')
        }
        return new Response(null, { status: 204 })
      },
    },
  },
})
