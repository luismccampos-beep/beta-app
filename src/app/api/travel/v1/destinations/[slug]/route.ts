import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { withRateLimit } from '@/lib/api/rate-limit-guard';
import { prisma } from '@/lib/prisma';
import { summarizeCostOfLiving } from '../../../../../../lib/travel/cost-tier';
import {
  getDestinationBySlugFromDb,
  getHotelStatsForDestinations,
  mapMarkersFromDbHotels,
} from '../../../../../../lib/travel/catalog-db';
import { resolveDestinationImageUrl } from '../../../../../../lib/travel/destination-image';
import { resolveDestinationIata } from '../../../../../../lib/travel/destination-iata';
import { resolveMapMarkersForDestination } from '../../../../../../lib/travel/travel-map-markers';
import {
  isDemoPerfectEnabled,
  isDemoSlug,
  buildDemoDestinationDetail,
} from '../../../../../../lib/travel/demo-perfect-path';
import { getDestinationLocalized } from '../../../../../../lib/travel/destination-i18n';
import type { WvDestinationVideo } from '@prisma/client';

export const dynamic = 'force-dynamic';

async function safeAsync<T>(fn: () => Promise<T>, fallback: T, label?: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (label) console.error(`[api/destinations] ${label} failed:`, err);
    return fallback;
  }
}

export const GET = apiHandler(withRateLimit(async (req: Request, ctx) => {
  const slug = z.string().min(1).max(100).parse((await ctx.params).slug);
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') ?? undefined;

  if (isDemoPerfectEnabled() && isDemoSlug(slug)) {
    const demoData = buildDemoDestinationDetail(slug);
    if (demoData) {
      return NextResponse.json({
        ok: true,
        source: 'demo-perfect',
        ...demoData,
        mock: false,
      });
    }
  }

  const row = await getDestinationBySlugFromDb(slug);
  if (!row) {
    return NextResponse.json({ error: 'Destino não encontrado' }, { status: 404 });
  }

  const { dest, hotels } = row;
  const statsMap = await safeAsync(() => getHotelStatsForDestinations([row.dest.id]), null, 'getHotelStatsForDestinations');
  const destStats = statsMap?.get(row.dest.id) ?? null;

  const localized = locale && locale !== (dest.lang ?? 'pt')
    ? await safeAsync(() => getDestinationLocalized(row.dest.id, locale), null, 'getDestinationLocalized')
    : null;

  const videos: WvDestinationVideo[] = await safeAsync(
    () => prisma.wvDestinationVideo.findMany({
      where: { destinoId: row.dest.id, isVerified: true },
      orderBy: { sortOrder: 'asc' },
      take: 5,
    }),
    [],
    'wvDestinationVideo.findMany',
  );

  return NextResponse.json({
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
    videos: videos.map(v => ({
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
      const fromDb = mapMarkersFromDbHotels(dest, hotels);
      return fromDb.length > 0 ? fromDb : resolveMapMarkersForDestination(dest);
    }, [], 'mapMarkers'),
    mock: false,
  });
}));
