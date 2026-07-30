import { createFileRoute } from '@tanstack/react-router'
import { QuickPreferencesForm } from '@/components/pages/QuickPreferencesForm'

export const Route = createFileRoute('/preferences/quick')({
  head: () => ({
    meta: [
      { title: 'Preferências Rápidas — AKMLEVA' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: QuickPreferencesForm,
})
