import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ---------------------------------------------------------------------------
// Import pure functions by re-declaring them (same logic as fetch-identity.mjs)
// We duplicate them here to avoid importing the whole script (which connects to DB).
// ---------------------------------------------------------------------------

const LAT_MIN = -90;
const LAT_MAX = 90;
const LON_MIN = -180;
const LON_MAX = 180;
const MAX_POPULATION = 100_000_000;

const INCLUDE_ADMIN_CAPITALS = true;
const MIN_POP = 15000;

const PRIORITY_CITIES = new Set([
  'lisbon,pt', 'porto,pt', 'london,gb', 'paris,fr', 'tokyo,jp',
]);

function normalizePlugType(label) {
  if (!label) return null;
  const match = label.match(/[A-NO]/g);
  if (!match) return null;
  return [...new Set(match)].sort().join(',');
}

function resolveDrivingSide(raw) {
  if (!raw) return null;
  if (raw === 'Q1868517') return 'left';
  if (raw === 'Q2070508') return 'right';
  const lower = raw.toLowerCase();
  if (lower === 'left' || lower === 'right') return lower;
  return null;
}

function validateCoordinate(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  if (lat < LAT_MIN || lat > LAT_MAX) return false;
  if (lon < LON_MIN || lon > LON_MAX) return false;
  return true;
}

function validatePopulation(pop) {
  if (pop === undefined || pop === null) return true;
  if (!Number.isFinite(pop)) return false;
  if (pop < 0) return false;
  if (pop > MAX_POPULATION) return false;
  return true;
}

function validateTimezone(tz) {
  if (!tz) return true;
  return /^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/.test(tz);
}

