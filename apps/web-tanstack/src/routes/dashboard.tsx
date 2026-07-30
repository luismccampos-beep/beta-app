import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/components/pages/DashboardPage'

function DashboardRoute() {
  return (
    <DashboardPage
      onBack={() => window.history.back()}
      onNewBooking={() => {}}
      initialTab="bookings"
      onLogout={() => {}}
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
  component: DashboardRoute,
})
