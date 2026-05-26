/** Map markers for destination detail (OpenStreetMap / Leaflet). */

export type DestinationMapMarker = {
  lat: number;
  lon: number;
  label: string;
  kind: 'destination' | 'airport' | 'hotel';
};

export type HotelMapPoint = {
  lat: number;
  lon: number;
  label: string;
};

export type DestinationMapInput = {
  nome: string;
  latitude?: number | null;
  longitude?: number | null;
  transporte?: {
    aeroporto?: {
      lat: number;
      lon: number;
      iata?: string;
      nome?: string;
    };
  } | null;
};

function samePlace(a: { lat: number; lon: number }, b: { lat: number; lon: number }, km = 3): boolean {
  const dLat = Math.abs(a.lat - b.lat);
  const dLon = Math.abs(a.lon - b.lon);
  return dLat < km / 111 && dLon < km / 85;
}

export function resolveDestinationMapMarkers(input: DestinationMapInput): DestinationMapMarker[] {
  const markers: DestinationMapMarker[] = [];

  const destLat = input.latitude;
  const destLon = input.longitude;
  if (
    destLat != null &&
    destLon != null &&
    Number.isFinite(destLat) &&
    Number.isFinite(destLon)
  ) {
    markers.push({
      lat: destLat,
      lon: destLon,
      label: input.nome,
      kind: 'destination',
    });
  }

  const ap = input.transporte?.aeroporto;
  if (ap?.lat != null && ap?.lon != null && Number.isFinite(ap.lat) && Number.isFinite(ap.lon)) {
    const airportPoint = { lat: ap.lat, lon: ap.lon };
    const dup = markers.some((m) => samePlace(m, airportPoint));
    if (!dup) {
      const label = ap.iata
        ? `${ap.iata}${ap.nome ? ` · ${ap.nome}` : ''}`
        : (ap.nome ?? 'Airport');
      markers.push({
        lat: ap.lat,
        lon: ap.lon,
        label,
        kind: 'airport',
      });
    }
  }

  return markers;
}

/** Destino + aeroporto + hotéis (deduplicados, limite opcional). */
export function buildTravelMapMarkers(
  input: DestinationMapInput,
  hotelPoints: HotelMapPoint[] = [],
  maxHotels = 4,
): DestinationMapMarker[] {
  const markers = resolveDestinationMapMarkers(input);

  let added = 0;
  for (const h of hotelPoints) {
    if (added >= maxHotels) break;
    if (!Number.isFinite(h.lat) || !Number.isFinite(h.lon)) continue;
    const point = { lat: h.lat, lon: h.lon };
    if (markers.some((m) => samePlace(m, point, 0.4))) continue;
    markers.push({
      lat: h.lat,
      lon: h.lon,
      label: h.label.length > 48 ? `${h.label.slice(0, 45)}…` : h.label,
      kind: 'hotel',
    });
    added += 1;
  }

  return markers;
}

export function osmViewUrl(lat: number, lon: number, zoom = 13): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
}