function makeSlug(name, countryCode, existingSlugs) {
  let base = (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  let slug = `${base}-${countryCode.toLowerCase()}`;

  if (existingSlugs.has(slug)) {
    let counter = 2;
    while (existingSlugs.has(`${slug}-${counter}`)) {
      counter++;
    }
    slug = `${slug}-${counter}`;
  }

  existingSlugs.add(slug);
  return slug;
}

function isPrimaryCity(featureCode, name, countryCode) {
  if (!featureCode) return false;
  const primaryCodes = new Set(['PPLC', 'PPLC2']);
  if (primaryCodes.has(featureCode)) return true;
  if (INCLUDE_ADMIN_CAPITALS && featureCode.startsWith('PPLA')) return true;
  const key = `${name?.toLowerCase()},${countryCode?.toLowerCase()}`;
  if (PRIORITY_CITIES.has(key)) return true;
  return false;
}

function shouldIncludeCity(population, featureCode) {
  if (isPrimaryCity(featureCode, null, null)) return true;
  if (typeof population === 'number' && population >= MIN_POP) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('normalizePlugType', () => {
  it('returns null for null/undefined', () => {
    assert.equal(normalizePlugType(null), null);
    assert.equal(normalizePlugType(undefined), null);
  });

  it('returns null for empty string', () => {
    assert.equal(normalizePlugType(''), null);
  });

  it('extracts and sorts plug types', () => {
    assert.equal(normalizePlugType('Type A, Type B'), 'A,B');
    assert.equal(normalizePlugType('Types C, F, G'), 'C,F,G');
  });

  it('deduplicates plug types', () => {
    assert.equal(normalizePlugType('Type A, Type A'), 'A');
  });

  it('returns null for lowercase-only input (plug types are uppercase)', () => {
    assert.equal(normalizePlugType('type a'), null);
  });
});

describe('resolveDrivingSide', () => {
  it('returns null for null/undefined', () => {
    assert.equal(resolveDrivingSide(null), null);
    assert.equal(resolveDrivingSide(undefined), null);
  });

  it('resolves Wikidata Q-numbers', () => {
    assert.equal(resolveDrivingSide('Q1868517'), 'left');
    assert.equal(resolveDrivingSide('Q2070508'), 'right');
  });

  it('resolves plain strings', () => {
    assert.equal(resolveDrivingSide('left'), 'left');
    assert.equal(resolveDrivingSide('right'), 'right');
    assert.equal(resolveDrivingSide('Left'), 'left');
  });

  it('returns null for unknown values', () => {
    assert.equal(resolveDrivingSide('unknown'), null);
    assert.equal(resolveDrivingSide('Q999999'), null);
  });
});

describe('validateCoordinate', () => {
  it('rejects non-finite values', () => {
    assert.equal(validateCoordinate(NaN, 0), false);
    assert.equal(validateCoordinate(0, Infinity), false);
  });

  it('rejects out-of-range latitude', () => {
    assert.equal(validateCoordinate(-91, 0), false);
    assert.equal(validateCoordinate(91, 0), false);
  });

  it('rejects out-of-range longitude', () => {
    assert.equal(validateCoordinate(0, -181), false);
    assert.equal(validateCoordinate(0, 181), false);
  });

  it('accepts valid coordinates', () => {
    assert.equal(validateCoordinate(0, 0), true);
    assert.equal(validateCoordinate(-90, -180), true);
    assert.equal(validateCoordinate(90, 180), true);
    assert.equal(validateCoordinate(38.7223, -9.1393), true); // Lisbon
  });
});

describe('validatePopulation', () => {
  it('allows null/undefined', () => {
    assert.equal(validatePopulation(null), true);
    assert.equal(validatePopulation(undefined), true);
  });

  it('rejects negative', () => {
    assert.equal(validatePopulation(-1), false);
  });

  it('rejects non-finite', () => {
    assert.equal(validatePopulation(NaN), false);
    assert.equal(validatePopulation(Infinity), false);
  });

  it('rejects unreasonably large', () => {
    assert.equal(validatePopulation(100_000_001), false);
  });

  it('accepts valid values', () => {
    assert.equal(validatePopulation(0), true);
    assert.equal(validatePopulation(15000), true);
    assert.equal(validatePopulation(37_000_000), true);
  });
});

describe('validateTimezone', () => {
  it('allows null', () => {
    assert.equal(validateTimezone(null), true);
    assert.equal(validateTimezone(''), true);
  });

  it('accepts valid IANA timezones', () => {
    assert.equal(validateTimezone('Europe/Lisbon'), true);
    assert.equal(validateTimezone('America/New_York'), true);
    assert.equal(validateTimezone('Asia/Kolkata'), true);
    assert.equal(validateTimezone('America/Indiana/Indianapolis'), true);
  });

  it('rejects invalid formats', () => {
    assert.equal(validateTimezone('UTC'), false);
    assert.equal(validateTimezone('EST'), false);
    assert.equal(validateTimezone('Lisbon'), false);
    assert.equal(validateTimezone('Europe/'), false);
  });
});

describe('makeSlug', () => {
  it('creates a basic slug', () => {
    const slugs = new Set();
    assert.equal(makeSlug('Lisbon', 'PT', slugs), 'lisbon-pt');
  });

  it('handles diacritics', () => {
    const slugs = new Set();
    assert.equal(makeSlug('São Paulo', 'BR', slugs), 'sao-paulo-br');
  });

  it('handles collisions with counter', () => {
    const slugs = new Set(['lisbon-pt']);
    assert.equal(makeSlug('Lisbon', 'PT', slugs), 'lisbon-pt-2');
  });

  it('handles multiple collisions', () => {
    const slugs = new Set(['lisbon-pt', 'lisbon-pt-2', 'lisbon-pt-3']);
    assert.equal(makeSlug('Lisbon', 'PT', slugs), 'lisbon-pt-4');
  });

  it('truncates long names', () => {
    const slugs = new Set();
    const slug = makeSlug('A'.repeat(100), 'PT', slugs);
    assert.ok(slug.length <= 55); // 50 + "-pt"
  });
});

describe('isPrimaryCity', () => {
  it('returns true for PPLC (capital)', () => {
    assert.equal(isPrimaryCity('PPLC', null, null), true);
  });

  it('returns true for PPLC2', () => {
    assert.equal(isPrimaryCity('PPLC2', null, null), true);
  });

  it('returns true for PPLA (admin capital)', () => {
    assert.equal(isPrimaryCity('PPLA', null, null), true);
  });

  it('returns false for PPL (regular city)', () => {
    assert.equal(isPrimaryCity('PPL', null, null), false);
  });

  it('returns true for priority cities', () => {
    assert.equal(isPrimaryCity('PPL', 'Lisbon', 'PT'), true);
    assert.equal(isPrimaryCity('PPL', 'London', 'GB'), true);
  });

  it('returns false for non-priority cities', () => {
    assert.equal(isPrimaryCity('PPL', 'Randomville', 'PT'), false);
  });

  it('returns false for null feature code', () => {
    assert.equal(isPrimaryCity(null, null, null), false);
  });
});

describe('shouldIncludeCity', () => {
  it('includes capitals regardless of population', () => {
    assert.equal(shouldIncludeCity(0, 'PPLC'), true);
    assert.equal(shouldIncludeCity(100, 'PPLA'), true);
  });

  it('includes cities above threshold', () => {
    assert.equal(shouldIncludeCity(15000, 'PPL'), true);
    assert.equal(shouldIncludeCity(100000, 'PPL'), true);
  });

  it('excludes cities below threshold', () => {
    assert.equal(shouldIncludeCity(5000, 'PPL'), false);
    assert.equal(shouldIncludeCity(0, 'PPL'), false);
  });
});
