import { describe, expect, it } from 'vitest';

import { buildTravelMapMarkers, resolveDestinationMapMarkers } from './destination-map';

describe('resolveDestinationMapMarkers', () => {
  it('includes destination and airport when both differ', () => {
    const markers = resolveDestinationMapMarkers({
      nome: 'Lisboa',
      latitude: 38.72,
      longitude: -9.14,
      transporte: {
        aeroporto: { lat: 38.78, lon: -9.14, iata: 'LIS', nome: 'Humberto Delgado' },
      },
    });
    expect(markers).toHaveLength(2);
    expect(markers.some((m) => m.kind === 'destination')).toBe(true);
    expect(markers.some((m) => m.kind === 'airport')).toBe(true);
  });

  it('dedupes airport when same as destination coords', () => {
    const markers = resolveDestinationMapMarkers({
      nome: 'Town',
      latitude: 40.0,
      longitude: -8.0,
      transporte: {
        aeroporto: { lat: 40.001, lon: -8.001, iata: 'XYZ' },
      },
    });
    expect(markers).toHaveLength(1);
  });

  it('adds hotel markers without duplicating nearby points', () => {
    const markers = buildTravelMapMarkers(
      {
        nome: 'Lisboa',
        latitude: 38.72,
        longitude: -9.14,
        transporte: {
          aeroporto: { lat: 38.78, lon: -9.14, iata: 'LIS' },
        },
      },
      [
        { lat: 38.71, lon: -9.13, label: 'Hotel A' },
        { lat: 38.7, lon: -9.12, label: 'Hotel B' },
      ],
      4,
    );
    expect(markers.filter((m) => m.kind === 'hotel')).toHaveLength(2);
    expect(markers.some((m) => m.kind === 'airport')).toBe(true);
  });
});
