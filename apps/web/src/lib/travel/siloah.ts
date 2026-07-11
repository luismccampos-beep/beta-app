/** Siloah Travel — luxury cruise search (no API key required). */

export const SILOAH_DESTINATION_IDS = [
  'Mediterranean',
  'Caribbean',
  'Alaska',
  'Antarctica',
  'Europe',
  'Asia',
  'Oceania',
  'NorthAmerica',
  'SouthAmerica',
  'Africa',
  'Transatlantic',
  'Baltic',
  'NorthernEurope',
] as const;

export type SiloahDestinationId = (typeof SILOAH_DESTINATION_IDS)[number];

export type SiloahBrandTier = 'ultra_luxury' | 'luxury' | 'popular';

export type SiloahShipType = 'ocean' | 'river' | 'expedition';

export type SiloahVoyage = {
  name: string;
  brandName: string;
  shipName: string;
  sailDate: string;
  nights: number;
  departurePort: string;
  arrivalPort: string;
  price: number | null;
  destinations: string[];
  image: string | null;
  link: string;
};

export type SiloahBrand = {
  name: string;
  tier: string;
  description: string;
  shipCount: number;
  cruiseCount: number;
  logo: string | null;
  link: string;
};

export type SiloahShip = {
  name: string;
  brand: string;
  tonnage: number | null;
  passengers: number | null;
  cabins: number | null;
  launched: string | null;
  type: string | null;
  starRating: number | null;
  cruiseCount: number;
  image: string | null;
  link: string;
};

export type SiloahContentHit = {
  content: string;
  source: string;
  field: string;
  name: string;
  brand: string;
  similarity: number;
};

export function siloahBaseUrl(): string {
  return (process.env.SILOAH_API_BASE_URL?.trim() || 'https://mcp.siloah.travel').replace(
    /\/$/,
    '',
  );
}

export type SiloahVoyageSearchParams = {
  destination?: string;
  brandName?: string;
  departureCity?: string;
  monthFrom?: string;
  minNights?: number;
  maxNights?: number;
  maxPrice?: number;
};

export type SiloahBrandSearchParams = {
  name?: string;
  tier?: SiloahBrandTier;
};

export type SiloahShipSearchParams = {
  name?: string;
  brandName?: string;
  shipType?: SiloahShipType;
  minPassengers?: number;
  maxPassengers?: number;
};

async function siloahGet<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
  const base = siloahBaseUrl();
  const url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Siloah ${path} ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchSiloahVoyages(
  params: SiloahVoyageSearchParams,
): Promise<{ total: number; voyages: SiloahVoyage[] }> {
  const json = await siloahGet<{
    total?: number;
    voyages?: Record<string, unknown>[];
  }>('/api/voyages', {
    destination: params.destination,
    brandName: params.brandName,
    departureCity: params.departureCity,
    monthFrom: params.monthFrom,
    minNights: params.minNights,
    maxNights: params.maxNights,
    maxPrice: params.maxPrice,
  });

  const voyages: SiloahVoyage[] = [];
  for (const row of json.voyages ?? []) {
    const name = typeof row.name === 'string' ? row.name : '';
    const brandName = typeof row.brandName === 'string' ? row.brandName : '';
    const shipName = typeof row.shipName === 'string' ? row.shipName : '';
    const sailDate = typeof row.sailDate === 'string' ? row.sailDate : '';
    const nights = typeof row.nights === 'number' ? row.nights : 0;
    const departurePort = typeof row.departurePort === 'string' ? row.departurePort : '';
    const arrivalPort = typeof row.arrivalPort === 'string' ? row.arrivalPort : '';
    const link = typeof row.link === 'string' ? row.link : '';
    if (!name && !shipName) continue;
    voyages.push({
      name: name || `${brandName} — ${shipName}`,
      brandName,
      shipName,
      sailDate,
      nights,
      departurePort,
      arrivalPort,
      price: typeof row.price === 'number' ? row.price : null,
      destinations: Array.isArray(row.destinations)
        ? row.destinations.filter((d): d is string => typeof d === 'string')
        : [],
      image: typeof row.image === 'string' ? row.image : null,
      link,
    });
  }

  return { total: json.total ?? voyages.length, voyages };
}

