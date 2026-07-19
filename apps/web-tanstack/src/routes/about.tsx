import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'

export const Route = createFileRoute('/about')({
  head: () => generatePageHead({
    title: 'Sobre Nós',
    description: 'Conheça a equipa AKMLEVA e a nossa missão de tornar a viagem mais acessível.',
    path: '/about',
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Sobre Nós</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-4 text-gray-600 dark:text-gray-400">
          <p>
            A AKMLEVA é uma plataforma de viagens potenciada por inteligência artificial,
            dedicada a criar itinerários personalizados e autênticos para viajantes modernos.
          </p>
          <p>
            A nossa missão é tornar o planeamento de viagens mais simples, acessível e envolvente.
            Combinamos dados reais de destinos com algoritmos avançados para oferecer recomendações
            que se adaptam aos seus gostos e orçamento.
          </p>
          <p>
            Fundada em Portugal, servimos viajantes de todo o mundo que procuram experiências
            autênticas e fora do comum.
          </p>
        </div>
      </main>
    </div>
  )
}
