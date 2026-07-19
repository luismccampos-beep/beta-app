import { z } from 'zod'

type HandlerFn = (ctx: { request: Request; data?: unknown }) => Promise<Response>

function addCacheHeaders(res: Response, cacheControl?: string): Response {
  if (res.headers.has('Cache-Control')) return res
  const headers = new Headers(res.headers)
  headers.set('Cache-Control', cacheControl || 'private, no-store, max-age=0')
  headers.set('Vary', 'Accept-Encoding')
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
}

export function apiHandler(fn: HandlerFn, opts?: { cache?: string }) {
  return async ({ request }: { request: Request }) => {
    try {
      const res = await fn({ request })
      if (request.method === 'GET') {
        return addCacheHeaders(res, opts?.cache)
      }
      return res
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { ok: false, error: 'Validation failed', issues: error.issues },
          { status: 400 },
        )
      }
      console.error('[api]', error)
      return Response.json(
        { ok: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 },
      )
    }
  }
}

export function apiHandlerWithBody<T>(schema: z.ZodSchema<T>, fn: (ctx: { request: Request; data: T }) => Promise<Response>, opts?: { cache?: string }) {
  return apiHandler(async ({ request }) => {
    const body = await request.json()
    const data = schema.parse(body)
    return fn({ request, data })
  }, opts)
}