export async function fetchSiloahBrands(
  params: SiloahBrandSearchParams = {},
): Promise<SiloahBrand[]> {
  const json = await siloahGet<{ brands?: Record<string, unknown>[] }>('/api/brands', {
    name: params.name,
    tier: params.tier,
  });

  const out: SiloahBrand[] = [];
  for (const row of json.brands ?? []) {
    const name = typeof row.name === 'string' ? row.name : '';
    if (!name) continue;
    out.push({
      name,
      tier: typeof row.tier === 'string' ? row.tier : '',
      description: typeof row.description === 'string' ? row.description : '',
      shipCount: typeof row.shipCount === 'number' ? row.shipCount : 0,
      cruiseCount: typeof row.cruiseCount === 'number' ? row.cruiseCount : 0,
      logo: typeof row.logo === 'string' ? row.logo : null,
      link: typeof row.link === 'string' ? row.link : '',
    });
  }
  return out;
}

export async function fetchSiloahShips(params: SiloahShipSearchParams = {}): Promise<SiloahShip[]> {
  const json = await siloahGet<{ ships?: Record<string, unknown>[] }>('/api/ships', {
    name: params.name,
    brandName: params.brandName,
    shipType: params.shipType,
    minPassengers: params.minPassengers,
    maxPassengers: params.maxPassengers,
  });

  const out: SiloahShip[] = [];
  for (const row of json.ships ?? []) {
    const name = typeof row.name === 'string' ? row.name : '';
    if (!name) continue;
    out.push({
      name,
      brand: typeof row.brand === 'string' ? row.brand : '',
      tonnage: typeof row.tonnage === 'number' ? row.tonnage : null,
      passengers: typeof row.passengers === 'number' ? row.passengers : null,
      cabins: typeof row.cabins === 'number' ? row.cabins : null,
      launched: typeof row.launched === 'string' ? row.launched : null,
      type: typeof row.type === 'string' ? row.type : null,
      starRating: typeof row.starRating === 'number' ? row.starRating : null,
      cruiseCount: typeof row.cruiseCount === 'number' ? row.cruiseCount : 0,
      image: typeof row.image === 'string' ? row.image : null,
      link: typeof row.link === 'string' ? row.link : '',
    });
  }
  return out;
}

export async function fetchSiloahContentSearch(
  query: string,
  source?: string,
): Promise<SiloahContentHit[]> {
  const json = await siloahGet<{ results?: Record<string, unknown>[] }>('/api/search', {
    query,
    source,
  });

  const out: SiloahContentHit[] = [];
  for (const row of json.results ?? []) {
    const content = typeof row.content === 'string' ? row.content : '';
    if (!content.trim()) continue;
    out.push({
      content,
      source: typeof row.source === 'string' ? row.source : '',
      field: typeof row.field === 'string' ? row.field : '',
      name: typeof row.name === 'string' ? row.name : '',
      brand: typeof row.brand === 'string' ? row.brand : '',
      similarity: typeof row.similarity === 'number' ? row.similarity : 0,
    });
  }
  return out;
}

/** Map Siloah region id to a display continent for filters. */
export function continentFromSiloahDestination(dest: string): string {
  const d = dest.toLowerCase();
  if (['mediterranean', 'europe', 'baltic', 'northerneurope', 'transatlantic'].some((x) => d.includes(x.toLowerCase()))) {
    return 'Europe';
  }
  if (['caribbean', 'northamerica', 'alaska'].some((x) => d.includes(x.toLowerCase()))) {
    return 'North America';
  }
  if (['southamerica', 'antarctica'].some((x) => d.includes(x.toLowerCase()))) {
    return d.includes('antarctica') ? 'Antarctica' : 'South America';
  }
  if (d.includes('asia')) return 'Asia';
  if (d.includes('africa')) return 'Africa';
  if (d.includes('oceania')) return 'Oceania';
  return 'Europe';
}

export function scoreFromCruisePrice(price: number | null): number {
  if (price == null || !Number.isFinite(price) || price <= 0) return 78;
  return Math.max(55, Math.min(96, Math.round(100 - price / 200)));
}
