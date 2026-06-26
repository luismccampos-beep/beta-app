import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { auth } from '@/auth-edge';
import { checkRateLimit, detectTier } from '@/lib/rate-limit';

const ALLOWED_ORIGINS = [
  'https://www.akmleva.pt',
  'https://beta.akmleva.pt',
  'http://localhost:3000',
  'http://localhost:3001',
];

const intlMiddleware = createIntlMiddleware({
  locales: ['pt', 'en', 'es', 'fr'],
  defaultLocale: 'pt',
  // Keep existing routes (no /en prefix). Locale is stored via cookie / headers.
  localePrefix: 'never',
});

// =============================================================================
// Types
// =============================================================================

interface UrlRedirect {
  id: string;
  source_path: string;
  target_path: string;
  target_id?: string;
  target_type?: string;
  http_status: number;
  visit_count: number;
  last_visited_at?: string;
  expires_at?: string;
  is_active: boolean;
}

type TenantKind = 'b2c' | 'crm';

interface TenantResolution {
  kind: TenantKind;
  agencySlug?: string;
}

// =============================================================================
// Configuration
// =============================================================================

// Cache redirects in memory for faster lookups
let redirectsCache: Map<string, UrlRedirect> = new Map();
let cacheLastUpdated = 0;
const CACHE_TTL = 60000; // 1 minute

// =============================================================================
// Helpers
// =============================================================================

async function fetchRedirects(): Promise<Map<string, UrlRedirect>> {
  const now = Date.now();
  
  // Return cached redirects if still valid
  if (now - cacheLastUpdated < CACHE_TTL && redirectsCache.size > 0) {
    return redirectsCache;
  }
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/admin/url-redirects?activeOnly=true&limit=500`, {
      next: { revalidate: 60 },
      headers: {
        // Add internal API key for server-side requests
        'x-api-key': process.env.INTERNAL_API_KEY || '',
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch redirects:', response.status);
      return redirectsCache;
    }
    
    const result = await response.json() as { success: boolean; data: UrlRedirect[] };
    
    if (result.success && result.data) {
      redirectsCache = new Map();
      for (const redirect of result.data) {
        if (redirect.is_active) {
          redirectsCache.set(redirect.source_path, redirect);
        }
      }
      cacheLastUpdated = now;
    }
  } catch (error) {
    console.error('Error fetching redirects in middleware:', error);
  }
  
  return redirectsCache;
}

function resolveTenant(request: NextRequest): TenantResolution {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const hostHeader = forwardedHost ?? request.headers.get('host') ?? '';
  const host = hostHeader.split(',')[0]?.trim().toLowerCase();

  const crmBaseHost = 'admin.oteusite.com';
  if (host === crmBaseHost) {
    return { kind: 'crm' };
  }

  if (host.endsWith(`.${crmBaseHost}`)) {
    const subdomain = host.slice(0, -(crmBaseHost.length + 1));
    const agencySlug = subdomain.split('.').filter(Boolean)[0];
    if (agencySlug) {
      return { kind: 'crm', agencySlug };
    }
    return { kind: 'crm' };
  }

  return { kind: 'b2c' };
}

function isDynamicRoute(pathname: string): boolean {
  const dynamicPatterns = [
    /^\/pacotes\/[^/]+$/,
    /^\/servicos\/[^/]+$/,
    /^\/destinos\/[^/]+$/,
    /^\/cruzeiros\/[^/]+$/,
    /^\/hotels\/[^/]+$/,
    /^\/artigos\/[^/]+$/,
    /^\/promocoes\/[^/]+$/,
  ];
  
  return dynamicPatterns.some(pattern => pattern.test(pathname));
}

async function log404(url: string, referer?: string | null) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    await fetch(`${baseUrl}/api/admin/404-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.INTERNAL_API_KEY || '',
      },
      body: JSON.stringify({
        url,
        referer,
      }),
    });
  } catch (error) {
    // Silently fail - 404 logging shouldn't break the page
    console.error('Error logging 404:', error);
  }
}

// =============================================================================
// Middleware
// =============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tenant = resolveTenant(request);

  // Auth Protection
  const session = await auth();
  const isAuthPage = pathname === '/auth';
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/preferences');

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Skip static files and _next internal paths
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    const response = NextResponse.next();
    response.headers.set('x-tenant-kind', tenant.kind);
    if (tenant.agencySlug) response.headers.set('x-agency-slug', tenant.agencySlug);
    return response;
  }

  // API routes: rate limiting + CORS
  if (pathname.startsWith('/api/')) {
    const isTravelOrAdmin = pathname.startsWith('/api/travel/') || pathname.startsWith('/api/admin/');

    // Rate limiting (travel/admin only)
    if (isTravelOrAdmin) {
      const { limiter, tier } = detectTier(request);
      const result = await checkRateLimit(request, limiter);

      if (!result.success) {
        return NextResponse.json(
          { ok: false, error: 'Too many requests', code: 'RATE_LIMITED' },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
              'X-RateLimit-Limit': String(result.limit),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Tier': tier,
            },
          }
        );
      }
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('origin') || '';
      if (origin && ALLOWED_ORIGINS.includes(origin)) {
        return new NextResponse(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Vary': 'Origin',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Correlation-Id, X-Request-Id, X-API-Key, Cache-Control',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
          },
        });
      }
      return new NextResponse(null, { status: 204 });
    }

    // CORS: only for non-admin, non-auth API routes
    const isPublicApi = !pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/auth/');
    const origin = request.headers.get('origin') || '';
    const response = NextResponse.next();

    if (isPublicApi && origin) {
      if (ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Vary', 'Origin');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Correlation-Id, X-Request-Id, X-API-Key, Cache-Control');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
    }

    response.headers.set('x-tenant-kind', tenant.kind);
    if (tenant.agencySlug) response.headers.set('x-agency-slug', tenant.agencySlug);
    return response;
  }

  const intlResponse = intlMiddleware(request);
  
  // Check for redirect first
  const redirects = await fetchRedirects();
  const redirect = redirects.get(pathname);
  
  if (redirect) {
    // Update visit count asynchronously (fire and forget)
    fetch(`/api/admin/url-redirects/${redirect.id}/visit`, {
      method: 'POST',
      headers: { 'x-api-key': process.env.INTERNAL_API_KEY || '' },
    }).catch(() => {}); // Ignore errors
    
    // Check if redirect is expired
    if (redirect.expires_at && new Date(redirect.expires_at) < new Date()) {
      // Let it 404 normally (but keep intl headers/cookies)
      const response = intlResponse;
      response.headers.set('x-tenant-kind', tenant.kind);
      if (tenant.agencySlug) response.headers.set('x-agency-slug', tenant.agencySlug);
      return response;
    }
    
    // Perform redirect
    const response = NextResponse.redirect(redirect.target_path, redirect.http_status);
    const setCookie = intlResponse.headers.get('set-cookie');
    if (setCookie) response.headers.set('set-cookie', setCookie);
    response.headers.set('x-tenant-kind', tenant.kind);
    if (tenant.agencySlug) response.headers.set('x-agency-slug', tenant.agencySlug);
    return response;
  }
  
  // Log 404s for dynamic routes (for analytics)
  if (isDynamicRoute(pathname)) {
    // Fire and forget - don't block the request
    log404(pathname, request.headers.get('referer')).catch(() => {});
  }
  
  const response = intlResponse;
  response.headers.set('x-tenant-kind', tenant.kind);
  if (tenant.agencySlug) response.headers.set('x-agency-slug', tenant.agencySlug);
  return response;
}

// =============================================================================
// Configuration
// =============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
