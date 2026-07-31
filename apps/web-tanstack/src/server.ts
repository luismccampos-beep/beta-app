/// <reference types="@cloudflare/workers-types" />
import handler from '@tanstack/react-start/server-entry'

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext): Promise<Response> {
    ;(globalThis as Record<string, unknown>).__TANSTACK_ENV = env
    ;(globalThis as Record<string, unknown>).__TANSTACK_CTX = ctx

    return handler.fetch(request) as unknown as Promise<Response>
  },
}
