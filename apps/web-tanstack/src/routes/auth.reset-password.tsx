import { createFileRoute } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'

const useT = createTranslationsHook('auth')

export const Route = createFileRoute('/auth/reset-password')({
  head: () => generatePageHead({
    title: 'Repor Password',
    description: 'Repor a password da sua conta AKMLEVA.',
    path: '/auth/reset-password',
    noindex: true,
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const t = useT()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{t('resetPasswordTitle')}</h1>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="reset-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('newPassword')}</label>
              <input id="reset-password" type="password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="reset-password-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('confirmPassword')}</label>
              <input id="reset-password-confirm" type="password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              {t('sendResetLink')}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <a href="/auth" className="hover:text-blue-600 transition-colors">← {t('backToSignIn')}</a>
          </div>
        </div>
      </div>
    </div>
  )
}
