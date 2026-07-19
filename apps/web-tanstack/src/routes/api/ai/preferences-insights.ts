import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/ai/preferences-insights')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          // TODO: Call ML service unifiedQuery
          return Response.json({ insights: [] })
        } catch {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }
      },
    },
  },
})
