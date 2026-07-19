import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead, generateRoteiroJsonLd } from '@/lib/seo'

export const Route = createFileRoute('/roteiros/$slug')({
  head: ({ params }) => generatePageHead({
    title: `Roteiro ${params.slug}`,
    description: 'Itinerário de viagem personalizado.',
    path: `/roteiros/${params.slug}`,
    jsonLd: generateRoteiroJsonLd({
      name: params.slug,
      slug: params.slug,
    }),
  }),
  component: ItineraryPage,
})

function ItineraryPage() {
  const { slug } = Route.useParams()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="flex items-center px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Roteiro: {slug}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Itinerário completo para <strong>{slug}</strong> — em migração.
        </p>
      </main>
    </div>
  )
}
