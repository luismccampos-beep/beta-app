import { z } from 'zod'

export function requireInternalApiKey(request: Request): Response | null {
  const apiKey = request.headers.get('x-api-key')
  const expected = process.env.INTERNAL_API_KEY

  if (!expected) {
    return Response.json(
      { ok: false, error: 'Server misconfiguration', code: 'SERVER_MISCONFIGURATION' },
      { status: 500 },
    )
  }

  if (!apiKey || apiKey !== expected) {
    return Response.json(
      { ok: false, error: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 },
    )
  }

  return null
}

export function requireAdmin(request: Request): Response | null {
  return requireInternalApiKey(request)
}
