import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/lib/auth/session'
import { generatePageHead } from '@/lib/seo'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session?.user) {
      throw redirect({ to: '/auth' })
    }
  },
  head: () => generatePageHead({
    title: 'Dashboard',
    path: '/dashboard',
    noindex: true,
  }),
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
        <div className="flex items-center gap-4">
          <a href="/preferences/edit" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Preferências
          </a>
          <span className="text-sm text-gray-400">U</span>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: 'Viagens', value: '0', desc: 'Itinerários criados' },
            { title: 'Destinos', value: '0', desc: 'Destinos guardados' },
            { title: 'Preferências', value: '—', desc: 'Perfil de viajante' },
          ].map((card) => (
            <div key={card.title} className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
