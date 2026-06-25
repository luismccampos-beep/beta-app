import type { MockDestination } from '../mock-travel/types';
import { buildDestinationSlug } from '../destination-slug';
import { resolveDestinationImageUrl } from '../destination-image';
import { resolveDestinationIata } from '../destination-iata';

export type DestinationDTO = {
  id: number;
  slug: string;
  lang: string;
  nome: string;
  pais: string;
  paisCode: string;
  continente: string;
  iata: string | null;
  tipo: string;
  clima: string;
  descricao: string;
  imageUrl: string;
  latitude?: number;
  longitude?: number;
  avgStars?: number | null;
  hotelTypes?: Record<string, number> | null;
};

export function toDestinationDTO(
  dest: MockDestination,
  extra?: { avgStars?: number | null; hotelTypes?: Record<string, number> | null },
): DestinationDTO {
  return {
    id: dest.id,
    slug: buildDestinationSlug(dest),
    lang: dest.lang ?? 'pt',
    nome: dest.nome,
    pais: dest.pais,
    paisCode: dest.paisCode,
    continente: dest.continente,
    iata: resolveDestinationIata(dest),
    tipo: dest.tipo,
    clima: dest.clima,
    descricao: dest.descricao,
    imageUrl: resolveDestinationImageUrl(dest),
    latitude: dest.latitude,
    longitude: dest.longitude,
    avgStars: extra?.avgStars ?? null,
    hotelTypes: extra?.hotelTypes ?? null,
  };
}

export function toDestinationDTOFromRow(row: {
  id: number;
  lang: string;
  nome: string;
  pais: string;
  paisCode: string;
  continente: string | null;
  iata: string | null;
  tipo: string | null;
  clima: string | null;
  descricao: string | null;
  imagemUrl: string | null;
  imagemQuery: string | null;
  latitude: number | null;
  longitude: number | null;
  slug: string;
  transporte: unknown;
  hotelCount?: number | null;
}, extra?: { avgStars?: number | null; hotelTypes?: Record<string, number> | null }): DestinationDTO {
  return {
    id: row.id,
    slug: row.slug,
    lang: row.lang,
    nome: row.nome,
    pais: row.pais,
    paisCode: row.paisCode,
    continente: row.continente ?? 'Europa',
    iata: resolveDestinationIata({
      iata: row.iata,
      transporte: row.transporte as MockDestination['transporte'],
    }),
    tipo: row.tipo ?? 'cidade',
    clima: row.clima ?? 'continental',
    descricao: row.descricao ?? '',
    imageUrl: resolveDestinationImageFromFields({
      id: row.id,
      lang: row.lang,
      nome: row.nome,
      pais: row.pais,
      paisCode: row.paisCode,
      tipo: row.tipo,
      continente: row.continente,
      imagem_url: row.imagemUrl,
      imagem_query: row.imagemQuery,
    }),
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    avgStars: extra?.avgStars ?? null,
    hotelTypes: extra?.hotelTypes ?? null,
  };
}

function resolveDestinationImageFromFields(input: {
  id: number;
  lang?: string;
  nome: string;
  pais: string;
  paisCode?: string;
  tipo?: string | null;
  continente?: string | null;
  imagem_url?: string | null;
  imagem_query?: string | null;
}): string {
  return resolveDestinationImageUrl({
    id: input.id,
    lang: input.lang ?? 'pt',
    nome: input.nome,
    pais: input.pais,
    paisCode: input.paisCode ?? 'XX',
    continente: input.continente ?? 'Europa',
    iata: null,
    tipo: input.tipo ?? 'cidade',
    clima: 'continental',
    descricao: '',
    imagem_url: input.imagem_url ?? '',
    imagem_query: input.imagem_query ?? undefined,
  });
}
