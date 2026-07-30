import { createMiddleware } from '@tanstack/react-start'

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
  const headers = new Headers(result.response.headers)
  for (const [key, value] of Object.entries(HEADERS)) {
    if (!headers.has(key)) {
      headers.set(key, value)
    }
  }
  return new Response(result.response.body, {
    status: result.response.status,
    statusText: result.response.statusText,
    headers,
  })
})
