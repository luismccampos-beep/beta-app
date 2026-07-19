import { createMiddleware } from '@tanstack/react-start'

export const tenantMiddleware = createMiddleware().server(async ({ next, request }) => {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  const isCRM = host.startsWith('admin.') || host.includes('oteusite.com')

  return next({
    context: {
      tenant: {
        kind: (isCRM ? 'crm' : 'b2c') as 'b2c' | 'crm',
        agencySlug: isCRM ? host.split('.')[0] : undefined,
      },
    },
  })
})
