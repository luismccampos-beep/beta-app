import { prisma } from '../prisma';
import { buildDestinationSlug, parseDestinationSlug } from './destination-slug';
import { summarizeCostOfLiving } from './cost-tier';
import { boundingBox, haversineKm } from './geo';
import { buildTravelMapMarkers, type DestinationMapMarker } from './destination-map';
import { resolveDestinationImageFromFields } from './destination-image';
import { resolveDestinationIata } from './destination-iata';
import { isAccommodationHotel } from './hotel-filter';
import type { MockDestination, MockFlight, MockHotel } from './mock-travel/types';

type WvHotelRow = {
  id: number;
  destinoId: number;
  nome: string;
  estrelas: number;
  precoPorNoite: number | string | null;
  comodidades: unknown;
  fonte: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  imageUrl: string | null;
  googlePlaceId: string | null;
  wikidataId: string | null;
  tipoAlojamento: string | null;
};

function rowToHotel(h: WvHotelRow, extra?: { distance_km?: number }): MockHotel {
  return {
    id: h.id,
    destino_id: h.destinoId,
    nome: h.nome,
    estrelas: h.estrelas,
    preco_por_noite: typeof h.precoPorNoite === 'number' ? h.precoPorNoite : Number(h.precoPorNoite),
    comodidades: (h.comodidades as string[]) ?? [],
    latitude: h.latitude,
    longitude: h.longitude,
    description: h.description,
    image_url: h.imageUrl,
    google_place_id: h.googlePlaceId,
    wikidata_id: h.wikidataId,
    fonte: h.fonte,
    tipo_alojamento: h.tipoAlojamento,
    ...extra,
  };
}

const hotelSelect = {
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
} as const;

