import type { MockDestination } from './mock-travel/types';
import { buildDestinationImageQuery, isGenericDestinationImage } from './unsplash';

export const TRAVEL_PLACEHOLDER_IMAGE = '/travel-images/placeholder.svg';

function isCloudflare(): boolean {
  return typeof globalThis !== 'undefined' && 'caches' in globalThis;
}

function localTravelImageExists(publicPath: string): boolean {
  if (isCloudflare()) return false;
  if (!publicPath.startsWith('/travel-images/')) return false;
  try {
    const { existsSync } = require('node:fs');
    const { resolve } = require('node:path');
    const relative = publicPath.replace(/^\//, '').replace(/\//g, '\\');
    return existsSync(resolve(process.cwd(), 'public', relative));
  } catch {
    return false;
  }
}

function normalizeCacheValue(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object' && 'url' in v) return String((v as Record<string, unknown>).url);
  return undefined;
}

let imageCache: Record<string, string> | undefined;

function loadImageCache(): Record<string, string> {
  if (imageCache !== undefined) return imageCache;
  imageCache = {};
  if (isCloudflare()) return imageCache;
  try {
    const { existsSync, readFileSync } = require('node:fs');
    const { resolve } = require('node:path');
    const cachePath = resolve(process.cwd(), 'src/data/travel-mock/unsplash-cache.json');
    if (existsSync(cachePath)) {
      imageCache = JSON.parse(readFileSync(cachePath, 'utf8')) as Record<string, string>;
    }
  } catch {
    imageCache = {};
  }
  return imageCache ?? {};
}

function destCacheKey(dest: { lang?: string; id: number }): string {
  return `d:${dest.lang ?? 'pt'}:${dest.id}`;
}

function lookupCachedUrl(dest: MockDestination): string | undefined {
  const cache = loadImageCache();
  const idKey = destCacheKey(dest);
  const queryKey = (dest.imagem_query ?? buildDestinationImageQuery(dest)).toLowerCase();
  const hit = normalizeCacheValue(cache[idKey]) ?? normalizeCacheValue(cache[queryKey]);
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
