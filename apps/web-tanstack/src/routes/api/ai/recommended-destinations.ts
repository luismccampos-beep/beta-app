import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { apiHandler } from '@/lib/api/handler'
import { auth } from '@/lib/auth/auth'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'
import { prisma } from '@akmleva/db'
import { rankDestinations } from '@/lib/ml-service/client'
import type { CompactTravelPreferences } from '@/lib/travel/preference-match'
import { decodeTravelPreferencesCompact } from '@/lib/travel/travel-preferences-query'

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(8),
  lang: z.enum(['pt', 'en', 'es', 'fr']).default('pt'),
  /** Compact-encoded preferences (same encoding as /results `prefs` param). */
  prefs: z.string().optional(),
})

interface RecommendedDestinationItem {
  itemId: string
  slug: string
  nome: string
  pais: string
  continente: string | null
  tipo: string | null
  clima: string | null
  imageUrl: string | null
  score: number
  confidence: number
}

/** Candidate pool size before ranking — enough for CF to reshuffle meaningfully. */
const CANDIDATE_POOL = 360

/**
 * Short-TTL cache for successful ML rankings. Anonymous visitors with identical
 * prefs get identical results, so a 60s cache cuts most ML round-trips on the
 * landing page. Only successful ML responses are cached; fallbacks (ML down)
 * are never cached so recovery is immediate.
 */
const RANK_CACHE_TTL_MS = 60_000
const RANK_CACHE_MAX_ENTRIES = 200
const rankCache = new Map<
  string,
  { at: number; body: { ok: boolean; method: string; items: RecommendedDestinationItem[]; cached?: boolean } }
>()

function rankCacheKey(
  lang: string,
  limit: number,
  userId: string | null,
  preferences: CompactTravelPreferences,
): string {
  return JSON.stringify([lang, limit, userId, preferences])
}

function rankCacheGet(key: string) {
  const hit = rankCache.get(key)
  if (!hit) return null
  if (Date.now() - hit.at > RANK_CACHE_TTL_MS) {
    rankCache.delete(key)
    return null
  }
  return hit.body
}

function rankCacheSet(key: string, body: { ok: boolean; method: string; items: RecommendedDestinationItem[] }) {
  if (rankCache.size >= RANK_CACHE_MAX_ENTRIES) {
    const oldest = rankCache.keys().next().value
    if (oldest !== undefined) rankCache.delete(oldest)
  }
  rankCache.set(key, { at: Date.now(), body })
}

function jsonStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string')
}

/**
 * Maps the stored onboarding quiz (UserPreference) onto the preference shape
 * expected by the ML service (CompactTravelPreferences ≈ build_preference_document).
 */
async function loadStoredPreferences(userId: string | null): Promise<CompactTravelPreferences> {
  if (!userId) return {}

  const row = await prisma.userPreference.findUnique({
    where: { userId },
    select: {
      travelStyle: true,
      favoriteDestinationTypes: true,
      favoriteActivities: true,
      accommodationPreference: true,
      pacePreference: true,
      budgetRangeMin: true,
      budgetRangeMax: true,
    },
  })
  if (!row) return {}

  const prefs: CompactTravelPreferences = {}
  if (row.travelStyle) prefs.travelStyles = [row.travelStyle]
  const activities = jsonStrings(row.favoriteActivities)
  if (activities.length) prefs.activityTypes = activities
  const destinationTypes = jsonStrings(row.favoriteDestinationTypes)
  if (destinationTypes.length) prefs.preferredDestinations = destinationTypes
  if (row.accommodationPreference) prefs.accommodationType = [row.accommodationPreference]
  if (row.pacePreference) prefs.pacePreference = row.pacePreference

  const min = row.budgetRangeMin != null ? Number(row.budgetRangeMin) : null
  const max = row.budgetRangeMax != null ? Number(row.budgetRangeMax) : null
  if (min != null && max != null && !Number.isNaN(min) && !Number.isNaN(max)) {
    prefs.budgetRange = [min, max]
  }
  return prefs
}

