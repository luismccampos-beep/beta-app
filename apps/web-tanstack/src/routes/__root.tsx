import {
  HeadContent,
  Outlet,
  Scripts,
  ScrollRestoration,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { ThemeProvider } from '../components/ThemeProvider'
import { CookieBanner } from '../components/CookieBanner'
import { I18nProvider, createTranslationsHook } from '@/lib/i18n-provider'
import { AppFooter } from '../components/AppFooter'
import { AppBottomNav } from '../components/AppBottomNav'
import { AppHeader } from '../components/AppHeader'
import { Toaster } from '../components/Toaster'
import { locales, defaultLocale, isValidLocale, type Locale } from '@/i18n.config'
import '../globals.css'
// SCSS must come after globals.css so component styles can override Tailwind defaults
import '../styles/main.scss'

const SITE_URL = import.meta.env.VITE_BASE_URL || 'https://www.akmleva.pt'

// Inline script that applies the dark theme before first paint to eliminate flash.
// Runs synchronously, reads localStorage + system preference.
// safe because <html> has suppressHydrationWarning.
const themeScript = `
(function(){try{var m=localStorage.getItem('theme-mode');if(m==='dark'||(!m&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`

export const Route = createRootRoute({
  beforeLoad: ({ context }: { context: { locale?: string } }) => {
    // Locale comes from the localeMiddleware in start.ts
    const locale = context.locale && isValidLocale(context.locale)
      ? context.locale
      : defaultLocale
    return { locale }
  },
  head: ({ loaderData }: { loaderData?: { locale?: string } }) => {
    const locale = loaderData?.locale && isValidLocale(loaderData.locale)
      ? loaderData.locale
      : defaultLocale
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: 'AKMLEVA' },
        { name: 'description', content: 'Viaje mais e planeie melhor com inteligência artificial' },
        { property: 'og:title', content: 'AKMLEVA' },
        { property: 'og:description', content: 'Viaje mais e planeie melhor com inteligência artificial' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: locale === 'pt' ? 'pt_PT' : locale },
      ],
      links: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'canonical', href: SITE_URL },
        ...locales.filter((l) => l !== defaultLocale).map((l) => ({
          rel: 'alternate' as const,
          hrefLang: l,
          href: SITE_URL,
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: SITE_URL },
      ],
    }
  },
  component: RootComponent,
})

const useT = createTranslationsHook('common')

function RootComponent() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { locale: contextLocale } = Route.useRouteContext()
  const locale: Locale = contextLocale && isValidLocale(contextLocale) ? contextLocale : defaultLocale
  const t = useT()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 font-sans antialiased">
        <ThemeProvider>
          <I18nProvider locale={locale}>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
            >
              {t('skipToMainContent')}
            </a>
            <AppHeader currentPath={currentPath} />
            <main id="main-content" className="pb-16 sm:pb-0">
              <Outlet />
            </main>
            <AppFooter />
            <AppBottomNav currentPath={currentPath} />
            <CookieBanner />
          </I18nProvider>
        </ThemeProvider>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
