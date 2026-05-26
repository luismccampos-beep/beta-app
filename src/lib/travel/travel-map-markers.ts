import type { MockDestination } from './mock-travel/types';
import { buildTravelMapMarkers, type DestinationMapMarker } from './destination-map';
import { lookupHotelsForMap } from './hotel-map-index';

/** Marcadores OSM para cards e API (servidor). */
export function resolveMapMarkersForDestination(
  dest: MockDestination,
  maxHotels = 4,
): DestinationMapMarker[] {
  const hotelRows = lookupHotelsForMap(dest, maxHotels + 2);
  const hotelPoints = hotelRows.map((r) => ({
    lat: r.latitude!,
    lon: r.longitude!,
    label: r.nome,
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
