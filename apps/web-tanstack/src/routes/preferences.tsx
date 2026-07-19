import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/lib/auth/session'
import { generatePageHead } from '@/lib/seo'

export const Route = createFileRoute('/preferences')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session?.user) {
      throw redirect({ to: '/auth' })
    }
  },
  head: () => generatePageHead({
    title: 'Preferências',
    path: '/preferences',
    noindex: true,
  }),
  component: PreferencesPage,
})

function PreferencesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
        <a href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          ← Dashboard
        </a>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Preferências de Viagem</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure as suas preferências para receber recomendações personalizadas.
        </p>
        <div className="mt-8">
          <a href="/preferences/edit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Editar preferências
          </a>
        </div>
      </main>
    </div>
  )
}
