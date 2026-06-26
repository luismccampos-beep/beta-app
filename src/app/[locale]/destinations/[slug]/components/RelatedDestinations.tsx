import Link from 'next/link';
import Image from 'next/image';
import { searchDestinationsDb } from '@/lib/travel/catalog-db';
import { buildDestinationSlug } from '@/lib/travel/destination-slug';
import { resolveDestinationImageFromFields } from '@/lib/travel/destination-image';
import { resolveDestinationIata } from '@/lib/travel/destination-iata';
import { Button } from '@/app/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import type { MockDestination } from '@/lib/travel/mock-travel/types';

type Props = {
  currentDestId: number;
  lang: string;
  pais?: string;
  continente?: string;
  locale: string;
  labels: {
    relatedDestinationsTitle: string;
    viewDestination: string;
  };
};

export async function RelatedDestinations({
  currentDestId,
  lang,
  pais,
  continente,
  locale,
  labels,
}: Props) {
  let items: Array<{
    id: string;
    slug: string;
    nome: string;
    pais: string;
    imageUrl: string;
    iata: string | null;
  }> = [];

  try {
    const result = await searchDestinationsDb({
      pais,
      lang,
      limit: 4,
    });

    items = result.items
      .filter((r) => String(r.id) !== String(currentDestId))
      .slice(0, 3)
      .map((r) => ({
        id: String(r.id),
        slug: r.slug,
        nome: r.nome,
        pais: r.pais,
        imageUrl: resolveDestinationImageFromFields({
          id: r.id,
          lang: r.lang,
          nome: r.nome,
          pais: r.pais,
          tipo: r.tipo,
          continente: r.continente,
        }),
        iata: resolveDestinationIata({
          iata: r.iata,
          transporte: null,
        } as MockDestination),
      }));
  } catch {
    return null;
  }

  if (items.length === 0) {
    try {
      const result = await searchDestinationsDb({
        continente,
        lang,
        limit: 5,
      });
      items = result.items
        .filter((r) => String(r.id) !== String(currentDestId))
        .slice(0, 3)
        .map((r) => ({
          id: String(r.id),
          slug: r.slug,
          nome: r.nome,
          pais: r.pais,
          imageUrl: resolveDestinationImageFromFields({
            id: r.id,
            lang: r.lang,
            nome: r.nome,
            pais: r.pais,
            tipo: r.tipo,
            continente: r.continente,
          }),
          iata: resolveDestinationIata({
            iata: r.iata,
            transporte: null,
          } as MockDestination),
        }));
    } catch {
      return null;
    }
  }

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{labels.relatedDestinationsTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${locale}/destinations/${item.slug}`}
            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.nome}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 text-white">
                <h3 className="font-bold leading-tight">{item.nome}</h3>
                <p className="flex items-center gap-1 text-xs text-white/80">
                  <MapPin className="h-3 w-3" />
                  {item.pais}
                  {item.iata ? ` · ${item.iata}` : ''}
                </p>
              </div>
            </div>
            <div className="p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-1 text-teal-600 dark:text-teal-400 hover:text-teal-700"
                asChild
              >
                <span>
                  {labels.viewDestination}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
