import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@akmleva/db'

const SITE_URL = process.env.VITE_BASE_URL || 'https://www.akmleva.pt'

function generateSitemapXml(urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[]) {
  const urlElements = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`
}

export const Route = createFileRoute('/api/sitemap')({
  server: {
    handlers: {
      GET: async () => {
        const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[] = []

        const staticPages = [
          { path: '/', changefreq: 'daily', priority: 1.0 },
          { path: '/about', changefreq: 'monthly', priority: 0.8 },
          { path: '/contact', changefreq: 'monthly', priority: 0.8 },
          { path: '/faq', changefreq: 'monthly', priority: 0.8 },
          { path: '/destinations', changefreq: 'daily', priority: 0.9 },
          { path: '/legal/terms', changefreq: 'yearly', priority: 0.3 },
          { path: '/legal/privacy', changefreq: 'yearly', priority: 0.3 },
        ]

        for (const page of staticPages) {
          urls.push({
            loc: `${SITE_URL}${page.path}`,
            changefreq: page.changefreq,
            priority: page.priority,
          })
        }

        try {
          const destinations = await prisma.wvDestination.findMany({
            select: { slug: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 10000,
          })

          for (const dest of destinations) {
            urls.push({
              loc: `${SITE_URL}/destinos/${dest.slug}`,
              lastmod: dest.updatedAt.toISOString(),
              changefreq: 'weekly',
              priority: 0.7,
            })
          }
        } catch {
          // DB not available in build
        }

        try {
          const trips = await prisma.trip.findMany({
            where: { deletedAt: null },
            select: { slug: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 10000,
          })

          for (const trip of trips) {
            if (trip.slug) {
              urls.push({
                loc: `${SITE_URL}/roteiros/${trip.slug}`,
                lastmod: trip.updatedAt.toISOString(),
                changefreq: 'weekly',
                priority: 0.6,
              })
            }
          }
        } catch {
          // DB not available in build
        }

        const sitemap = generateSitemapXml(urls)

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
