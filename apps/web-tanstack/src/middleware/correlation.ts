import { createMiddleware } from '@tanstack/react-start'

// crypto.randomUUID() works in Node 19+, Cloudflare Workers, and modern browsers.
const newRequestId = () => crypto.randomUUID()

/**
 * Injects or propagates a ``x-request-id`` header on every request.
 *
 * - If the incoming request already has ``x-request-id``, it is preserved
 *   so distributed traces span service boundaries.
 * - Otherwise, a new UUID v4 is generated.
 * - The resolved ID is stored in ``context.requestId`` for downstream
 *   middleware, server functions, and the ML client.
 * - The ID is also attached to outgoing Response headers so clients and
 *   load-balancers can reference it.
 */
export const correlationMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const incoming = request.headers.get('x-request-id')
    const requestId = incoming?.trim() || newRequestId()

    const result = await next({ context: { requestId } })

    // Stamp outgoing responses so the client / CDN can match requests.
    const resp = result as Response | { response?: Response; headers?: Headers }
    if (resp instanceof Response) {
      resp.headers.set('x-request-id', requestId)
    }

    return result
  },
)