import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { safeFetch } from '@/lib/safe-fetch';
import { getDestinationBySlugFromDb, getHotelStatsForDestinations, isTravelCatalogDbEnabled, mapMarkersFromDbHotels } from '@/lib/travel/catalog-db';
import { resolveDestinationImageUrl, TRAVEL_PLACEHOLDER_IMAGE } from '@/lib/travel/destination-image';
import { resolveDestinationIata } from '@/lib/travel/destination-iata';
import { summarizeCostOfLiving } from '@/lib/travel/cost-tier';
import { resolveMapMarkersForDestination } from '@/lib/travel/travel-map-markers';
import type { DestinationMapMarker } from '@/lib/travel/destination-map';
import { getDestinationReviews } from '@/actions/submit-destination-review';
import { locales } from '@/i18n.config';
import type { MockDestination, MockHotel } from '@/lib/travel/mock-travel/types';
import { DestinationHero } from './components/DestinationHero';
import { DestinationReviews } from './components/DestinationReviews';
import { DestinationJsonLd } from './components/DestinationJsonLd';
import { DestinationHotels } from './components/DestinationHotels';
import { RelatedDestinations } from './components/RelatedDestinations';
import { DestinationMap } from '@/app/components/travel/DestinationMap';
import { DestinationTipsPanel } from '@/app/components/travel/DestinationTipsPanel';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/app/components/ui/breadcrumb';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

