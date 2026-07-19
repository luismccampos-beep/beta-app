import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/health/ml-status')({
  server: {
    handlers: {
      GET: async () => {
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000'
        try {
          const res = await fetch(`${mlServiceUrl}/health`, { signal: AbortSignal.timeout(5000) })
          const data = await res.json()
          return Response.json({ ok: true, ml: data })
        } catch {
          return Response.json({ ok: false, ml: { status: 'unreachable' } }, { status: 503 })
        }
      },
    },
  },
})
