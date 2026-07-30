import { createFileRoute, redirect } from '@tanstack/react-router'
import { EnhancedTravelPreferencesForm } from '@/components/pages/EnhancedTravelPreferencesForm'

export const Route = createFileRoute('/preferences/edit')({
  head: () => ({
    meta: [
      { title: 'Preferências — AKMLEVA' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  beforeLoad: async () => {
    // Auth guard placeholder
  },
  component: EnhancedTravelPreferencesForm,
})
