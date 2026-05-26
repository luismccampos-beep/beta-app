import type { OsmHotelPlace } from './types';

const DEFAULT_BASE = 'https://photon.komoot.io';

export type PhotonSearchInput = {
  q: string;
  limit?: number;
  /** Só amenity/tourism=hotel (e alojamento similar). */
  hotelsOnly?: boolean;
  lat?: number;
  lon?: number;
};

const HOTEL_OSM_VALUES = new Set([
  'hotel',
  'hostel',
  'guest_house',
  'motel',
  'apartment',
  'chalet',
]);

function isHotelFeature(props: Record<string, unknown>): boolean {
  const key = String(props.osm_key ?? '');
  const val = String(props.osm_value ?? '').toLowerCase();
  if (key === 'tourism' && HOTEL_OSM_VALUES.has(val)) return true;
  if (key === 'amenity' && val === 'hotel') return true;
  return false;
}

function featureToPlace(
  f: {
    properties?: Record<string, unknown>;
    geometry?: { coordinates?: [number, number] };
  },
): OsmHotelPlace | null {
  const props = f.properties ?? {};
  const coords = f.geometry?.coordinates;
  if (!coords || coords.length < 2) return null;

  const [lon, lat] = coords;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const parts = [
    props.housenumber,
    props.street,
    props.city,
    props.postcode,
    props.country,
  ]
    .filter(Boolean)
    .map(String);

  return {
    name: String(props.name ?? 'Hotel'),
    lat,
    lon,
    address: parts.length ? parts.join(', ') : undefined,
    category: props.osm_value ? String(props.osm_value) : undefined,
    osm_id: props.osm_id as string | number | undefined,
    osm_type: props.osm_type ? String(props.osm_type) : undefined,
    source: 'photon',
  };
}

/** Geocodificação / pesquisa por nome (Photon, komoot). */
export async function searchPlacesViaPhoton(
  input: PhotonSearchInput,
): Promise<OsmHotelPlace[]> {
  const limit = Math.min(Math.max(input.limit ?? 8, 1), 15);
  const params = new URLSearchParams({
    q: input.q.trim(),
    limit: String(limit),
  });
  if (input.lat != null && input.lon != null) {
    params.set('lat', String(input.lat));
    params.set('lon', String(input.lon));
  }

  const base = (process.env.PHOTON_API_BASE_URL?.trim() || DEFAULT_BASE).replace(/\/$/, '');
  const url = `${base}/api?${params}`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': process.env.PHOTON_USER_AGENT?.trim() || 'beta-app-travel/1.0',
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Photon HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    features?: {
      properties?: Record<string, unknown>;
      geometry?: { coordinates?: [number, number] };
    }[];
  };

  let features = json.features ?? [];
  if (input.hotelsOnly) {
    features = features.filter((f) => isHotelFeature(f.properties ?? {}));
  }

  return features
    .map(featureToPlace)
    .filter((p): p is OsmHotelPlace => p != null);
}
