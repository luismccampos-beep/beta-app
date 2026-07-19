import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/travel/v1/recommend')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({ data: [] })
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          // TODO: Call ML service
          return Response.json({ data: [] })
        } catch {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }
      },
    },
  },
})
