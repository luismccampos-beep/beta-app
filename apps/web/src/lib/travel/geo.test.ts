import { describe, expect, it } from 'vitest';

import { boundingBox, haversineKm } from './geo';

describe('geo', () => {
  it('haversineKm is ~0 for same point', () => {
    expect(haversineKm(38.72, -9.14, 38.72, -9.14)).toBeLessThan(0.01);
  });

  it('boundingBox expands with radius', () => {
    const b = boundingBox(40, -8, 10);
    expect(b.latMax - b.latMin).toBeGreaterThan(0.1);
  });
});
