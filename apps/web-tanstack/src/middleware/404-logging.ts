import { createMiddleware } from '@tanstack/react-start'

const notFoundBatch: Array<{ path: string; userAgent?: string; referer?: string; timestamp: number }> = []
const BATCH_INTERVAL = 30_000

setInterval(async () => {
  if (notFoundBatch.length === 0) return

  const batch = notFoundBatch.splice(0)
  const internalApiKey = process.env.INTERNAL_API_KEY
  const baseUrl = process.env.VITE_BASE_URL || 'http://localhost:3002'

  if (!internalApiKey) return

  try {
    await fetch(`${baseUrl}/api/internal/404-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': internalApiKey,
      },
      body: JSON.stringify({ entries: batch }),
    })
  } catch {
    // Silently fail
  }
}, BATCH_INTERVAL)

export const notFoundLoggingMiddleware = createMiddleware().server(async ({ next, request }) => {
  const result = await next()

  // The middleware runs before the handler, so we can't intercept 404s here.
  // This is a placeholder for future implementation.
  return result
})
