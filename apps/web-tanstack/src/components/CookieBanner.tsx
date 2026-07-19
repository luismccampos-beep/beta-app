import { type ReactNode, useEffect, useState, useCallback } from 'react'

interface CookieConsent {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'cookie-consent'

export function CookieBanner() {
  const [show, setShow] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) setShow(true)
  }, [])

  const acceptAll = useCallback(() => {
    const full: CookieConsent = { necessary: true, functional: true, analytics: true, marketing: true }
    setConsent(full)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full))
    setShow(false)
  }, [])

  const rejectAll = useCallback(() => {
    const minimal: CookieConsent = { necessary: true, functional: false, analytics: false, marketing: false }
    setConsent(minimal)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal))
    setShow(false)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
          Utilizamos cookies para melhorar a sua experiência. Ao continuar a navegar, concorda com a nossa política de cookies.
        </p>
        <div className="flex gap-2">
          <button
            onClick={rejectAll}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Rejeitar
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  )
}
