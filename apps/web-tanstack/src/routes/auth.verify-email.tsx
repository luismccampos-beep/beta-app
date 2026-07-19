import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'

export const Route = createFileRoute('/auth/verify-email')({
  head: () => generatePageHead({
    title: 'Verificar Email',
    description: 'Verificação de email AKMLEVA.',
    path: '/auth/verify-email',
    noindex: true,
  }),
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <a href="/" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AKMLEVA
          </a>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Verificar Email</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            A verificar o seu email...
          </p>
          <a href="/auth" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
            Ir para o login →
          </a>
        </div>
      </div>
    </div>
  )
}