export const Route = createFileRoute('/api/ai/recommended-destinations')({
  server: {
    handlers: {
      GET: apiHandler(async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, message: 'Rate limit exceeded' }, { status: 429 })
        }

        const url = new URL(request.url)
        const params = QuerySchema.parse(Object.fromEntries(url.searchParams))

        // Auth optional: anonymous visitors get popularity/cold-start ordering.
        let userId: string | null = null
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          userId = session?.user?.id ?? null
        } catch {
          userId = null
        }

        const explicitPrefs = decodeTravelPreferencesCompact(params.prefs)
        const preferences =
          explicitPrefs ?? (await loadStoredPreferences(userId).catch(() => ({})))

        const cacheKey = rankCacheKey(params.lang, params.limit, userId, preferences)
        const cached = rankCacheGet(cacheKey)
        if (cached) {
          return Response.json({ ...cached, cached: true })
        }

        let destinationRows
        try {
          destinationRows = await prisma.wvDestination.findMany({
            where: { lang: params.lang, hotelCount: { gt: 0 } },
            orderBy: { hotelCount: 'desc' },
            take: CANDIDATE_POOL,
            select: {
              id: true,
              slug: true,
              nome: true,
              pais: true,
              continente: true,
              iata: true,
              tipo: true,
              clima: true,
              imagemUrl: true,
            },
          })
        } catch (error) {
          // Only degrade gracefully for expected DB availability errors
          // (local dev without Postgres, transient outage). Schema/query
          // regressions must surface as real 500s so monitoring catches them.
          const code =
            typeof error === 'object' && error !== null && 'code' in error
              ? String((error as { code: unknown }).code)
              : ''
          const isAvailabilityError = ['P1001', 'P1002', 'P2021'].includes(code)
          if (!isAvailabilityError) {
            console.error('[recommended-destinations] Unexpected DB error', {
              code: code || undefined,
              name: error instanceof Error ? error.name : undefined,
              message: error instanceof Error ? error.message : String(error),
            })
            throw error
          }
          console.warn('[recommended-destinations] DB unavailable, returning empty items', {
            code,
            message: error instanceof Error ? error.message : String(error),
          })
          return Response.json({ ok: true, method: 'empty', items: [] })
        }
        const rows = destinationRows

        const buildItem = (
          row: (typeof rows)[number],
          itemId: string,
          score: number,
          confidence: number,
        ): RecommendedDestinationItem => ({
          itemId,
          slug: row.slug,
          nome: row.nome,
          pais: row.pais,
          continente: row.continente,
          tipo: row.tipo,
          clima: row.clima,
          imageUrl: row.imagemUrl,
          score,
          confidence,
        })

        if (rows.length === 0) {
          return Response.json({ ok: true, method: 'empty', items: [] })
        }

        const ranked = await rankDestinations(
          preferences as Record<string, unknown>,
          rows.map((r) => ({
            item_id: `wv-${params.lang}-${r.id}`,
            destino_id: r.id,
            lang: params.lang,
            iata: r.iata ?? undefined,
            nome: r.nome,
          })),
          Math.min(params.limit, rows.length),
          userId ?? undefined,
        )

        if (!ranked || !ranked.rankings.length) {
          // ML unavailable — fall back to catalog popularity so the UI never breaks.
          const items = rows.slice(0, params.limit).map((r) =>
            buildItem(r, `wv-${params.lang}-${r.id}`, 0, 0),
          )
          return Response.json({ ok: true, method: 'fallback', items })
        }

        const rowById = new Map(rows.map((r) => [r.id, r]))
        const items: RecommendedDestinationItem[] = []
        for (const entry of ranked.rankings) {
          const row = rowById.get(entry.destino_id ?? -1)
          if (!row) continue
          items.push(buildItem(row, entry.id, entry.score, entry.confidence))
          if (items.length >= params.limit) break
        }

        const successBody = {
          ok: true,
          method: items.length ? (ranked.rankings[0]?.method ?? 'embedding') : 'fallback',
          items,
        }
        if (items.length) {
          rankCacheSet(cacheKey, successBody)
        }
        return Response.json(successBody)
      }),
    },
  },
})
