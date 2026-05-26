import type { OsmHotelPlace } from './types';

const DEFAULT_BASE = 'https://bizdata-web.vercel.app';

export type BizDataSearchInput = {
  /** Cidade ou "lat,lng" */
  location: string;
  radiusKm?: number;
  limit?: number;
  category?: string;
};

export type BizDataSearchResult = {
  places: OsmHotelPlace[];
  total?: number;
  locationResolved?: string;
  dataQuality?: Record<string, unknown>;
};

type BizDataRow = {
  name?: string;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  lat?: number;
  lon?: number;
  opening_hours?: string;
  osm_id?: number | string;
  wikidata?: string;
  extras?: { wikidata?: string };
};

function baseUrl(): string {
  return process.env.BIZDATA_API_BASE_URL?.trim() || DEFAULT_BASE;
}

function rowToPlace(row: BizDataRow): OsmHotelPlace | null {
  const lat = row.lat;
  const lon = row.lon;
  if (lat == null || lon == null || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }
  const wikidata =
    row.wikidata?.trim() ||
    row.extras?.wikidata?.trim() ||
    undefined;

  return {
    name: row.name?.trim() || 'Hotel',
    lat,
    lon,
    address: row.address?.trim() || undefined,
    phone: row.phone?.trim() || undefined,
    website: row.website?.trim() || undefined,
    email: row.email?.trim() || undefined,
    opening_hours: row.opening_hours?.trim() || undefined,
    category: row.category,
    osm_id: row.osm_id,
    wikidata_id: wikidata ? (wikidata.startsWith('Q') ? wikidata : `Q${wikidata}`) : undefined,
    source: 'bizdata',
  };
}

/** Hotéis via BizData (Overpass encapsulado, sem API key). */
export async function searchHotelsViaBizData(
  input: BizDataSearchInput,
): Promise<BizDataSearchResult> {
  const limit = Math.min(Math.max(input.limit ?? 50, 1), 500);
  const params = new URLSearchParams({
    location: input.location.trim(),
    category: input.category?.trim() || 'hotel',
    limit: String(limit),
  });
  if (input.radiusKm != null && Number.isFinite(input.radiusKm)) {
    params.set('radius_km', String(input.radiusKm));
  }

  const url = `${baseUrl().replace(/\/$/, '')}/api/businesses?${params}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`BizData HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    businesses?: BizDataRow[];
    total?: number;
    location_resolved?: string;
    data_quality?: Record<string, unknown>;
  };

  const places = (json.businesses ?? [])
    .map(rowToPlace)
    .filter((p): p is OsmHotelPlace => p != null);

  return {
    places,
    total: json.total,
    locationResolved: json.location_resolved,
    dataQuality: json.data_quality,
  };
}
