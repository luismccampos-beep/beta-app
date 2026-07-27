import {
  HeadContent,
  Outlet,
  Scripts,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { ThemeProvider } from '../components/ThemeProvider'
import { CookieBanner } from '../components/CookieBanner'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { I18nProvider } from '@/lib/i18n-provider'
import { locales, defaultLocale, type Locale } from '@/i18n.config'
import '../globals.css'

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme-mode');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch(e) {}
  })();
`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'AKMLEVA' },
      { name: 'description', content: 'Viaje mais e planeie melhor com inteligência artificial' },
      { property: 'og:title', content: 'AKMLEVA' },
      { property: 'og:description', content: 'Viaje mais e planeie melhor com inteligência artificial' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'pt_PT' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'canonical', href: 'https://www.akmleva.pt' },
      ...locales.filter((l) => l !== defaultLocale).map((l) => ({
        rel: 'alternate' as const,
        hrefLang: l,
        href: `https://www.akmleva.pt`,
      })),
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://www.akmleva.pt' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 font-sans antialiased">
        <ThemeProvider>
          <I18nProvider locale={defaultLocale}>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
            >
              Skip to main content
            </a>
            <div id="main-content" className="pb-16 sm:pb-0">
              <Outlet />
            </div>
            <Footer />
            <BottomNav />
            <CookieBanner />
          </I18nProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AKMLEVA
          </div>
          <p className="text-gray-400 max-w-sm mx-auto text-sm">
            Viaje mais e planeie melhor com a nossa inteligência artificial.
          </p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />
        <div className="flex items-center justify-center gap-x-6 gap-y-3 flex-wrap text-sm font-bold uppercase tracking-widest">
          <a href="/destinations" className="text-gray-400 hover:text-blue-300 transition-colors">Destinos</a>
          <span className="text-gray-700">·</span>
          <a href="/about" className="text-gray-400 hover:text-blue-300 transition-colors">Sobre</a>
          <span className="text-gray-700">·</span>
          <a href="/contact" className="text-gray-400 hover:text-blue-300 transition-colors">Contacto</a>
          <span className="text-gray-700">·</span>
          <a href="/faq" className="text-gray-400 hover:text-blue-300 transition-colors">FAQ</a>
          <span className="text-gray-700">·</span>
          <a href="/legal/terms" className="text-gray-400 hover:text-blue-300 transition-colors">Termos</a>
          <span className="text-gray-700">·</span>
          <a href="/legal/privacy" className="text-gray-400 hover:text-blue-300 transition-colors">Privacidade</a>
        </div>
        <div className="text-center text-gray-400 text-sm mt-12">
          © {new Date().getFullYear()} AKMLEVA. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around py-2">
        <a href="/" className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Home
        </a>
        <a href="/destinations" className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Pesquisar
        </a>
        <a href="/dashboard" className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Dashboard
        </a>
        <a href="/preferences/edit" className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Definições
        </a>
      </div>
    </nav>
  )
}
