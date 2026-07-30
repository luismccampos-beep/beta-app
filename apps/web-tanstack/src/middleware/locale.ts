import { createMiddleware } from '@tanstack/react-start'
import { locales, defaultLocale, type Locale } from '@/i18n.config'

export const localeMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const cookieLocale = request.headers
      .get('cookie')
      ?.match(/locale=([^;]+)/)?.[1] as Locale | undefined

    const acceptLang = request.headers
      .get('accept-language')
      ?.split(',')
      .map((l) => l.split('-')[0]?.trim())
      .find(
        (l): l is Locale =>
          !!l && (locales as readonly string[]).includes(l),
      )

    const locale =
      cookieLocale &&
      (locales as readonly string[]).includes(cookieLocale)
        ? cookieLocale
        : acceptLang &&
            (locales as readonly string[]).includes(acceptLang)
          ? acceptLang
          : defaultLocale

    const result = await next({ context: { locale } })
    return result
  },
)
