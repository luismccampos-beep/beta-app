import { createMiddleware } from '@tanstack/react-start'

export const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next()
  return result
})
