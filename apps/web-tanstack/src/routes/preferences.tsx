import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/lib/auth/session'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'

const useT = createTranslationsHook('preferences')

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
  const t = useT()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Dashboard
        </a>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('description')}
        </p>
        <div className="mt-8">
          <a href="/preferences/edit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            {t('editPreferences')}
          </a>
        </div>
      </main>
    </div>
  )
}
