import { locales, defaultLocale, type Locale } from '@/i18n.config'

const SITE_URL = import.meta.env.VITE_BASE_URL || 'https://www.akmleva.pt'

interface HeadOptions {
  title?: string
  description?: string
  image?: string
  path?: string
  locale?: Locale
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

function getAlternateLinks(path: string) {
  return locales.map((locale) => ({
    rel: 'alternate' as const,
    hrefLang: locale,
    href: `${SITE_URL}${locale === defaultLocale ? '' : `/${locale}`}${path}`,
  }))
}

export function generatePageHead(opts: HeadOptions) {
  const locale = opts.locale || defaultLocale
  const path = opts.path || ''
  const title = opts.title ? `${opts.title} | AKMLEVA` : 'AKMLEVA'
  const description = opts.description || 'Viaje mais e planeie melhor com inteligência artificial'
  const image = opts.image || `${SITE_URL}/images/og-placeholder.svg`

  const meta = [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: opts.title || 'AKMLEVA' },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: locale === 'pt' ? 'pt_PT' : locale },
    { property: 'og:site_name', content: 'AKMLEVA' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: opts.title || 'AKMLEVA' },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]

  if (opts.noindex) {
    meta.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  const links = [
    { rel: 'canonical', href: `${SITE_URL}${path}` },
    ...getAlternateLinks(path),
    { rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}${path}` },
  ]

  const scripts = opts.jsonLd
    ? [{ type: 'application/ld+json' as const, children: JSON.stringify(opts.jsonLd) }]
    : []

  return { meta, links, scripts }
}

export function generateDestinationJsonLd(dest: {
  name: string
  slug: string
  description?: string
  image?: string
  country?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: dest.name,
    description: dest.description,
    image: dest.image ? `${SITE_URL}${dest.image}` : undefined,
    url: `${SITE_URL}/destinos/${dest.slug}`,
    touristType: 'Leisure',
    ...(dest.country && { address: { '@type': 'PostalAddress', addressCountry: dest.country } }),
  }
}

export function generateRoteiroJsonLd(roteiro: {
  name: string
  slug: string
  description?: string
  destination?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Trip',
    name: roteiro.name,
    description: roteiro.description,
    url: `${SITE_URL}/roteiros/${roteiro.slug}`,
    ...(roteiro.destination && { touristDestination: roteiro.destination }),
  }
}
