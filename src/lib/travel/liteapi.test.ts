import { describe, expect, it } from 'vitest';

import { parseLiteApiPlacesResponse } from './liteapi';

describe('parseLiteApiPlacesResponse', () => {
  it('maps placeId, displayName, formattedAddress, and types', () => {
    const places = parseLiteApiPlacesResponse({
      data: [
        {
          placeId: 'ChIJabc',
          displayName: 'Lisboa',
          formattedAddress: 'Lisboa, Portugal',
          types: ['locality', 'political'],
        },
        { placeId: '', displayName: 'skip' },
      ],
    });

    expect(places).toHaveLength(1);
    expect(places[0]).toEqual({
      placeId: 'ChIJabc',
      displayName: 'Lisboa',
      formattedAddress: 'Lisboa, Portugal',
      types: ['locality', 'political'],
    });
  });
});
