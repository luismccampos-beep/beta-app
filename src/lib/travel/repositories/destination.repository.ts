import { prisma } from '../../prisma';
import type { SearchDestinationsInput } from '../schemas/destination.schema';

const destinationSelect = {
  id: true,
  slug: true,
  lang: true,
  nome: true,
  pais: true,
  paisCode: true,
  continente: true,
  iata: true,
  tipo: true,
  clima: true,
  descricao: true,
  imagemUrl: true,
  imagemQuery: true,
  transporte: true,
  hotelCount: true,
  latitude: true,
  longitude: true,
} as const;

const destinationDetailSelect = {
  id: true,
  lang: true,
  nome: true,
  pais: true,
  paisCode: true,
  continente: true,
  iata: true,
  tipo: true,
  clima: true,
  descricao: true,
  descricaoCompleta: true,
  resumo: true,
  veja: true,
  faca: true,
  coma: true,
  dicas: true,
  tags: true,
  wikivoyageUrl: true,
  wikipediaResumo: true,
  wikipediaUrl: true,
  climaTempo: true,
  custoDeVida: true,
  transporte: true,
  latitude: true,
  longitude: true,
  imagemUrl: true,
  imagemQuery: true,
  hotelCount: true,
} as const;

export async function searchDestinations(opts: SearchDestinationsInput) {
  const limit = Math.min(opts.limit ?? 24, 100);
  const offset = opts.offset ?? 0;
  const where: Record<string, unknown> = {};

  if (opts.q?.trim()) {
    where.nome = { contains: opts.q.trim(), mode: 'insensitive' };
  }
  if (opts.pais?.trim()) {
    where.pais = { equals: opts.pais.trim(), mode: 'insensitive' };
  }
  if (opts.continente?.trim()) {
    where.continente = { equals: opts.continente.trim(), mode: 'insensitive' };
  }
  if (opts.lang?.trim()) {
    where.lang = opts.lang.trim();
  }

  const types = opts.hotelTypes?.filter(Boolean);
  if (types && types.length > 0) {
    const matchingDestIds = await prisma.wvHotel.findMany({
      where: {
        tipoAlojamento: { in: types },
        NOT: { fonte: 'rejected_geo' },
      },
      select: { destinoId: true },
      distinct: ['destinoId'],
    });
    const ids = matchingDestIds.map((r: any) => r.destinoId);
    if (ids.length === 0) {
      return { items: [], total: 0 };
    }
    where.id = { in: ids };
  }

  const [rows, total] = await Promise.all([
    prisma.wvDestination.findMany({
      where: where as any,
      orderBy: { nome: 'asc' },
      skip: offset,
      take: limit,
      select: destinationSelect,
    }),
    prisma.wvDestination.count({ where: where as any }),
  ]);

  return { items: rows as unknown as typeof destinationSelect[], total };
}

export async function getHotelStatsForDestinations(destinoIds: number[]) {
  if (destinoIds.length === 0) return new Map<number, { avgStars: number | null; hotelTypes: Record<string, number> | null }>();

  const grouped = await prisma.wvHotel.groupBy({
    by: ['destinoId', 'tipoAlojamento'],
    where: {
      destinoId: { in: destinoIds },
      NOT: { fonte: 'rejected_geo' },
    },
    _count: { _all: true },
    _avg: { estrelas: true },
  });

  const map = new Map<number, { avgStars: number | null; hotelTypes: Record<string, number> | null }>();
  for (const row of grouped) {
    const existing = map.get(row.destinoId) ?? { avgStars: null, hotelTypes: {} };
    const tipo = row.tipoAlojamento ?? 'hotel';
    existing.hotelTypes![tipo] = (existing.hotelTypes![tipo] ?? 0) + row._count._all;
    map.set(row.destinoId, existing);
  }

  const avgRows = await prisma.wvHotel.groupBy({
    by: ['destinoId'],
    where: {
      destinoId: { in: destinoIds },
      NOT: { fonte: 'rejected_geo' },
    },
    _avg: { estrelas: true },
  });
  for (const row of avgRows) {
    const existing = map.get(row.destinoId);
    if (existing) {
      existing.avgStars = row._avg.estrelas ? Math.round(row._avg.estrelas * 10) / 10 : null;
    }
  }

  return map;
}

export async function getDestinationBySlug(slug: string) {
  const { parseDestinationSlug } = await import('../destination-slug');
  const parsed = parseDestinationSlug(slug);
  if (!parsed) return null;

  const row = await prisma.wvDestination.findFirst({
    where: { id: parsed.id, lang: parsed.lang },
    select: destinationDetailSelect,
  });
  if (!row) return null;

  const hotels = await prisma.wvHotel.findMany({
    where: { destinoId: row.id },
    orderBy: { precoPorNoite: 'asc' },
    take: 24,
    select: {
      id: true,
      destinoId: true,
      nome: true,
      estrelas: true,
      precoPorNoite: true,
      comodidades: true,
      fonte: true,
      latitude: true,
      longitude: true,
      description: true,
      imageUrl: true,
      googlePlaceId: true,
      wikidataId: true,
      tipoAlojamento: true,
    },
  });

  return { row, hotels };
}

export async function getHotelsNearby(opts: {
  lat: number;
  lng: number;
  radiusKm?: number;
  minStars?: number;
  limit?: number;
}) {
  const { boundingBox, haversineKm } = await import('../geo');
  const radiusKm = Math.min(Math.max(opts.radiusKm ?? 10, 0.5), 100);
  const limit = Math.min(opts.limit ?? 50, 100);
  const box = boundingBox(opts.lat, opts.lng, radiusKm);

  const rows = await prisma.wvHotel.findMany({
    where: {
      latitude: { gte: box.latMin, lte: box.latMax },
      longitude: { gte: box.lonMin, lte: box.lonMax },
      NOT: { fonte: 'rejected_geo' },
      ...(opts.minStars != null && opts.minStars > 0
        ? { estrelas: { gte: opts.minStars } }
        : {}),
    },
    select: {
      id: true,
      destinoId: true,
      nome: true,
      estrelas: true,
      precoPorNoite: true,
      comodidades: true,
      fonte: true,
      latitude: true,
      longitude: true,
      description: true,
      imageUrl: true,
      googlePlaceId: true,
      wikidataId: true,
      tipoAlojamento: true,
      destino: { select: { nome: true, pais: true } },
    },
    take: limit * 4,
  });

  return rows
    .filter((h: any) => h.latitude != null && h.longitude != null)
    .map((h: any) => ({
      ...h,
      distance_km: Math.round(haversineKm(opts.lat, opts.lng, h.latitude!, h.longitude!) * 100) / 100,
      city: h.destino?.nome,
      country: h.destino?.pais,
    }))
    .filter((h: any) => h.distance_km <= radiusKm)
    .sort((a: any, b: any) => a.distance_km - b.distance_km)
    .slice(0, limit);
}
