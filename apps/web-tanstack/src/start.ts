/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStart } from '@tanstack/react-start'
import { rootMiddleware } from './middleware'

export const startInstance: any = createStart(() => ({
  requestMiddleware: [rootMiddleware],
}))
