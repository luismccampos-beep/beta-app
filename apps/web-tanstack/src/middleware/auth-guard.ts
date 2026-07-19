import { createMiddleware } from '@tanstack/react-start'
import { getSession } from '@/lib/auth/session'

export const authGuard = createMiddleware().server(async ({ next }) => {
  const session = await getSession()
  if (!session?.user) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/auth' },
    })
  }
  return next({ context: { session } })
})
