'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useI18n } from '@/lib/i18n-provider'
import { Shield, Settings2, BarChart3, Megaphone, Cookie } from 'lucide-react'

const STORAGE_KEY = 'cookie-consent'

type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing'

interface ConsentState {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

type TranslationsType = Record<string, Record<string, unknown>>

function getCategoryTranslations(t: Record<string, unknown>) {
  const common = (t.common || t) as Record<string, unknown>

  return {
    banner: {
      title: (common.cookieBannerTitle as string) || 'Gestão de Cookies',
      description: (common.cookieBannerDesc as string) || 'Utilizamos cookies para melhorar a sua experiência no nosso site. Pode escolher quais tipos de cookies aceitar.',
      acceptAll: (common.cookieAcceptAll as string) || 'Aceitar Todos',
      rejectAll: (common.cookieRejectAll as string) || 'Rejeitar Todos',
      customize: (common.cookieCustomize as string) || 'Personalizar',
      necessaryLabel: (common.cookieNecessaryLabel as string) || 'Apenas Necessários',
    },
    categories: {
      necessary: {
        name: (common.cookieCatNecessary as string) || 'Cookies Necessários',
        description: (common.cookieCatNecessaryDesc as string) || 'Essenciais para o funcionamento básico do site',
      },
      functional: {
        name: (common.cookieCatFunctional as string) || 'Cookies Funcionais',
        description: (common.cookieCatFunctionalDesc as string) || 'Melhoram a experiência de utilização',
      },
      analytics: {
        name: (common.cookieCatAnalytics as string) || 'Cookies de Análise',
        description: (common.cookieCatAnalyticsDesc as string) || 'Ajudam-nos a melhorar os nossos serviços',
      },
      marketing: {
        name: (common.cookieCatMarketing as string) || 'Cookies de Marketing',
        description: (common.cookieCatMarketingDesc as string) || 'Personalizam anúncios e conteúdo',
      },
    },
    modal: {
      title: (common.cookieModalTitle as string) || 'Configurações de Cookies',
      description: (common.cookieModalDesc as string) || 'Escolha quais tipos de cookies pretende aceitar.',
      save: (common.cookieModalSave as string) || 'Guardar Preferências',
      cancel: (common.cookieModalCancel as string) || 'Cancelar',
    },
  }
}

const CATEGORIES: { key: CookieCategory; icon: typeof Shield; alwaysOn?: boolean }[] = [
  { key: 'necessary', icon: Shield, alwaysOn: true },
  { key: 'functional', icon: Settings2 },
  { key: 'analytics', icon: BarChart3 },
  { key: 'marketing', icon: Megaphone },
]

function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ConsentState
  } catch {
    return null
  }
}

function saveConsent(state: Omit<ConsentState, 'timestamp'>): void {
  const full: ConsentState = {
    ...state,
    necessary: true,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(full))
}

export function CookieBanner() {
  const { t } = useI18n()
  const tr = useMemo(() => getCategoryTranslations(t as Record<string, unknown>), [t])

  const [visible, setVisible] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [prefs, setPrefs] = useState<Omit<ConsentState, 'timestamp'>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const existing = getConsent()
    if (!existing) {
      setVisible(true)
    } else {
      setPrefs({
        necessary: existing.necessary,
        functional: existing.functional,
        analytics: existing.analytics,
        marketing: existing.marketing,
      })
    }
  }, [])

  const handleAcceptAll = useCallback(() => {
    const all = { necessary: true, functional: true, analytics: true, marketing: true }
    saveConsent(all)
    setPrefs(all)
    setVisible(false)
    setDialogOpen(false)
  }, [])

  const handleRejectAll = useCallback(() => {
    const none = { necessary: true, functional: false, analytics: false, marketing: false }
    saveConsent(none)
    setPrefs(none)
    setVisible(false)
    setDialogOpen(false)
  }, [])

  const handleSave = useCallback(() => {
    saveConsent(prefs)
    setVisible(false)
    setDialogOpen(false)
  }, [prefs])

  const openDialog = useCallback(() => {
    const existing = getConsent()
    if (existing) {
      setPrefs({
        necessary: existing.necessary,
        functional: existing.functional,
        analytics: existing.analytics,
        marketing: existing.marketing,
      })
    }
    setDialogOpen(true)
  }, [])

  const togglePref = useCallback((key: CookieCategory) => {
    if (key === 'necessary') return
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  if (!visible && !dialogOpen) return null

  return (
    <>
      {/* Banner */}
      {visible && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          role="dialog"
          aria-label={tr.banner.title}
        >
          <div className="flex flex-col items-start gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 sm:flex-row sm:items-center sm:gap-8 sm:py-4">
            <div className="flex shrink-0 items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg" aria-hidden="true">
                <Cookie className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-black text-gray-950 dark:text-white uppercase tracking-tight">{tr.banner.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{tr.banner.description}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3 sm:ml-auto">
              <button
                onClick={handleRejectAll}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {tr.banner.rejectAll}
              </button>
              <button
                onClick={openDialog}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                {tr.banner.customize}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
              >
                {tr.banner.acceptAll}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label={tr.modal.cancel}
            onClick={() => setDialogOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{tr.modal.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tr.modal.description}</p>
            </div>

            <div className="p-4 space-y-3">
              {CATEGORIES.map(({ key, icon: Icon, alwaysOn }) => (
                <div
                  key={key}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    prefs[key]
                      ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      prefs[key]
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {tr.categories[key].name}
                        {alwaysOn && (
                          <span className="ml-1.5 text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-normal">
                            ({tr.banner.necessaryLabel})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tr.categories[key].description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs[key]}
                    onClick={() => togglePref(key)}
                    disabled={alwaysOn}
                    aria-label={tr.categories[key].name}
                    className={`relative w-9 h-5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      prefs[key]
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    } ${alwaysOn ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`absolute top-[2px] left-[2px] h-4 w-4 rounded-full bg-white border border-gray-300 transition-transform ${
                        prefs[key] ? 'translate-x-4' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {tr.banner.rejectAll}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {tr.modal.cancel}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {tr.modal.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
