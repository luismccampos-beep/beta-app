import { createMiddleware } from '@tanstack/react-start'

export const redirectsMiddleware = createMiddleware().server(async ({ next }) => {
  return next()
})
