import { createHash, timingSafeEqual } from 'node:crypto'

// ── Startup validation (runs once on module load) ──────────────────────────
const _key = process.env.INTERNAL_API_KEY?.trim()
if (!_key) {
  console.error(
    '[auth] INTERNAL_API_KEY is not set. Admin endpoints and the internal\n' +
    '       API key bypass will return 500. Set it in .env / wrangler secret.',
  )
} else if (_key.length < 16) {
  console.warn(
    '[auth] INTERNAL_API_KEY is very short (<16 chars). Use a long random string.',
  )
} else if (/^(test|dev|placeholder|changeme)/i.test(_key)) {
  console.warn(
    '[auth] INTERNAL_API_KEY looks like a placeholder. Rotate it before deploying to production.',
  )
}
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn(
    '[auth] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing.\n' +
    '       Rate limiting is silently disabled in production without them.',
  )
}

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
