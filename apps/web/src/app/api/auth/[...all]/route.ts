import { auth } from '@/lib/auth/auth'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  return auth.handler(request)
}

export { handler as GET, handler as POST }
