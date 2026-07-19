import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'

export const Route = createFileRoute('/faq')({
  head: () => generatePageHead({
    title: 'Perguntas Frequentes',
    description: 'Respostas às perguntas mais comuns sobre a AKMLEVA.',
    path: '/faq',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  }),
  component: FAQPage,
})

const faqs = [
  { q: 'O que é a AKMLEVA?', a: 'A AKMLEVA é uma plataforma de viagens potenciada por inteligência artificial que cria itinerários personalizados.' },
  { q: 'É gratuito?', a: 'Sim, pode criar itinerários e explorar destinos gratuitamente. Funcionalidades premium estarão disponíveis em breve.' },
  { q: 'Como funcionam as recomendações?', a: 'Utilizamos algoritmos de IA que analisam as suas preferências, orçamento e estilo de viagem para sugerir destinos e atividades.' },
  { q: 'Os meus dados estão seguros?', a: 'Sim. Utilizamos encriptação de ponta a ponta e nunca partilhamos os seus dados com terceiros sem o seu consentimento.' },
]

function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">Perguntas Frequentes</h1>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors list-none flex items-center justify-between">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </main>
    </div>
  )
}
