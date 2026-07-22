import { createMiddleware } from '@tanstack/react-start'
import { authGuard } from './auth-guard'

export const adminGuard = createMiddleware()
  .middleware([authGuard])
  .server(async ({ next, context }) => {
    const session = context.session as unknown as { user: { role?: string } }
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'admin') {
      throw new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return next()
  })
