import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () => generatePageHead({
    title: 'Contacto',
    description: 'Entre em contacto com a equipa AKMLEVA.',
    path: '/contact',
  }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AKMLEVA
        </a>
      </nav>
      <main className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Contacto</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Tem alguma questão? Estamos aqui para ajudar.
        </p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem</label>
            <textarea rows={5} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Enviar
          </button>
        </form>
      </main>
    </div>
  )
}
