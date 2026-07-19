import { createFileRoute, notFound } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'

const VALID_PAGES = ['terms', 'privacy', 'gdpr', 'cancellations', 'cookies'] as const
type PageType = (typeof VALID_PAGES)[number]

const PAGE_TITLES: Record<PageType, string> = {
  terms: 'Termos e Condições',
  privacy: 'Política de Privacidade',
  gdpr: 'Regulamento Geral sobre a Proteção de Dados',
  cancellations: 'Política de Cancelamento',
  cookies: 'Política de Cookies',
}

export const Route = createFileRoute('/legal/$pageType')({
  head: ({ params }) => {
    const title = PAGE_TITLES[params.pageType as PageType]
    return generatePageHead({
      title: title || 'Legal',
      description: `${title} da AKMLEVA.`,
      path: `/legal/${params.pageType}`,
    })
  },
  component: LegalPage,
})

function LegalPage() {
  const { pageType } = Route.useParams()

  if (!VALID_PAGES.includes(pageType as PageType)) {
    throw notFound()
  }

  const typedPageType = pageType as PageType

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">
          {PAGE_TITLES[typedPageType]}
        </h1>
        <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
          <p>Conteúdo de {PAGE_TITLES[typedPageType]} — em migração.</p>
        </div>
        <div className="mt-12">
          <a href="/" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
            ← Voltar ao início
          </a>
        </div>
      </main>
    </div>
  )
}