/** Aggregates avg stars and hotel type breakdown for a list of destination IDs. */
export async function getHotelStatsForDestinations(
  destinoIds: number[],
): Promise<Map<number, { avgStars: number | null; hotelTypes: Record<string, number> | null }>> {
  if (destinoIds.length === 0) return new Map();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped = await (prisma.wvHotel.groupBy as any)({
    by: ['destinoId', 'tipoAlojamento'],
    where: {
      destinoId: { in: destinoIds },
      NOT: { fonte: 'rejected_geo' },
    },
    _count: { _all: true },
    _avg: { estrelas: true },
  });

  const map = new Map<number, { avgStars: number | null; hotelTypes: Record<string, number> }>();
  for (const row of grouped) {
    const existing = map.get(row.destinoId) ?? { avgStars: null, hotelTypes: {} };
    const tipo = row.tipoAlojamento ?? 'hotel';
    existing.hotelTypes[tipo] = (existing.hotelTypes[tipo] ?? 0) + row._count._all;
    // Weighted avg will be computed after
    map.set(row.destinoId, existing);
  }

  // Compute proper avg stars per destination
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const avgRows = await (prisma.wvHotel.groupBy as any)({
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

export function rowToDestination(row: {
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
  descricaoCompleta: string | null;
  resumo: string | null;
  veja: unknown;
  faca: unknown;
  coma: unknown;
  dicas: unknown;
  tags: unknown;
  wikivoyageUrl: string | null;
  wikipediaResumo: string | null;
  wikipediaUrl: string | null;
  climaTempo: unknown;
  custoDeVida: unknown;
  transporte: unknown;
  latitude: number | null;
  longitude: number | null;
  imagemUrl: string | null;
  imagemQuery: string | null;
}): MockDestination {
  return {
    id: row.id,
    lang: row.lang,
    nome: row.nome,
    pais: row.pais,
    paisCode: row.paisCode,
    continente: row.continente ?? 'Europa',
    iata: row.iata,
    tipo: row.tipo ?? 'cidade',
    clima: row.clima ?? 'continental',
    descricao: row.descricao ?? '',
    descricaoCompleta: row.descricaoCompleta ?? undefined,
    resumo: row.resumo ?? undefined,
    veja: (row.veja as string[]) ?? undefined,
    faca: (row.faca as string[]) ?? undefined,
    coma: (row.coma as string[]) ?? undefined,
    dicas: (row.dicas as MockDestination['dicas']) ?? undefined,
    tags: (row.tags as string[]) ?? undefined,
    wikivoyageUrl: row.wikivoyageUrl ?? undefined,
    wikipedia_resumo: row.wikipediaResumo ?? undefined,
    wikipedia_url: row.wikipediaUrl ?? undefined,
    clima_tempo: row.climaTempo as MockDestination['clima_tempo'],
    custo_de_vida: row.custoDeVida as MockDestination['custo_de_vida'],
    transporte: row.transporte as MockDestination['transporte'],
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,

    imagem_url: row.imagemUrl ?? '',
    imagem_query: row.imagemQuery ?? undefined,
  };
}

export async function getCatalogStatsFromDb() {
  const [destinos, hoteis, voos, listings, cities] = await Promise.all([
    prisma.wvDestination.count(),
    prisma.wvHotel.count(),
    prisma.wvFlight.count(),
    prisma.wvListing.count(),
    prisma.colCity.count(),
  ]);
  return { destinos, hoteis, voos, listings, colCities: cities, source: 'db' as const };
}

export async function searchDestinationsDb(opts: {
  q?: string;
  pais?: string;
  continente?: string;
  lang?: string;
  limit?: number;
  offset?: number;
  hotelTypes?: string[];
}) {
  const limit = Math.min(opts.limit ?? 24, 100);
  const offset = opts.offset ?? 0;
  const where: {
    id?: { in: number[] };
    nome?: { contains: string; mode: 'insensitive' };
    pais?: { equals: string; mode: 'insensitive' };
    continente?: { equals: string; mode: 'insensitive' };
    lang?: string;
  } = {};

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

  // If filtering by accommodation type(s), find destination IDs that have hotels matching any of the types
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
    const ids = matchingDestIds.map((r: { destinoId: number }) => r.destinoId);
    if (ids.length === 0) {
      // No destinations with these hotel types — return empty immediately
      return { total: 0, items: [] };
    }
    where.id = { in: ids };
  }

  const [rows, total] = await Promise.all([
    prisma.wvDestination.findMany({
      where,
      orderBy: { nome: 'asc' },
      skip: offset,
      take: limit,
      select: {
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
      },
    }),
    prisma.wvDestination.count({ where }),
  ]);

  // Aggregate hotel stats (avg stars, type breakdown) for all visible destinations
  const destIds = rows.map((r: { id: number }) => r.id);
  const hotelStatsMap = await getHotelStatsForDestinations(destIds);

  return {
    total,
    items: rows.map((r: { id: number; slug: string; lang: string; nome: string; pais: string; paisCode: string; continente: string | null; iata: string | null; tipo: string | null; clima: string | null; descricao: string | null; imagemUrl: string | null; imagemQuery: string | null; transporte: unknown; hotelCount: number | null; latitude: number | null; longitude: number | null }) => {
      const stats = hotelStatsMap.get(r.id);
      return {
        ...r,
        slug: r.slug,
        iata: resolveDestinationIata({ iata: r.iata, transporte: r.transporte as MockDestination['transporte'] }),
        imageUrl: resolveDestinationImageFromFields({
          id: r.id,
          lang: r.lang,
          nome: r.nome,
          pais: r.pais,
          paisCode: r.paisCode,
          tipo: r.tipo,
          continente: r.continente,
          imagem_url: r.imagemUrl,
          imagem_query: r.imagemQuery,
        }),
        avgStars: stats?.avgStars ?? null,
        hotelTypes: stats?.hotelTypes ?? null,
      };
    }),
  };
}

export async function getDestinationBySlugFromDb(slug: string) {
  const parsed = parseDestinationSlug(slug);
  if (!parsed) return null;

  const row = await prisma.wvDestination.findFirst({
    where: { id: parsed.id, lang: parsed.lang },
  });
  if (!row) return null;

  const dest = rowToDestination(row);
  const hotels = await prisma.wvHotel.findMany({
    where: { destinoId: row.id },
    orderBy: { precoPorNoite: 'asc' },
    take: 24,
    select: hotelSelect,
  });

  return {
    dest,
    slug: buildDestinationSlug(dest),
    hotels: hotels.map((h: WvHotelRow) => rowToHotel(h)),
  };
}

/** Marcadores OSM a partir de hotéis com coordenadas na DB (preferível ao índice JSON). */
export function mapMarkersFromDbHotels(
  dest: MockDestination,
  hotels: MockHotel[],
  maxHotels = 4,
): DestinationMapMarker[] {
  const hotelPoints = hotels
    .filter(
      (h) =>
        h.latitude != null &&
        h.longitude != null &&
        Number.isFinite(h.latitude) &&
        Number.isFinite(h.longitude),
    )
    .slice(0, maxHotels)
    .map((h) => ({
      lat: h.latitude!,
      lon: h.longitude!,
      label: h.nome,
    }));

  return buildTravelMapMarkers(
    {
      nome: dest.nome,
      latitude: dest.latitude,
      longitude: dest.longitude,
      transporte: dest.transporte,
    },
    hotelPoints,
    maxHotels,
  );
}

export async function getHotelByIdFromDb(id: number) {
  const row = await prisma.wvHotel.findUnique({
    where: { id },
    select: {
      ...hotelSelect,
      destino: { select: { nome: true, pais: true, slug: true, lang: true, id: true } },
    },
  });
  if (!row) return null;

  const hotel = rowToHotel(row);
  const dest = row.destino
    ? {
        id: row.destinoId,
        nome: row.destino.nome,
        pais: row.destino.pais,
        slug: row.destino.slug,
      }
    : null;

  return { hotel, dest };
}

export async function getHotelsNearbyFromDb(opts: {
  lat: number;
  lng: number;
  radiusKm?: number;
  minStars?: number;
  limit?: number;
}) {
  const lat = opts.lat;
  const lng = opts.lng;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

  const radiusKm = Math.min(Math.max(opts.radiusKm ?? 10, 0.5), 100);
  const limit = Math.min(opts.limit ?? 50, 100);
  const box = boundingBox(lat, lng, radiusKm);

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
      ...hotelSelect,
      destino: { select: { nome: true, pais: true } },
    },
    take: limit * 4,
  });

  return rows
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((h: any) => h.latitude != null && h.longitude != null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((h: any) => ({
      ...rowToHotel(h, {
        distance_km: Math.round(haversineKm(lat, lng, h.latitude!, h.longitude!) * 100) / 100,
      }),
      city: h.destino?.nome,
      country: h.destino?.pais,
    }))
    .filter((h: { distance_km?: number }) => (h.distance_km ?? 0) <= radiusKm)
    .sort((a: { distance_km?: number }, b: { distance_km?: number }) => (a.distance_km ?? 0) - (b.distance_km ?? 0))
    .slice(0, limit);
}

