import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'

const useT = createTranslationsHook('auth')

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
  const t = useT()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('verifyEmail')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('verifyingEmail')}
          </p>
          <a href="/auth" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
            {t('goToLogin')} →
          </a>
        </div>
      </div>
    </div>
  )
}
