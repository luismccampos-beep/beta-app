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

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.set('x-forwarded-host', url.host)

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      signal: AbortSignal.timeout(30000),
    })

    const responseHeaders = new Headers(res.headers)
    responseHeaders.set('Access-Control-Allow-Origin', '*')

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
