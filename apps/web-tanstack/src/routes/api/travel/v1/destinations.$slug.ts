import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { apiHandler } from '@/lib/api/handler'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'
import { summarizeCostOfLiving } from '@/lib/travel/cost-tier'
import {
  getDestinationBySlugFromDb,
  getHotelStatsForDestinations,
  mapMarkersFromDbHotels,
} from '@/lib/travel/catalog-db'
import { resolveDestinationImageUrl } from '@/lib/travel/destination-image'
import { resolveDestinationIata } from '@/lib/travel/destination-iata'
import { resolveMapMarkersForDestination } from '@/lib/travel/travel-map-markers'
import {
  isDemoPerfectEnabled,
  isDemoSlug,
  buildDemoDestinationDetail,
} from '@/lib/travel/demo-perfect-path'
import { getDestinationLocalized } from '@/lib/travel/destination-i18n'
import { MOCK_DESTINATIONS } from '@/lib/travel/mock-destinations'

async function safeAsync<T>(fn: () => Promise<T>, fallback: T, label?: string): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (label) console.error(`[api/destinations] ${label} failed:`, err)
    return fallback
  }
}

function getMockDestination(slug: string) {
  const d = MOCK_DESTINATIONS.find((m) => m.slug === slug)
  if (!d) return null
  return {
    ok: true,
    source: 'mock',
    slug: d.slug,
    id: d.id,
    lang: d.lang,
    nome: d.nome,
    pais: d.pais,
    paisCode: d.paisCode,
    continente: d.continente,
    iata: d.iata,
    tipo: d.tipo,
    clima: d.clima,
    imageUrl: d.imagemUrl,
    descricao: d.descricao,
    descricaoCompleta: null,
    resumo: d.resumo,
    veja: [],
    faca: [],
    coma: [],
    dicas: {},
    tags: [d.tipo, d.clima].filter(Boolean),
    wikipedia_resumo: null,
    wikipedia_url: null,
    clima_tempo: null,
    custo_de_vida: d.custoDeVida,
    costOfLiving: summarizeCostOfLiving({ indices: { cost_of_living: d.custoDeVida } }),
    transporte: null,
    latitude: d.latitude,
    longitude: d.longitude,
    wikivoyageUrl: null,
    license: 'CC BY-SA 3.0',
    galleryImages: null,
    imageAttribution: null,
    videos: [],
    hotels: [],
    hotelTypes: null,
    mapMarkers: [],
    mock: true,
  }
}

export const Route = createFileRoute('/api/travel/v1/destinations/$slug')({
  server: {
    handlers: {
      GET: apiHandler(async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json(
            { ok: false, error: 'Too many requests', code: 'RATE_LIMITED' },
            { status: 429 },
          )
        }

        const url = new URL(request.url)
        const slug = z.string().min(1).max(100).parse(
          request.url.split('/destinations/')[1]?.split('/')[0]?.split('?')[0],
        )
        const locale = url.searchParams.get('locale') ?? undefined

        if (isDemoPerfectEnabled() && isDemoSlug(slug)) {
          const demoData = buildDemoDestinationDetail(slug)
          if (demoData) {
            return Response.json({
              ok: true,
              source: 'demo-perfect',
              ...demoData,
              mock: false,
            })
          }
        }

        try {
          const row = await getDestinationBySlugFromDb(slug)
          if (!row) {
            const mock = getMockDestination(slug)
            if (mock) return Response.json(mock)
            return Response.json({ error: 'Destino não encontrado' }, { status: 404 })
          }

          const { dest, hotels } = row
          const statsMap = await safeAsync(() => getHotelStatsForDestinations([row.dest.id]), null, 'getHotelStatsForDestinations')
          const destStats = statsMap?.get(row.dest.id) ?? null

          const localized = locale && locale !== (dest.lang ?? 'pt')
            ? await safeAsync(() => getDestinationLocalized(row.dest.id, locale), null, 'getDestinationLocalized')
            : null

          const videos = await safeAsync(
            () => prisma.wvDestinationVideo.findMany({
              where: { destinoId: row.dest.id, isVerified: true },
              orderBy: { sortOrder: 'asc' },
              take: 5,
            }),
            [],
            'wvDestinationVideo.findMany',
          )

          return Response.json({
            ok: true,
            source: 'db',
            slug: row.slug,
            id: dest.id,
            lang: dest.lang ?? 'pt',
            localizedNome: localized?.nome,
            localizedDescricao: localized?.descricao,
            localizedResumo: localized?.resumo,
            localizedFonte: localized?.fonte,
            nome: dest.nome,
            pais: dest.pais,
            paisCode: dest.paisCode,
            continente: dest.continente,
            iata: resolveDestinationIata(dest),
            tipo: dest.tipo,
            clima: dest.clima,
            imageUrl: resolveDestinationImageUrl(dest),
            descricao: dest.descricao,
            descricaoCompleta: dest.descricaoCompleta,
            resumo: dest.resumo,
            veja: dest.veja ?? [],
            faca: dest.faca ?? [],
            coma: dest.coma ?? [],
            dicas: dest.dicas ?? {},
            tags: dest.tags ?? [dest.tipo, dest.clima].filter(Boolean),
            wikipedia_resumo: dest.wikipedia_resumo,
            wikipedia_url: dest.wikipedia_url,
            clima_tempo: dest.clima_tempo,
            custo_de_vida: dest.custo_de_vida,
            costOfLiving: summarizeCostOfLiving(dest.custo_de_vida),
            transporte: dest.transporte,
            latitude: dest.latitude,
            longitude: dest.longitude,
            wikivoyageUrl: dest.wikivoyageUrl,
            license: 'CC BY-SA 3.0',
            galleryImages: (dest as Record<string, unknown>).galleryImages ?? null,
            imageAttribution: dest.imagem_attribuicao ?? null,
            videos: videos.map((v: Record<string, unknown>) => ({
              url: v.url,
              thumbUrl: v.thumbUrl,
              posterUrl: v.posterUrl,
              width: v.width,
              height: v.height,
              durationSec: v.durationSec,
              author: v.author,
              license: v.license,
              sourceUrl: v.sourceUrl,
              isVerified: v.isVerified,
            })),
            hotels,
            hotelTypes: destStats?.hotelTypes ?? null,
            mapMarkers: await safeAsync(async () => {
              const fromDb = mapMarkersFromDbHotels(dest, hotels)
              return fromDb.length > 0 ? fromDb : resolveMapMarkersForDestination(dest)
            }, [], 'mapMarkers'),
            mock: false,
          })
        } catch {
          const mock = getMockDestination(slug)
          if (mock) return Response.json(mock)
          return Response.json({ error: 'Destino não encontrado' }, { status: 404 })
        }
      }),
    },
  },
})
