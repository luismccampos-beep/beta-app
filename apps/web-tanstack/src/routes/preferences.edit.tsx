import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/lib/auth/session'
import { EnhancedTravelPreferencesForm } from '@/components/pages/EnhancedTravelPreferencesForm'

export const Route = createFileRoute('/preferences/edit')({
  head: () => ({
    meta: [
      { title: 'Preferências — AKMLEVA' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSession()
    if (!session?.user) {
      throw redirect({ to: '/auth' })
    }
  },
  component: EnhancedTravelPreferencesForm,
})