const DestinationGallery = nextDynamic(() => import('./components/DestinationGallery').then((mod) => mod.DestinationGallery));

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const { slug } = await params;
  const siteUrl = 'https://www.akmleva.pt';

  let nome = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  let imageUrl = TRAVEL_PLACEHOLDER_IMAGE;
  let resumo = '';
  let pais = '';

  try {
    const row = await getDestinationBySlugFromDb(slug);
    if (row) {
      const img = resolveDestinationImageUrl(row.dest);
      if (img) imageUrl = img;
      nome = row.dest.nome;
      resumo = row.dest.resumo ?? '';
      pais = row.dest.pais ?? '';
    }
  } catch {
    /* metadata falls back to slug-derived values */
  }

  const t = await getTranslations({ locale, namespace: 'destination' });
  const title = `${nome}${pais ? `, ${pais}` : ''} | AKMLEVA`;
  const description = resumo
    ? resumo.slice(0, 160)
    : t('metaDescription', { name: nome });

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/destinations/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/destinations/${slug}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/destinations/${slug}`,
      siteName: 'AKMLEVA',
      locale: locale === 'pt' ? 'pt_PT' : locale,
      images: imageUrl !== TRAVEL_PLACEHOLDER_IMAGE ? [{ url: imageUrl }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl !== TRAVEL_PLACEHOLDER_IMAGE ? [imageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  if (!isTravelCatalogDbEnabled()) return [];
  try {
    const top = await prisma.wvDestination.findMany({
      take: 200,
      orderBy: { hotelCount: 'desc' },
      select: { id: true, lang: true },
    });
    return top.map((d: { id: number; lang: string }) => ({
      locale: d.lang,
      slug: `${d.lang}-${d.id}`,
    }));
  } catch {
    return [];
  }
}

type DetailData = {
  slug: string;
  id: number;
  lang: string;
  nome: string;
  pais: string;
  paisCode: string;
  continente: string;
  iata: string | null;
  tipo: string;
  clima: string;
  imageUrl: string;
  descricao?: string;
  descricaoCompleta?: string;
  resumo?: string;
  veja: string[];
  faca: string[];
  coma: string[];
  dicas: Record<string, unknown>;
  tags: string[];
  wikipedia_resumo?: string;
  wikipedia_url?: string;
  clima_tempo: MockDestination['clima_tempo'];
  custo_de_vida: MockDestination['custo_de_vida'];
  costOfLiving: ReturnType<typeof summarizeCostOfLiving>;
  transporte: MockDestination['transporte'];
  latitude?: number;
  longitude?: number;
  wikivoyageUrl?: string;
  license: string;
  imageAttribution: MockDestination['imagem_attribuicao'];
  hotels: MockHotel[];
  hotelTypes: Record<string, number> | null;
  mapMarkers: DestinationMapMarker[];
};

function buildDetailData(
  dest: MockDestination,
  hotels: MockHotel[],
  statsMap: { avgStars: number | null; hotelTypes: Record<string, number> | null } | null,
  slug: string,
): DetailData {
  return {
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
    imageAttribution: dest.imagem_attribuicao ?? undefined,
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
  const locale = await getLocale();

  if (isTravelCatalogDbEnabled()) {
    const row = await safeFetch(() => getDestinationBySlugFromDb(slug), null);
    if (!row) notFound();

    const { dest, hotels } = row;
    const statsMap = await safeFetch(() => getHotelStatsForDestinations([row.dest.id]), null);
    const destStats = statsMap?.get(row.dest.id) ?? null;
    const data = buildDetailData(dest, hotels, destStats, slug);
    const reviews = await safeFetch(() => getDestinationReviews(dest.id), []);

    const t = await getTranslations('destination');

    return (
      <div>
        <DestinationJsonLd data={data} />

        <DestinationHero
          data={data}
          slug={slug}
        />

        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${locale}`}>{t('breadcrumbHome')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${locale}/destinations`}>{t('breadcrumbDestinations')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.nome}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
            <DestinationGallery images={[data.imageUrl]} title="Galeria" />
          </Suspense>

          <section className="rounded-xl bg-gradient-to-r from-primary to-accent p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">{t('reservationCtaTitle')}</h2>
            <p className="mb-6 text-white/90 max-w-lg mx-auto">
              {t('reservationCtaDesc', { name: data.nome })}
            </p>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="gap-2 bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Link href={`/${locale}/destinations?q=${encodeURIComponent(data.nome)}`}>
                <Calendar className="h-5 w-5" />
                {t('reservationCtaButton')}
              </Link>
            </Button>
          </section>

          <Suspense fallback={<Skeleton className="h-80 w-full rounded-xl" />}>
            <DestinationHotels
              hotels={data.hotels}
              labels={{
                hotels: t('hotels'),
                perNight: t('perNight'),
                viewDetails: t('moreInfo'),
              }}
              accommodationTypes={t.raw('accommodationTypes')}
            />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
            <DestinationMap
              data={{ nome: data.nome, latitude: data.latitude, longitude: data.longitude, transporte: data.transporte }}
              markers={data.mapMarkers}
            />
          </Suspense>

          {data.dicas && Object.keys(data.dicas).length > 0 && (
            <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
              <DestinationTipsPanel
                dicas={data.dicas}
                labels={{
                  panelTitle: t('tipsTitle'),
                  seguranca: t('seguranca'),
                  respeite: t('respeite'),
                  comunique: t('comunique'),
                  beba: t('beba'),
                  dinheiro: t('dinheiro'),
                  saude: t('saude'),
                  transporte: t('transporte'),
                  horarios: t('horarios'),
                  compre: t('compre'),
                  clima: t('clima'),
                }}
              />
            </Suspense>
          )}

          <div id="reviews">
            <Suspense fallback={<Skeleton className="h-48 w-full rounded-xl" />}>
              <DestinationReviews destinoId={dest.id} initialReviews={reviews} />
            </Suspense>
          </div>

          <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
            <RelatedDestinations
              currentDestId={dest.id}
              lang={data.lang}
              pais={data.pais ?? undefined}
              continente={data.continente ?? undefined}
              locale={locale}
              labels={{
                relatedDestinationsTitle: t('relatedDestinationsTitle'),
                viewDestination: t('moreInfo'),
              }}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  const { getMockDestinationBySlug, getMockHotelsForDestination, isTravelMockEnabled } = await import('@/lib/travel/mock-travel/load');
  const dest = getMockDestinationBySlug(slug);
  if (!dest) notFound();
  const hotels = getMockHotelsForDestination(dest.id).slice(0, 24);
  const mockData = buildDetailData(dest, hotels, null, slug);
  const t = await getTranslations('destination');

  return (
    <div>
      <DestinationJsonLd data={mockData} />
      <DestinationHero data={mockData} slug={slug} />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${locale}`}>{t('breadcrumbHome')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${locale}/destinations`}>{t('breadcrumbDestinations')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{mockData.nome}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
          <DestinationGallery images={[mockData.imageUrl]} title="Galeria" />
        </Suspense>

        <section className="rounded-xl bg-gradient-to-r from-primary to-accent p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">{t('reservationCtaTitle')}</h2>
          <p className="mb-6 text-white/90 max-w-lg mx-auto">
            {t('reservationCtaDesc', { name: mockData.nome })}
          </p>
          <Button asChild variant="secondary" size="lg" className="gap-2 bg-white text-primary hover:bg-white/90 font-semibold">
            <Link href={`/${locale}/destinations?q=${encodeURIComponent(mockData.nome)}`}>
              <Calendar className="h-5 w-5" />
              {t('reservationCtaButton')}
            </Link>
          </Button>
        </section>

        <Suspense fallback={<Skeleton className="h-80 w-full rounded-xl" />}>
          <DestinationHotels
            hotels={mockData.hotels}
            labels={{
              hotels: t('hotels'),
              perNight: t('perNight', { fallback: 'noite' }),
              viewDetails: t('moreInfo'),
            }}
            accommodationTypes={t.raw('accommodationTypes')}
          />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
          <DestinationMap
            data={{ nome: mockData.nome, latitude: mockData.latitude, longitude: mockData.longitude, transporte: mockData.transporte }}
            markers={mockData.mapMarkers}
          />
        </Suspense>

        {mockData.dicas && Object.keys(mockData.dicas).length > 0 && (
          <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
            <DestinationTipsPanel
              dicas={mockData.dicas}
              labels={{
                panelTitle: t('tipsTitle'),
                seguranca: t('seguranca'),
                respeite: t('respeite'),
                comunique: t('comunique'),
                beba: t('beba'),
                dinheiro: t('dinheiro'),
                saude: t('saude'),
                transporte: t('transporte'),
                horarios: t('horarios'),
                compre: t('compre'),
                clima: t('clima'),
              }}
            />
          </Suspense>
        )}

        <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
          <RelatedDestinations
            currentDestId={mockData.id}
            lang={mockData.lang}
            pais={mockData.pais ?? undefined}
            continente={mockData.continente ?? undefined}
            locale={locale}
            labels={{
              relatedDestinationsTitle: t('relatedDestinationsTitle'),
              viewDestination: t('moreInfo'),
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