export async function countHotelsWithGeoFromDb() {
  return prisma.wvHotel.count({
    where: { latitude: { not: null }, longitude: { not: null } },
  });
}

export async function getHotelsFromDb(opts: {
  destinoId?: number;
  slug?: string;
  limit?: number;
}) {
  let destinoId = opts.destinoId;
  if (!destinoId && opts.slug) {
    const parsed = parseDestinationSlug(opts.slug);
    if (parsed) destinoId = parsed.id;
  }
  if (!destinoId) return [];

  const limit = Math.min(opts.limit ?? 24, 50);
  const rows = await prisma.wvHotel.findMany({
    where: { destinoId, NOT: { fonte: 'rejected_geo' } },
    orderBy: { precoPorNoite: 'asc' },
    take: limit * 6,
    select: hotelSelect,
  });

  const filtered = rows.filter(isAccommodationHotel).slice(0, limit);
  if (filtered.length > 0) {
    return filtered.map((h: WvHotelRow) => rowToHotel(h));
  }

  const sleepListings = await prisma.wvListing.findMany({
    where: { destinoId, type: 'sleep' },
    orderBy: { title: 'asc' },
    take: limit,
  });

  return sleepListings.map((listing: { title: string; latitude: number | null; longitude: number | null }, index: number) => ({
    id: destinoId * 10_000 + index + 1,
    destino_id: destinoId,
    nome: listing.title.trim(),
    estrelas: 3,
    preco_por_noite: 85,
    comodidades: [] as string[],
    latitude: listing.latitude,
    longitude: listing.longitude,
    fonte: 'wikivoyage-sleep',
  }));
}

