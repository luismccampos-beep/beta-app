import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getDestinationBySlugFromDb, getHotelStatsForDestinations, isTravelCatalogDbEnabled, mapMarkersFromDbHotels } from '@/lib/travel/catalog-db';
import { resolveDestinationImageUrl } from '@/lib/travel/destination-image';
import { resolveDestinationIata } from '@/lib/travel/destination-iata';
import { summarizeCostOfLiving } from '@/lib/travel/cost-tier';
import { resolveMapMarkersForDestination } from '@/lib/travel/travel-map-markers';
import { DestinationHero } from './components/DestinationHero';

const DestinationGallery = dynamic(() => import('./components/DestinationGallery'), { ssr: false });

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!isTravelCatalogDbEnabled()) return [];
  const { prisma } = await import('@/lib/prisma');
  const top = await prisma.wvDestination.findMany({
    take: 100,
    orderBy: { hotelCount: 'desc' },
    select: { slug: true },
  });
  return top.map((d) => ({ slug: d.slug }));
}

function buildDetailData(dest: any, hotels: any[], statsMap: any) {
  return {
    slug: dest.slug,
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
    imageAttribution: dest.imagem_attribuicao ?? null,
    hotels,
    hotelTypes: statsMap?.hotelTypes ?? null,
    mapMarkers: (() => {
      const fromDb = mapMarkersFromDbHotels(dest, hotels);
      return fromDb.length > 0 ? fromDb : resolveMapMarkersForDestination(dest);
    })(),
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;

  if (isTravelCatalogDbEnabled()) {
    try {
      const row = await getDestinationBySlugFromDb(slug);
      if (!row) notFound();
      const { dest, hotels } = row;
      const statsMap = await getHotelStatsForDestinations([row.dest.id]);
      const destStats = statsMap.get(row.dest.id);
      const data = buildDetailData(dest, hotels, destStats);

      return (
        <div>

          <DestinationHero
            data={data}
            slug={slug}
          />

          <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10">
            <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
              <DestinationGallery images={[data.imageUrl]} title="Galeria" />
            </Suspense>
          </div>
        </div>
      );
    } catch {
      notFound();
    }
  }

  const { getMockDestinationBySlug, getMockHotelsForDestination, isTravelMockEnabled } = await import('@/lib/travel/mock-travel/load');
  const dest = getMockDestinationBySlug(slug);
  if (!dest) notFound();
  const hotels = getMockHotelsForDestination(dest.id).slice(0, 24);
  const mockData = buildDetailData(dest, hotels, null);

  return (
    <div>
      <DestinationHero data={mockData} slug={slug} />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10">
        <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
          <DestinationGallery images={[mockData.imageUrl]} title="Galeria" />
        </Suspense>
      </div>
    </div>
  );
}
