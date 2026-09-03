import { locales, type Locale } from '@/i18n.config'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

const LOCALE_LABELS: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  fr: 'Français',
}

const LOCALE_FLAGS: Record<Locale, string> = {
  pt: '🇵🇹',
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
}

interface LanguageSwitcherProps {
  currentLocale: Locale
  variant?: 'default' | 'overlay'
  onLocaleChange?: (locale: Locale) => void
}

export function LanguageSwitcher({ currentLocale, variant = 'default', onLocaleChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  // The trigger's actions need JS (router.invalidate, cookie). Keep it disabled
  // until hydration so keyboard users can't activate a no-op button.
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLocaleChange(locale: Locale) {
    if (locale === currentLocale) {
      setIsOpen(false)
      return
    }
    setIsOpen(false)
    setIsSwitching(true)
    try {
      // Persist the choice; server middleware reads this cookie on every request.
      document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`
      // Keep <html lang> in sync immediately (SSR re-render is not happening).
      document.documentElement.lang = locale
      onLocaleChange?.(locale)
      // Re-run route loaders/beforeLoad so I18nProvider picks up the new locale
      // without a full page reload.
      await router.invalidate()
    } finally {
      setIsSwitching(false)
    }
  }

  const isOverlay = variant === 'overlay'

  return (
    <div ref={ref} className="relative inline-block" data-wait-for-js>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!hydrated || isSwitching}
        aria-disabled={!hydrated || isSwitching}
        aria-busy={isSwitching}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isOverlay
            ? 'bg-white/10 text-white hover:bg-white/20'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label="Select language"
      >
        <span>{LOCALE_FLAGS[currentLocale]}</span>
        <span className="hidden sm:inline">{LOCALE_LABELS[currentLocale]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-50 ${
            isOverlay
              ? 'bg-gray-900 border-gray-700'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  locale === currentLocale
                    ? 'font-semibold text-primary dark:text-primary-300'
                    : isOverlay
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{LOCALE_FLAGS[locale]}</span>
                <span>{LOCALE_LABELS[locale]}</span>
                {locale === currentLocale && (
                  <svg className="w-4 h-4 ml-auto text-primary dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