export async function getFlightsFromDb(opts: {
  origin: string;
  destinoId?: number;
  destinoIata?: string;
  limit?: number;
}) {
  const origin = opts.origin.trim().toUpperCase();
  const limit = Math.min(opts.limit ?? 20, 50);

  const where: {
    origem: string;
    destinoId?: number;
    destinoIata?: string;
  } = { origem: origin };

  if (opts.destinoId) where.destinoId = opts.destinoId;
  if (opts.destinoIata) where.destinoIata = opts.destinoIata.trim().toUpperCase();

  const rows = await prisma.wvFlight.findMany({
    where,
    orderBy: { preco: 'asc' },
    take: limit,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (rows as any[]).map(
    (f): MockFlight => ({
      id: f.id,
      origem: f.origem,
      destino_id: f.destinoId,
      destino_iata: f.destinoIata,
      preco: f.preco,
      duracao_minutos: f.duracaoMinutos ?? 0,
      companhia: f.companhia ?? '',
      cabin_class: f.cabinClass ?? '',
      escalas: f.escalas ?? 0,
    }),
  );
}

export async function lookupCostOfLivingDb(city: string, country: string) {
  const leaf = city.replace(/\([^)]*\)/g, ' ').split('/')[0]?.trim() ?? city;

  const row =
    (await prisma.colCity.findFirst({
      where: {
        city: { equals: leaf, mode: 'insensitive' },
        country: { contains: country, mode: 'insensitive' },
      },
    })) ??
    (await prisma.colCity.findFirst({
      where: {
        city: { contains: leaf.slice(0, Math.min(leaf.length, 24)), mode: 'insensitive' },
        country: { contains: country, mode: 'insensitive' },
      },
    }));

  if (row) {
    const custo = {
      moeda: 'USD',
      fonte: 'col_cities',
      nivel: 'cidade' as const,
      indices: row.indices as { cost_of_living?: number },
      orcamentos: row.budgets as { conforto?: { total_dia: number } },
    };
    return { custo, summary: summarizeCostOfLiving(custo) };
  }

  const countryRow = await prisma.colCountryIndex.findFirst({
    where: { country: { equals: country, mode: 'insensitive' } },
  });
  if (!countryRow) return null;

  const custo = {
    moeda: 'USD',
    fonte: 'col_country',
    nivel: 'pais' as const,
    indices: { cost_of_living: countryRow.colIndex, rent: countryRow.rentIndex },
  };
  return { custo, summary: summarizeCostOfLiving(custo) };
}

export async function getListingsFromDb(opts: {
  destinoId?: number;
  slug?: string;
  type?: string;
  limit?: number;
}) {
  let destinoId = opts.destinoId;
  if (!destinoId && opts.slug) {
    const parsed = parseDestinationSlug(opts.slug);
    if (parsed) destinoId = parsed.id;
  }
  if (!destinoId) return [];

  const limit = Math.min(opts.limit ?? 30, 100);
  const where: { destinoId: number; type?: string } = { destinoId };
  if (opts.type) where.type = opts.type;

  return prisma.wvListing.findMany({
    where,
    orderBy: { title: 'asc' },
    take: limit,
    select: {
      id: true,
      type: true,
      title: true,
      address: true,
      price: true,
      latitude: true,
      longitude: true,
      url: true,
    },
  });
}

export type CatalogAirportOption = {
  iataCode: string;
  label: string;
  country: string | null;
};

const destinationSelectForLookup = {
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

function applyResolvedIata(dest: MockDestination, hint?: string | null): MockDestination {
  const resolved = resolveDestinationIata(dest, hint);
  if (resolved) dest.iata = resolved;
  return dest;
}

/** Destinos com IATA válido para o formulário de preferências (Neon). */
export async function getPreferredDestinationAirportsFromDb(opts?: {
  lang?: string;
  limit?: number;
}): Promise<CatalogAirportOption[]> {
  const lang = opts?.lang?.trim() || 'pt';
  const limit = Math.min(opts?.limit ?? 800, 2000);

  const rows = await prisma.wvDestination.findMany({
    where: {
      lang,
      iata: { not: null },
      paisCode: { not: 'XX' },
      hotelCount: { gt: 0 },
    },
    select: {
      nome: true,
      paisCode: true,
      iata: true,
      transporte: true,
      hotelCount: true,
    },
    orderBy: [{ hotelCount: 'desc' }, { nome: 'asc' }],
    take: limit * 3,
  });

  const airportMap = new Map<string, CatalogAirportOption>();
  for (const row of rows) {
    const iataCode = resolveDestinationIata({
      iata: row.iata,
      transporte: row.transporte as MockDestination['transporte'],
    });
    if (!iataCode || airportMap.has(iataCode)) continue;
    airportMap.set(iataCode, {
      iataCode,
      label: `${row.nome} (${iataCode})`,
      country: row.paisCode,
    });
    if (airportMap.size >= limit) break;
  }

  return [...airportMap.values()].sort((a, b) => a.label.localeCompare(b.label));
}

/** Lookup de destino por código IATA (Neon), com IATA resolvido. */
export async function getDestinationByIataFromDb(
  iata: string,
  lang = 'pt',
): Promise<MockDestination | null> {
  const code = iata.trim().toUpperCase();
  if (!/^[A-Z0-9]{3}$/.test(code)) return null;

  const byField = await prisma.wvDestination.findMany({
    where: { lang, iata: code },
    orderBy: { hotelCount: 'desc' },
    take: 3,
    select: destinationSelectForLookup,
  });

  for (const row of byField) {
    const dest = applyResolvedIata(rowToDestination(row), code);
    if (dest.iata === code) return dest;
  }
  if (byField[0]) return applyResolvedIata(rowToDestination(byField[0]), code);

  const flight = await prisma.wvFlight.findFirst({
    where: { destinoIata: code },
    orderBy: { preco: 'asc' },
    select: { destinoId: true },
  });
  if (!flight) return null;

  const row = await prisma.wvDestination.findFirst({
    where: { id: flight.destinoId, lang },
    select: destinationSelectForLookup,
  });
  if (!row) return null;
  return applyResolvedIata(rowToDestination(row), code);
}

/** IATAs populares para pesquisa demo quando o cliente não envia destinos. */
export async function listTopDestinationIatasFromDb(limit = 6, lang = 'pt'): Promise<string[]> {
  const airports = await getPreferredDestinationAirportsFromDb({ lang, limit: limit * 2 });
  return airports.slice(0, limit).map((a) => a.iataCode);
}

/** Lista de países distintos com contagem de destinos (ordenados por popularidade decrescente). */
export async function listDistinctCountriesFromDb(): Promise<{ name: string; count: number }[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await (prisma.wvDestination.groupBy as any)({
    by: ['pais'],
    _count: { pais: true },
    orderBy: { _count: { pais: 'desc' } },
  });
  return (rows as Array<{ pais: string | null; _count: { pais: number } }>)
    .filter((r) => r.pais != null)
    .map((r) => ({ name: r.pais!, count: r._count.pais }));
}

/** Lista de continentes distintos com contagem de destinos (ordenados por popularidade decrescente). */
export async function listDistinctContinentsFromDb(): Promise<{ name: string; count: number }[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await (prisma.wvDestination.groupBy as any)({
    by: ['continente'],
    _count: { continente: true },
    orderBy: { _count: { continente: 'desc' } },
    where: { continente: { not: null } },
  });
  return rows.map((r: { continente: string | null; _count: { continente: number } }) => ({ name: r.continente!, count: r._count.continente }));
}
