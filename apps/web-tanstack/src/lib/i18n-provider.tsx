import { createContext, useContext, type ReactNode } from 'react'
import { type Locale, defaultLocale } from '@/i18n.config'
import ptMessages from '@/messages/pt.json'
import enMessages from '@/messages/en.json'
import esMessages from '@/messages/es.json'
import frMessages from '@/messages/fr.json'

const messages = { pt: ptMessages, en: enMessages, es: esMessages, fr: frMessages } as const

type Messages = Record<string, any>

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
