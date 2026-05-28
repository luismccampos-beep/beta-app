import { NextResponse } from 'next/server';

import { summarizeCostOfLiving } from '../../../../../../lib/travel/cost-tier';
import {
  getDestinationBySlugFromDb,
  isTravelCatalogDbEnabled,
  mapMarkersFromDbHotels,
} from '../../../../../../lib/travel/catalog-db';
import {
  getMockDestinationBySlug,
  getMockHotelsForDestination,
  isTravelMockEnabled,
  resolveDestinationImageUrl,
} from '../../../../../../lib/travel/mock-travel/load';
import { resolveDestinationIata } from '../../../../../../lib/travel/destination-iata';
import { resolveMapMarkersForDestination } from '../../../../../../lib/travel/travel-map-markers';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ slug: string }> };

/** GET /api/travel/v1/destinations/pt-42 */
export async function GET(_req: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;

  if (isTravelCatalogDbEnabled()) {
    try {
      const row = await getDestinationBySlugFromDb(slug);
      if (!row) {
        return NextResponse.json({ error: 'Destino não encontrado' }, { status: 404 });
      }

      const { dest, hotels } = row;
      return NextResponse.json({
        ok: true,
        source: 'db',
        slug: row.slug,
        id: dest.id,
        lang: dest.lang ?? 'pt',
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
        hotels,
        mapMarkers: (() => {
          const fromDb = mapMarkersFromDbHotels(dest, hotels);
          return fromDb.length > 0 ? fromDb : resolveMapMarkersForDestination(dest);
        })(),
        mock: false,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Database error';
      return NextResponse.json({ ok: false, source: 'db', message }, { status: 503 });
    }
  }

  const dest = getMockDestinationBySlug(slug);
  if (!dest) {
    return NextResponse.json({ error: 'Destino não encontrado' }, { status: 404 });
  }

  const hotels = getMockHotelsForDestination(dest.id).slice(0, 24);

  return NextResponse.json({
    ok: true,
    source: 'bundle',
    slug,
    id: dest.id,
    lang: dest.lang ?? 'pt',
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
    hotels: hotels.map((h) => ({
      id: h.id,
      nome: h.nome,
      estrelas: h.estrelas,
      preco_por_noite: h.preco_por_noite,
      comodidades: h.comodidades,
    })),
    mapMarkers: resolveMapMarkersForDestination(dest),
    mock: isTravelMockEnabled(),
  });
}
