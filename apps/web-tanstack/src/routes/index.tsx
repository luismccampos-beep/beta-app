import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'AKMLEVA — Viaje mais, planeie melhor' },
      { name: 'description', content: 'Inteligência artificial para criar itinerários de viagem autênticos e personalizados.' },
      { property: 'og:title', content: 'AKMLEVA' },
      { property: 'og:description', content: 'Inteligência artificial para criar itinerários de viagem autênticos e personalizados.' },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </div>
        <div className="flex items-center gap-4">
          <a href="/auth" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Entrar
          </a>
          <a href="/preferences/edit" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Começar
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white leading-tight">
            Viaje mais.<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Planeie melhor.
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Inteligência artificial para criar itinerários de viagem autênticos e personalizados.
            Descubra destinos, comparar preços e planeie a sua próxima aventura.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/preferences/edit"
              className="w-full sm:w-auto px-8 py-3 text-base font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
            >
              Criar o meu itinerário
            </a>
            <a
              href="/destinations"
              className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            >
              Explorar destinos
            </a>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { title: 'IA Avançada', desc: 'Algoritmos que entendem as suas preferências e criam itinerários personalizados.' },
            { title: 'Destinos Reais', desc: 'Dados de milhares de destinos com preços, reviews e dicas locais.' },
            { title: 'Privacidade', desc: 'Os seus dados são seus. Protegidos com encriptação de ponta a ponta.' },
          ].map((feature) => (
            <div key={feature.title} className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
