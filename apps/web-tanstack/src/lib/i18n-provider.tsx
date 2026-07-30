import { createContext, useContext, type ReactNode } from 'react'
import { type Locale, defaultLocale } from '@/i18n.config'
import ptMessages from '@/messages/pt.json'
import enMessages from '@/messages/en.json'
import esMessages from '@/messages/es.json'
import frMessages from '@/messages/fr.json'

const messages = { pt: ptMessages, en: enMessages, es: esMessages, fr: frMessages } as const

type Messages = Record<string, unknown>

interface I18nContextValue {
  locale: Locale
  t: Messages
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  t: ptMessages,
})

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = messages[locale] || messages[defaultLocale]
  return <I18nContext.Provider value={{ locale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}

export function useLocale() {
  return useContext(I18nContext).locale
}

export function useTranslations() {
  return useContext(I18nContext).t
}

/**
 * Resolves a dot-notation path and interpolates {variables}.
 * Usage: getNestedValue(obj, 'hero.title', { name: 'World' })
 */
function getNestedValue(
  obj: Record<string, unknown>,
  path: string,
  values?: Record<string, string>,
): string {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined) return path
    current = (current as Record<string, unknown>)[part]
  }
  if (typeof current !== 'string') return path
  if (!values) return current
  return current.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in values ? values[key] : `{${key}}`,
  )
}

/**
 * next-intl compatible useTranslations hook.
 * Usage: const t = useTranslations('landing'); t('hero.title')
 * With interpolation: t('hero.greeting', { name: 'World' })
 */
export function createTranslationsHook(namespace: string) {
  return function useTranslationsNs(): (key: string, values?: Record<string, string>) => string {
    const messages = useContext(I18nContext).t
    const ns = messages[namespace] as Record<string, unknown> | undefined
    return (key: string, values?: Record<string, string>) => {
      if (!ns) return key
      return getNestedValue(ns, key, values)
    }
  }
}

export { getNestedValue, I18nContext }
