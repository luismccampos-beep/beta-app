/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMiddleware } from '@tanstack/react-start'
import { getSession } from '@/lib/auth/session'
import { correlationMiddleware } from './correlation'
import { localeMiddleware } from './locale'
import { corsMiddleware } from './cors'
import { rateLimitMiddleware } from './rate-limit'
import { securityHeadersMiddleware } from './security-headers'
import { redirectsMiddleware } from './redirects'
import { notFoundLoggingMiddleware } from './404-logging'

const PROTECTED_PATHS = ['/dashboard', '/preferences']

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
}

export const rootMiddleware: any = createMiddleware({ type: 'request' })
  .middleware([
    correlationMiddleware,
    localeMiddleware,
    corsMiddleware,
    rateLimitMiddleware,
    securityHeadersMiddleware,
    redirectsMiddleware,
    notFoundLoggingMiddleware,
  ])
  .server(async ({ next, request }: any) => {
    const url = new URL(request.url)

    if (isProtectedPath(url.pathname)) {
      const session: any = await getSession()
      if (!session?.user) {
        return new Response(null, {
          status: 302,
          headers: { Location: '/auth' },
        })
      }
      return next({ context: { session } })
    }

    return next()
  })
