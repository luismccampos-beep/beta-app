import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'

export const Route = createFileRoute('/destinations')({
  head: () => generatePageHead({
    title: 'Destinos',
    description: 'Explore milhares de destinos de viagem com dados reais e reviews.',
    path: '/destinations',
  }),
  component: DestinationsPage,
})

function DestinationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="flex items-center px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explorar Destinos</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Descubra destinos de viagem por país, continente ou interesses.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
