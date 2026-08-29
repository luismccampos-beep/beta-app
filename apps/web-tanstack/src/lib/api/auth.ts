import { createHash, timingSafeEqual } from 'node:crypto'

/**
 * Constant-time comparison of two strings via SHA-256 digest.
 * Avoids timing attacks that `!==` is vulnerable to on short secrets.
 */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a, 'utf8').digest()
  const hb = createHash('sha256').update(b, 'utf8').digest()
  return timingSafeEqual(ha, hb)
}

export function requireInternalApiKey(request: Request): Response | null {
  const apiKey = request.headers.get('x-api-key')
  const expected = process.env.INTERNAL_API_KEY?.trim()

  if (!expected) {
    return Response.json(
      { ok: false, error: 'Server misconfiguration', code: 'SERVER_MISCONFIGURATION' },
      { status: 500 },
    )
  }

  if (!apiKey || !safeEqual(apiKey, expected)) {
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
