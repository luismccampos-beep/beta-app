import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { createTranslationsHook, useLocale } from '@/lib/i18n-provider'
import {
  createRecommendationTracker,
  observeImpression,
  type RecommendationTracker,
} from '@/lib/ml-service/track-recommendation'
import { destinationDetailPath } from '@/lib/travel/destination-path'
import { DESTINATION_PLACEHOLDER, onDestinationImageError } from './destination-image-fallback'

const useT = createTranslationsHook('landing')

interface RecommendedItem {
  itemId: string
  slug: string
  nome: string
  pais: string
  continente: string | null
  tipo: string | null
  clima: string | null
  imageUrl: string | null
}

interface RecommendedDestinationsResponse {
  ok: boolean
  method?: string
  items?: RecommendedItem[]
}

/**
 * Personalized "picks for you" carousel shown on the landing page.
 * Renders silently (nothing) while loading, on error, or when empty so the
 * marketing page never depends on ML availability.
 */
export function HomeRecommendations({ limit = 8 }: { limit?: number }) {
  const t = useT()
  const locale = useLocale()

  const [items, setItems] = useState<RecommendedItem[] | null>(null)
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(() => new Set())
  const trackerRef = useRef<RecommendationTracker | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(
          `/api/ai/recommended-destinations?limit=${limit}&lang=${encodeURIComponent(locale)}`,
          { cache: 'no-store' },
        )
        if (!res.ok) return
        const body = (await res.json()) as RecommendedDestinationsResponse
        if (!cancelled && body.ok && body.items?.length) {
          trackerRef.current = createRecommendationTracker('home_carousel', body.method)
          setItems(body.items)
        }
      } catch {
        // Silent: recommendations are a progressive enhancement.
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [limit, locale])

  const visible = useMemo(
    () => (items ?? []).filter((item) => !dismissed.has(item.itemId)),
    [items, dismissed],
  )

  const tracker = trackerRef.current

  if (!visible.length) return null

  return (
    <section
      aria-labelledby="home-recommendations-title"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary-50/40 dark:from-gray-950 dark:to-gray-900 transition-colors"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2
              id="home-recommendations-title"
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
            >
              {t('recommendedTitle')}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{t('recommendedSubtitle')}</p>
          </div>
        </div>

        <ul className="flex gap-4 overflow-x-auto snap-x pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
          {visible.map((item, index) => (
            <li
              key={item.itemId}
              className="relative flex-shrink-0 w-64 snap-start group"
            >
              <a
                href={destinationDetailPath(item.slug, locale)}
                data-rec-item-id={item.itemId}
                ref={(el) => {
                  // Tracker is created before items render, so it is always set here.
                  if (tracker) observeImpression(el, tracker, index + 1)
                }}
                onClick={() => tracker?.click(item.itemId, index + 1)}
                className="block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={item.imageUrl || DESTINATION_PLACEHOLDER}
                    alt={item.nome}
                    loading="lazy"
                    decoding="async"
                    onError={onDestinationImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{item.nome}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.pais}</p>
                  {(item.clima || item.tipo) && (
                    <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800">
                      {item.clima || item.tipo}
                    </span>
                  )}
                </div>
              </a>
              <button
                type="button"
                onClick={() => {
                  tracker?.dismiss(item.itemId, index + 1)
                  setDismissed((prev) => new Set(prev).add(item.itemId))
                }}
                aria-label={`${t('recommendedDismiss')} ${item.nome}`}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-gray-900 dark:hover:text-white shadow-sm transition-opacity"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
