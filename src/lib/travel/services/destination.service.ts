import { SearchDestinationsSchema, type SearchDestinationsInput } from '../schemas/destination.schema';
import * as destinationRepo from '../repositories/destination.repository';
import { toDestinationDTOFromRow } from '../dto/destination.dto';
import { isTravelCatalogDbEnabled } from '../catalog-db';
import { loadMockTravelBundle } from '../mock-travel/load';
import { buildDestinationSlug } from '../destination-slug';
import { resolveDestinationImageUrl } from '../destination-image';
import { resolveDestinationIata } from '../destination-iata';
import type { MockDestination } from '../mock-travel/types';

export async function searchDestinations(input: unknown) {
  const validated = SearchDestinationsSchema.parse(input);

  if (isTravelCatalogDbEnabled()) {
    try {
      return await searchDestinationsFromDb(validated);
    } catch (err) {
      console.error('[searchDestinations] DB query failed, falling back to bundle:', err);
    }
  }

  return searchDestinationsFromBundle(validated);
}

async function searchDestinationsFromDb(opts: SearchDestinationsInput) {
  const { items, total } = await destinationRepo.searchDestinations(opts);
  const destIds = items.map((r: any) => r.id);
  const hotelStatsMap = await destinationRepo.getHotelStatsForDestinations(destIds);

  return {
    total,
    source: 'db' as const,
    items: items.map((r: any) => {
      const stats = hotelStatsMap.get(r.id);
      return toDestinationDTOFromRow(r, {
        avgStars: stats?.avgStars ?? null,
        hotelTypes: stats?.hotelTypes ?? null,
      });
    }),
  };
}

async function searchDestinationsFromBundle(opts: SearchDestinationsInput) {
  let items: MockDestination[];
  try {
    const bundle = loadMockTravelBundle();
    items = bundle.destinos;
  } catch {
    return { total: 0, source: 'bundle' as const, items: [] };
  }

  const q = opts.q?.toLowerCase();
  const pais = opts.pais?.toLowerCase();
  const continente = opts.continente?.toLowerCase();
  const lang = opts.lang;

  if (q) items = items.filter((d) => d.nome.toLowerCase().includes(q));
  if (pais) items = items.filter((d) => d.pais.toLowerCase().includes(pais));
  if (continente) items = items.filter((d) => d.continente.toLowerCase() === continente);
  if (lang) items = items.filter((d) => (d.lang ?? 'pt') === lang);

  const total = items.length;
  const limit = Math.min(opts.limit, 100);
  const slice = items.slice(opts.offset, opts.offset + limit);

  return {
    total,
    source: 'bundle' as const,
    items: slice.map((d) => ({
      id: d.id,
      slug: buildDestinationSlug(d),
      lang: d.lang ?? 'pt',
      nome: d.nome,
      pais: d.pais,
      paisCode: d.paisCode,
      continente: d.continente,
      iata: resolveDestinationIata(d),
      tipo: d.tipo,
      clima: d.clima,
      descricao: d.descricao,
      imageUrl: resolveDestinationImageUrl(d),
      latitude: d.latitude,
      longitude: d.longitude,
      avgStars: null,
      hotelTypes: null,
    })),
  };
}
