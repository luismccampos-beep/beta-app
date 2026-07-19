import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './ThemeProvider'
import { I18nProvider } from '@/lib/i18n-provider'
import { type Locale, defaultLocale } from '@/i18n.config'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

interface ProvidersProps {
  children: ReactNode
  locale?: Locale
}

export function Providers({ children, locale = defaultLocale }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider locale={locale}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}
