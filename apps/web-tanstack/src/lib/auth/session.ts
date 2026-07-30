import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Awaited<ReturnType<typeof auth.api.getSession>> | null> => {
    const headers = getRequestHeaders()
    try {
      const session = await auth.api.getSession({ headers })
      return session
    } catch {
      return null
    }
  },
)

export const requireSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Awaited<ReturnType<typeof auth.api.getSession>>> => {
    const session = await getSession()
    if (!session) {
      throw new Error('Unauthorized')
    }
    return session
  },
)
