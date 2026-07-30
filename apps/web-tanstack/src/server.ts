/// <reference types="@cloudflare/workers-types" />
import handler from '@tanstack/react-start/server-entry'

interface AssetsBinding {
  fetch: (request: Request) => Promise<Response>
}

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext): Promise<Response> {
    // Make env/ctx available to TanStack via globalThis
    ;(globalThis as Record<string, unknown>).__TANSTACK_ENV = env
    ;(globalThis as Record<string, unknown>).__TANSTACK_CTX = ctx

    // Try serving static assets for GET/HEAD requests first (images, favicon, fonts, etc.)
    // Only check assets for safe methods to avoid consuming request bodies for POST/PUT
    if (request.method === 'GET' || request.method === 'HEAD') {
      const assets = env.ASSETS as AssetsBinding | undefined
      if (assets?.fetch) {
        try {
          const assetResponse = await assets.fetch(request)
          // Only serve the asset if it was actually found (not a 404)
          if (assetResponse.status !== 404) {
            return assetResponse
          }
        } catch {
          // Asset binding failed — fall through to SSR
        }
      }
    }

    // Fall back to TanStack Start SSR handler
    return handler.fetch(request) as unknown as Promise<Response>
  },
}
