import { describe, expect, it } from 'vitest';

import { commonsImageUrl, normalizeWikidataId } from './wikidata';

describe('wikidata helpers', () => {
  it('normalizeWikidataId accepts Q-prefixed ids', () => {
    expect(normalizeWikidataId('q5858321')).toBe('Q5858321');
    expect(normalizeWikidataId('5858321')).toBe('Q5858321');
  });

  it('commonsImageUrl encodes file name', () => {
    const url = commonsImageUrl('Hotel Example.jpg');
    expect(url).toContain('commons.wikimedia.org');
    expect(url).toContain('Hotel');
  });
});
