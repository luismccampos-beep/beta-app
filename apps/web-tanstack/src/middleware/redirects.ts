import { createMiddleware } from '@tanstack/react-start'

interface UrlRedirect {
  id: string
  source_path: string
  target_path: string
  http_status: number
  is_active: boolean
  expires_at: string | null
  visit_count: number
}

const CACHE_TTL = 60_000 // 60 seconds
let redirectsCache: Map<string, UrlRedirect> = new Map()
let cacheLastUpdated = 0

async function fetchRedirects(): Promise<Map<string, UrlRedirect>> {
  const now = Date.now()
  if (now - cacheLastUpdated < CACHE_TTL && redirectsCache.size > 0) {
    return redirectsCache
  }

  const apiKey = process.env.INTERNAL_API_KEY
  if (!apiKey) return redirectsCache

  try {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://www.akmleva.pt'
        : 'http://localhost:3000'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(
      `${baseUrl}/api/internal/url-redirects?activeOnly=true&limit=500`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      },
    )
    clearTimeout(timeout)

    if (response.ok) {
      const result = (await response.json()) as { data: UrlRedirect[] }
      redirectsCache = new Map()
      for (const redirect of result.data) {
        if (redirect.is_active) {
          redirectsCache.set(redirect.source_path, redirect)
        }
      }
      cacheLastUpdated = now
    }
  } catch (error) {
    console.error('Error fetching redirects in middleware:', error)
  }

  return redirectsCache
}

export const redirectsMiddleware = createMiddleware({
  type: 'request',
}).server(async ({ next, request }) => {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Skip for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.')
  ) {
    return next()
  }

  const redirects = await fetchRedirects()
  const redirect = redirects.get(pathname)

  if (redirect) {
    // Fire-and-forget visit tracking
    try {
      const apiKey = process.env.INTERNAL_API_KEY
      const baseUrl =
        process.env.NODE_ENV === 'production'
          ? 'https://www.akmleva.pt'
          : 'http://localhost:3000'
      fetch(`${baseUrl}/api/internal/url-redirects/${redirect.id}/visit`, {
        method: 'POST',
        headers: { 'x-api-key': apiKey ?? '' },
      }).catch(() => {})
    } catch {}

    // Check if redirect is expired
    if (redirect.expires_at && new Date(redirect.expires_at) < new Date()) {
      return next()
    }

    // Perform redirect
    return new Response(null, {
      status: redirect.http_status || 301,
      headers: { Location: redirect.target_path },
    })
  }

  return next()
})
