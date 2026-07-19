import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/health/')({
  server: {
    handlers: {
      GET: () => {
        return Response.json({
          ok: true,
          env: process.env.TRAVEL_CATALOG_SOURCE ?? 'not-set',
          timestamp: new Date().toISOString(),
        })
      },
    },
  },
})
