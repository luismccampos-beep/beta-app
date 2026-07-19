import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'

export const Route = createFileRoute('/results')({
  head: () => generatePageHead({
    title: 'Resultados',
    description: 'Resultados da pesquisa de viagem.',
    path: '/results',
  }),
  component: ResultsPage,
})

function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="flex items-center px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Resultados</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Resultados da sua pesquisa — em migração.
        </p>
      </main>
    </div>
  )
}
