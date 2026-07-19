import { createMiddleware } from '@tanstack/react-start'
import { locales, defaultLocale, type Locale } from '@/i18n.config'

export const localeMiddleware = createMiddleware().server(async ({ next, request }) => {
  // Priority: cookie > Accept-Language > default
  const cookieLocale = request.headers
    .get('cookie')
    ?.match(/locale=([^;]+)/)?.[1] as Locale | undefined

  const acceptLang = request.headers
    .get('accept-language')
    ?.split(',')
    .map((l) => l.split('-')[0]?.trim())
    .find((l): l is Locale => !!l && (locales as readonly string[]).includes(l))

  const locale = cookieLocale && (locales as readonly string[]).includes(cookieLocale)
    ? cookieLocale
    : acceptLang && (locales as readonly string[]).includes(acceptLang)
      ? acceptLang
      : defaultLocale

  return next({ context: { locale } })
})
