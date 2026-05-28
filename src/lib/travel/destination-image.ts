import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { MockDestination } from './mock-travel/types';
import { buildDestinationImageQuery, isGenericDestinationImage } from './unsplash';

export const TRAVEL_PLACEHOLDER_IMAGE = '/travel-images/placeholder.svg';

const UNSPLASH_CACHE_PATH = resolve(process.cwd(), 'src/data/travel-mock/unsplash-cache.json');

let imageCache: Record<string, string> | undefined;

function loadImageCache(): Record<string, string> {
  if (imageCache !== undefined) return imageCache;
  imageCache = {};
  if (!existsSync(UNSPLASH_CACHE_PATH)) return imageCache;
  try {
    imageCache = JSON.parse(readFileSync(UNSPLASH_CACHE_PATH, 'utf8')) as Record<string, string>;
  } catch {
    imageCache = {};
  }
  return imageCache;
}

function destCacheKey(dest: { lang?: string; id: number }): string {
  return `d:${dest.lang ?? 'pt'}:${dest.id}`;
}

function localTravelImageExists(publicPath: string): boolean {
  if (!publicPath.startsWith('/travel-images/')) return false;
  const relative = publicPath.replace(/^\//, '').replace(/\//g, '\\');
  return existsSync(resolve(process.cwd(), 'public', relative));
}

function lookupCachedUrl(dest: MockDestination): string | undefined {
  const cache = loadImageCache();
  const idKey = destCacheKey(dest);
  const queryKey = (dest.imagem_query ?? buildDestinationImageQuery(dest)).toLowerCase();
  const hit = cache[idKey] ?? cache[queryKey];
  if (!hit?.trim() || isGenericDestinationImage(hit)) return undefined;
  return hit;
}

export function resolveDestinationImageFromFields(input: {
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

/** Hero image: DB/bundle URL → per-dest cache → query cache → placeholder. */
export function resolveDestinationImageUrl(dest: MockDestination): string {
  const raw = dest.imagem_url?.trim() ?? '';
  const cached = lookupCachedUrl(dest);

  if (raw.startsWith('/travel-images/')) {
    if (raw === TRAVEL_PLACEHOLDER_IMAGE) return raw;
    if (localTravelImageExists(raw)) return raw;
    return cached ?? TRAVEL_PLACEHOLDER_IMAGE;
  }

  if (raw && !isGenericDestinationImage(raw)) return raw;

  return cached ?? (raw || TRAVEL_PLACEHOLDER_IMAGE);
}
