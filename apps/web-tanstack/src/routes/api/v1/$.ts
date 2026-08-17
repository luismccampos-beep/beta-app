import { createFileRoute } from '@tanstack/react-router'

const API_V1_URL = process.env.API_V1_URL || 'https://api.akmleva.pt'

export const Route = createFileRoute('/api/v1/$')({
  server: {
    handlers: {
      GET: async ({ request }) => proxyRequest(request),
      POST: async ({ request }) => proxyRequest(request),
      PUT: async ({ request }) => proxyRequest(request),
      DELETE: async ({ request }) => proxyRequest(request),
    },
  },
})

async function proxyRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const targetUrl = `${API_V1_URL}${url.pathname}${url.search}`

  const headers = new Headers()
  // Forward only safe headers — never client credentials to the upstream API.
  const allowedHeaders = [
    'accept',
    'accept-language',
    'content-type',
    'content-length',
    'if-none-match',
    'if-modified-since',
    'user-agent',
  ]
  for (const name of allowedHeaders) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }
  headers.delete('host')
  headers.set('x-forwarded-host', url.host)
  if (process.env.INTERNAL_API_KEY) {
    headers.set('x-api-key', process.env.INTERNAL_API_KEY)
  }

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      signal: AbortSignal.timeout(30000),
    })

    const responseHeaders = new Headers(res.headers)
    // Do not mirror upstream CORS or add a wildcard ACAO — the app-level
    // CORS middleware owns cross-origin handling.
    responseHeaders.delete('access-control-allow-origin')

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('[proxy]', error)
    return Response.json({ ok: false, error: 'Upstream unavailable' }, { status: 502 })
  }
}
