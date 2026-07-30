import { createFileRoute } from '@tanstack/react-router'
import { ResultsPage } from '@/components/pages/ResultsPage'

function ResultsRoute() {
  return (
    <ResultsPage
      onLogout={() => {}}
      onNavigateToDashboard={() => {}}
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
