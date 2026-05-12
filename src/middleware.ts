import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

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
  
  // Skip API routes, static files, and _next internal paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    const response = NextResponse.next();
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
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
