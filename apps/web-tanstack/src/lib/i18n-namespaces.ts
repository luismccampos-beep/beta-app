import { useContext } from 'react'
import { I18nContext, getNestedValue } from './i18n-provider'

type TranslationFunction = (key: string) => string

function createNamespaceHook(namespace: string): () => TranslationFunction {
  return function useNamespaceTranslations(): TranslationFunction {
    const { t: messages } = useContext(I18nContext)
    const namespaceMessages = messages[namespace] as Record<string, unknown> | undefined
    return (key: string) => {
      if (!namespaceMessages) return key
      return getNestedValue(namespaceMessages, key)
    }
  }
}

export const useCommonTranslations = createNamespaceHook('common')
export const useLandingTranslations = createNamespaceHook('landing')
export const useAboutTranslations = createNamespaceHook('about')
export const useContactTranslations = createNamespaceHook('contact')
export const useFaqTranslations = createNamespaceHook('faq')
export const useDashboardTranslations = createNamespaceHook('dashboard')
export const useLegalTranslations = createNamespaceHook('legal')
export const useEnhancedTravelPreferencesFormTranslations = createNamespaceHook('enhancedTravelPreferencesForm')
export const useAuthTranslations = createNamespaceHook('auth')
export const useResultsTranslations = createNamespaceHook('results')
export const useDestinationsBrowseTranslations = createNamespaceHook('destinationsBrowse')
export const useDestinationTranslations = createNamespaceHook('destination')

export function useItineraryTranslations(): TranslationFunction {
  const { t: messages } = useContext(I18nContext)
  const destinationMessages = messages['destination'] as Record<string, unknown> | undefined
  const itineraryMessages = destinationMessages?.['itinerary'] as Record<string, unknown> | undefined
  return (key: string) => {
    if (!itineraryMessages) return key
    return getNestedValue(itineraryMessages, key)
  }
}