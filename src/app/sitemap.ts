import type { MetadataRoute } from 'next';
import { locales } from '@/i18n.config';

const siteUrl = 'https://www.akmleva.pt';

const staticRoutes = ['', '/about', '/contact', '/faq', '/destinations', '/legal/terms', '/legal/privacy', '/legal/gdpr', '/legal/cancellations', '/legal/cookies'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    entries.push({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1.0 : route.startsWith('/legal/') ? 0.5 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteUrl}${route}`]),
        ),
      },
    });
  }

  return entries;
}
