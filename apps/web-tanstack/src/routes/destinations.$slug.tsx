import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead, generateDestinationJsonLd } from '@/lib/seo'

export const Route = createFileRoute('/destinations/$slug')({
  head: ({ params }) => generatePageHead({
    title: `Destino ${params.slug}`,
    description: 'Detalhe do destino de viagem.',
    path: `/destinations/${params.slug}`,
    jsonLd: generateDestinationJsonLd({
      name: params.slug,
      slug: params.slug,
    }),
  }),
  component: DestinationDetailPage,
})

function DestinationDetailPage() {
  const { slug } = Route.useParams()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="flex items-center px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <a href="/destinations" className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Todos os destinos
        </a>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {slug}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Portugal</p>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <p className="text-gray-600 dark:text-gray-400">
            Detalhe de <strong>{slug}</strong> — em migração.
          </p>
        </div>
      </main>
    </div>
  )
}
