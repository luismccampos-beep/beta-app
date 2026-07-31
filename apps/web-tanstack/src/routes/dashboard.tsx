import { createFileRoute, useRouter, redirect } from '@tanstack/react-router'
import { DashboardPage } from '@/components/pages/DashboardPage'
import { getSession } from '@/lib/auth/session'

function DashboardRoute() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } finally {
      await router.navigate({ to: '/auth', replace: true })
    }
  }

  return (
    <DashboardPage
      onBack={() => void router.navigate({ to: '/' })}
      onNewBooking={() => void router.navigate({ to: '/preferences/quick' })}
      onViewBooking={(bookingId) => void router.navigate({ to: '/results', search: { bookingId } as never })}
      initialTab="bookings"
      onLogout={() => void handleLogout()}
    />
  )
}

export const Route = createFileRoute('/dashboard')({
  head: () => ({
    meta: [
      { title: 'Dashboard — AKMLEVA' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSession()
    if (!session?.user) {
      throw redirect({ to: '/auth' })
    }
  },
  component: DashboardRoute,
})
