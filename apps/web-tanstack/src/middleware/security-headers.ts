import { createMiddleware } from '@tanstack/react-start'
import { unwrapResponse } from '@/lib/middleware'

const HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security':
    'max-age=63072000; includeSubDomains; preload',
}

export const securityHeadersMiddleware = createMiddleware({
  type: 'request',
}).server(async ({ next }) => {
  const result = await next()
  const response = unwrapResponse(result)
  if (!response) return result

  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(HEADERS)) {
    if (!headers.has(key)) {
      headers.set(key, value)
    }
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
})
