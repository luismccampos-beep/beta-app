import { createMiddleware } from '@tanstack/react-start'
import { unwrapResponse } from '@/lib/middleware'

const notFoundBatch: Array<{
  path: string
  userAgent?: string
  referer?: string
  timestamp: number
}> = []
const BATCH_INTERVAL = 30_000
let flushScheduled = false

function scheduleFlush() {
  if (flushScheduled) return
  flushScheduled = true

  setTimeout(async () => {
    flushScheduled = false
    if (notFoundBatch.length === 0) return

    const batch = notFoundBatch.splice(0)
    const internalApiKey = process.env.INTERNAL_API_KEY
    const baseUrl = process.env.VITE_BASE_URL || 'http://localhost:3002'

    // Avoid self-fetching in development to prevent deadlocks
    if (process.env.NODE_ENV !== 'production') return
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
}

export function logNotFound(path: string, userAgent?: string, referer?: string) {
  notFoundBatch.push({ path, userAgent, referer, timestamp: Date.now() })
  scheduleFlush()
}

export const notFoundLoggingMiddleware = createMiddleware({
  type: 'request',
}).server(async ({ next, request }) => {
  const result = await next()
  const url = new URL(request.url)

  // Log 404s from the response
  const response = unwrapResponse(result)
  if (response && response.status === 404 && !url.pathname.startsWith('/api')) {
    logNotFound(
      url.pathname,
      request.headers.get('user-agent') ?? undefined,
      request.headers.get('referer') ?? undefined,
    )
  }

  return result
})
