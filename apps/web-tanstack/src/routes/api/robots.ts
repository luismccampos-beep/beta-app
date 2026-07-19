import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/robots')({
  server: {
    handlers: {
      GET: () => {
        const content = [
          'User-agent: *',
          'Allow: /',
          'Disallow: /api/',
          'Disallow: /auth/',
          'Disallow: /dashboard/',
          'Disallow: /preferences/',
          '',
          'Sitemap: https://www.akmleva.pt/api/sitemap',
        ].join('\n')

        return new Response(content, {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400',
          },
        })
      },
    },
  },
})
