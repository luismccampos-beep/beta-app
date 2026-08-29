import { createMiddleware } from '@tanstack/react-start'
import { unwrapResponse } from '@/lib/middleware'

const HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security':
    'max-age=63072000; includeSubDomains; preload',
}

// Baseline CSP in report-only mode. Once violations settle, promote to
// Content-Security-Policy and remove report-only. Adjust img-src and
// font-src as you add CDNs.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://*.upstash.io https://api.akmleva.pt",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

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
  // CSP report-only: logs violations without blocking, so you can tune
  // the policy before enforcing.
  if (!headers.has('Content-Security-Policy-Report-Only')) {
    headers.set('Content-Security-Policy-Report-Only', CSP_REPORT_ONLY)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
})
