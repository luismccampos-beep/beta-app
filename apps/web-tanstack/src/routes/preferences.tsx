import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/lib/auth/session'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'
import { H1 } from '@/components/ui/typography'

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
        <a href="/dashboard" className="text-sm text-primary dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 mb-4 inline-block">
          ← Dashboard
        </a>
        <H1 className="mb-8">{t('title')}</H1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('description')}
        </p>
        <div className="mt-8">
          <a href="/preferences/edit" className="px-6 py-3 bg-gradient-to-r from-brand-gray via-orange to-green text-white font-semibold rounded-lg hover:opacity-90 transition-all">
            {t('editPreferences')}
          </a>
        </div>
      </main>
    </div>
  )
}
