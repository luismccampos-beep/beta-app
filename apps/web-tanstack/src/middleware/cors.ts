import { createMiddleware } from '@tanstack/react-start'

const ALLOWED_ORIGINS = [
  'https://www.akmleva.pt',
  'https://beta.akmleva.pt',
  'https://akmleva.pt',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
]

function corsHeaders(origin: string): Record<string, string> {
  const allowed = ALLOWED_ORIGINS.includes(origin)
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-api-key',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  }
}

export const corsMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const origin = request.headers.get('origin') ?? ''
    const url = new URL(request.url)
    const isAPI = url.pathname.startsWith('/api')

    if (!isAPI) return next()

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      })
    }

    const result = await next()
    const headers = new Headers(result.response.headers)
    const cors = corsHeaders(origin)
    for (const [key, value] of Object.entries(cors)) {
      if (!headers.has(key)) {
        headers.set(key, value)
      }
    }
    return new Response(result.response.body, {
      status: result.response.status,
      statusText: result.response.statusText,
      headers,
    })
  },
)
