import type { MockDestination } from './mock-travel/types';

/** Coordenadas para pedido TripGo: aeroporto → centro do destino. */
export function tripGoEndpointsFromDestination(dest: {
  nome?: string;
  latitude?: number | null;
  longitude?: number | null;
  transporte?: {
    aeroporto?: { lat: number; lon: number; nome?: string; iata?: string };
  } | null;
}): {
  from: { lat: number; lon: number; label: string };
  to: { lat: number; lon: number; label: string };
} | null {
  const ap = dest.transporte?.aeroporto;
  if (!ap?.lat || !ap?.lon) return null;

  const toLat = dest.latitude ?? ap.lat;
  const toLon = dest.longitude ?? ap.lon;

  if (!Number.isFinite(toLat) || !Number.isFinite(toLon)) return null;

  const samePoint =
    Math.abs(ap.lat - toLat) < 0.02 && Math.abs(ap.lon - toLon) < 0.02;
  if (samePoint) return null;

  return {
    from: {
      lat: ap.lat,
      lon: ap.lon,
      label: ap.iata ? `${ap.iata} · ${ap.nome ?? 'Airport'}` : (ap.nome ?? 'Airport'),
    },
    to: {
      lat: toLat,
      lon: toLon,
      label: dest.nome?.split('/')[0] ?? 'Destination',
    },
  };
}
