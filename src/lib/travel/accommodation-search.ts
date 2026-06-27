import { prisma } from '../prisma';
import { parseDestinationSlug } from './destination-slug';

// ── Helpers ─────────────────────────────────────────────────────────────────

function safeDecimal(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return parseFloat(v);
  // Prisma Decimal
  if (typeof (v as { toNumber?: unknown }).toNumber === 'function') {
    return (v as { toNumber: () => number }).toNumber();
  }
  return Number(v) || null;
}

function toAmenities(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string');
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }
  return [];
}

// ── Unified response type ───────────────────────────────────────────────────

export interface UnifiedAccommodation {
  id: string;
  source: 'wv_hotel' | 'hotel' | 'accommodation';
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  pricePerNight: number | null;
  currency?: string | null;
  starRating?: number | null;
  rating?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  amenities: string[];
  city?: string | null;
  country?: string | null;
  destinationName?: string;
  destinationSlug?: string;
  url?: string | null;
}

export interface AccommodationSearchResult {
  ok: boolean;
  source: 'aggregation';
  count: number;
  items: UnifiedAccommodation[];
}

// ── Search options ──────────────────────────────────────────────────────────

export interface AccommodationSearchOpts {
  q?: string;
  destinoId?: number;
  slug?: string;
  iata?: string;
  sources?: ('wv_hotel' | 'hotel' | 'accommodation')[];
  limit?: number;
  offset?: number;
}

// ── Normalised response builders ────────────────────────────────────────────

function wvHotelToUnified(
  h: {
    id: number;
    destinoId: number;
    nome: string;
    estrelas: number;
    precoPorNoite: unknown;
    comodidades: unknown;
    latitude: number | null;
    longitude: number | null;
    description: string | null;
    imageUrl: string | null;
    destino?: { nome: string; slug: string } | null;
  },
): UnifiedAccommodation {
  return {
    id: `wv_${h.id}`,
    source: 'wv_hotel',
    name: h.nome,
    slug: h.destino?.slug ? `${h.destino.slug}/hotel/${h.id}` : undefined,
    description: h.description,
    imageUrl: h.imageUrl,
  pricePerNight: safeDecimal(h.precoPorNoite),
  currency: 'EUR',
    starRating: h.estrelas,
    latitude: h.latitude,
    longitude: h.longitude,
    amenities: toAmenities(h.comodidades),
    destinationName: h.destino?.nome,
    destinationSlug: h.destino?.slug,
  };
}

function hotelToUnified(
  h: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    city: string | null;
    country: string | null;
    starRating: number | null;
    pricePerNight: unknown;
    currency: string | null;
    rating: unknown;
    amenities: unknown;
    latitude?: number | null;
    longitude?: number | null;
  },
): UnifiedAccommodation {
  return {
    id: `agency_${h.id}`,
    source: 'hotel',
    name: h.name,
    slug: h.slug,
    description: h.description,
    imageUrl: h.image,
    pricePerNight: safeDecimal(h.pricePerNight),
    currency: h.currency,
    starRating: h.starRating,
    rating: safeDecimal(h.rating),
    city: h.city,
    country: h.country,
    amenities: toAmenities(h.amenities),
  };
}

function accommodationToUnified(
  a: {
    id: string;
    name: string;
    slug: string;
    type: string | null;
    description: string | null;
    image: string | null;
    pricePerNight: unknown;
    currency: string | null;
    rating: unknown;
    latitude: unknown;
    longitude: unknown;
    amenities: unknown;
    address: string | null;
    destination?: { id: string; name: string } | null;
  },
): UnifiedAccommodation {
  return {
    id: `catalog_${a.id}`,
    source: 'accommodation',
    name: a.name,
    slug: a.slug,
    description: a.description,
    imageUrl: a.image,
    pricePerNight: safeDecimal(a.pricePerNight),
    currency: a.currency,
    rating: safeDecimal(a.rating),
  latitude: safeDecimal(a.latitude),
  longitude: safeDecimal(a.longitude),
    amenities: toAmenities(a.amenities),
  destinationName: a.destination?.name,
  destinationSlug: undefined,
  };
}

// ── Search executor ─────────────────────────────────────────────────────────

export async function searchAccommodations(
  opts: AccommodationSearchOpts,
): Promise<AccommodationSearchResult> {
  const limit = Math.min(opts.limit ?? 20, 100);
  const offset = opts.offset ?? 0;
  const sources = opts.sources ?? ['wv_hotel', 'hotel', 'accommodation'];

  // Resolve destination ID from slug if provided
  let destinoId = opts.destinoId;
  if (!destinoId && opts.slug) {
    const parsed = parseDestinationSlug(opts.slug);
    if (parsed) destinoId = parsed.id;
  }

  // Build name filter
  const nameFilter = opts.q?.trim()
    ? { contains: opts.q.trim(), mode: 'insensitive' as const }
    : undefined;

  // Query all selected sources in parallel
  const queries: Promise<UnifiedAccommodation[]>[] = [];

  if (sources.includes('wv_hotel')) {
    queries.push(
      prisma.wvHotel
        .findMany({
          where: {
            ...(destinoId ? { destinoId } : {}),
            ...(nameFilter ? { nome: nameFilter } : {}),
          },
          orderBy: { precoPorNoite: 'asc' },
          take: limit,
          skip: offset,
          select: {
            id: true,
            destinoId: true,
            nome: true,
            estrelas: true,
            precoPorNoite: true,
            comodidades: true,
            latitude: true,
            longitude: true,
            description: true,
            imageUrl: true,
            destino: { select: { nome: true, slug: true } },
          },
        })
        .then((rows: { id: number; destinoId: number; nome: string; estrelas: number; precoPorNoite: unknown; comodidades: unknown; latitude: number | null; longitude: number | null; description: string | null; imageUrl: string | null; destino: { nome: string; slug: string } | null }[]) => rows.map(wvHotelToUnified)),
    );
  }

  if (sources.includes('hotel')) {
    queries.push(
      prisma.hotel
        .findMany({
          where: {
            ...(nameFilter ? { name: nameFilter } : {}),
            published: true,
          },
          orderBy: { pricePerNight: 'asc' },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
            city: true,
            country: true,
            starRating: true,
            pricePerNight: true,
            currency: true,
            rating: true,
            amenities: true,
          },
        })
        .then((rows: { id: string; name: string; slug: string; description: string | null; image: string | null; city: string | null; country: string | null; starRating: number | null; pricePerNight: unknown; currency: string | null; rating: unknown; amenities: unknown }[]) => rows.map(hotelToUnified)),
    );
  }

  if (sources.includes('accommodation')) {
    queries.push(
      prisma.accommodation
        .findMany({
          where: {
            ...(nameFilter ? { name: nameFilter } : {}),
            published: true,
          },
          orderBy: { pricePerNight: 'asc' },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            description: true,
            image: true,
            pricePerNight: true,
            currency: true,
            rating: true,
            latitude: true,
            longitude: true,
            amenities: true,
            address: true,
            destination: { select: { id: true, name: true } },
          },
        })
        .then((rows: { id: string; name: string; slug: string; type: string | null; description: string | null; image: string | null; pricePerNight: unknown; currency: string | null; rating: unknown; latitude: unknown; longitude: unknown; amenities: unknown; address: string | null; destination: { id: string; name: string } | null }[]) => rows.map(accommodationToUnified)),
    );
  }

  const results = await Promise.all(queries);
  const items = results.flat().slice(0, limit);

  return {
    ok: true,
    source: 'aggregation',
    count: items.length,
    items,
  };
}
