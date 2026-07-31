import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ResultsPage } from '@/components/pages/ResultsPage'

function ResultsRoute() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } finally {
      await router.navigate({ to: '/auth', replace: true })
    }
  }

  return (
    <ResultsPage
      onLogout={() => void handleLogout()}
      onNavigateToDashboard={() => void router.navigate({ to: '/dashboard' })}
    />
  )
}

export const Route = createFileRoute('/results')({
  head: () => ({
    meta: [
      { title: 'Resultados — AKMLEVA' },
      { name: 'description', content: 'Resultados de pesquisa de viagens.' },
    ],
  }),
  component: ResultsRoute,
})
