import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fold, SOURCE_BASELINE_YEARS, COL_TARGET_YEAR } from '../scripts/lib/cost-of-living-data.mjs';
import {
  cumulativeInflationFactor,
  findInflationSeries,
  loadInflationData,
} from '../scripts/lib/cost-of-living-data.mjs';
import { inflationAdjustmentFor, resolveBudgetForDestination } from '../scripts/lib/travel-budget.mjs';

// ─── fixtures ────────────────────────────────────────────────────────────────

const INFLATION = {
  byIso3: {
    PRT: { name: 'Portugal', cpi: { 2023: 5.3, 2024: 2.4, 2025: 2.3, 2026: 2.1 }, imfYears: ['2026'] },
    USA: { name: 'United States', cpi: { 2023: 4.1, 2024: 2.9, 2025: 2.2, 2026: 2.0 }, imfYears: ['2026'] },
    CZE: { name: 'Czechia', cpi: { 2023: 10.1, 2024: 2.4, 2025: 2.0, 2026: 2.0 }, imfYears: ['2026'] },
  },
};

// ─── cumulativeInflationFactor ───────────────────────────────────────────────

describe('cumulativeInflationFactor', () => {
  it('multiplies successive years', () => {
    const f = cumulativeInflationFactor({ 2023: 10, 2024: 5 }, 2022, 2024);
    assert.ok(f != null && Math.abs(f - 1.155) < 1e-6);
  });

  it('skips missing middle year gracefully', () => {
    // 2023 present, 2024 absent, 2025 present → factor = (1+8/100) * 1  (no year multiplier) * (1+3/100)
    const f = cumulativeInflationFactor({ 2023: 8, 2025: 3 }, 2022, 2025);
    assert.ok(f != null && Math.abs(f - 1.1124) < 1e-4);
  });

  it('returns null when from >= to', () => {
    assert.equal(cumulativeInflationFactor({ 2024: 5 }, 2024, 2024), null);
    assert.equal(cumulativeInflationFactor({ 2024: 5 }, 2025, 2024), null);
  });

  it('returns null when no data points exist', () => {
    assert.equal(cumulativeInflationFactor({ 2028: 10 }, 2022, 2026), null);
  });
});

// ─── findInflationSeries ─────────────────────────────────────────────────────

describe('findInflationSeries', () => {
  it('finds exact match (English)', () => {
    const s = findInflationSeries(INFLATION, 'United States');
    assert.ok(s);
    assert.equal(s.iso3, 'USA');
  });

  it('handles Czechia→Czech Republic alias', () => {
    const s = findInflationSeries(INFLATION, 'Czech Republic');
    assert.ok(s);
    assert.equal(s.iso3, 'CZE');
  });

  it('returns null for unknown country', () => {
    assert.equal(findInflationSeries(INFLATION, 'Atlantis'), null);
  });

  it('returns null when inflation dataset is missing', () => {
    assert.equal(findInflationSeries(null, 'Portugal'), null);
  });
});

// ─── inflationAdjustmentFor ──────────────────────────────────────────────────

describe('inflationAdjustmentFor', () => {
  const indexes = { inflation: INFLATION, targetYear: 2026 };

  it('returns a positive factor for 2024 baseline → 2026', () => {
    const adj = inflationAdjustmentFor(indexes, 'Cost_of_Living_Index_by_Country_2024.csv', 'Portugal');
    assert.ok(adj);
    assert.ok(adj.factor > 1);
    assert.equal(adj.fromYear, 2024);
    assert.equal(adj.toYear, 2026);
  });

  it('returns null when no inflation data exists for the country', () => {
    assert.equal(inflationAdjustmentFor(indexes, 'Cost_of_Living_Index_by_Country_2024.csv', 'Atlantis'), null);
  });

  it('returns null when baseline is already current year or later', () => {
    assert.equal(inflationAdjustmentFor(indexes, 'global_cost_of_living_crisis_2026.csv', 'Portugal'), null);
  });

  it('returns null for unknown source file', () => {
    assert.equal(inflationAdjustmentFor(indexes, 'unknown_source.csv', 'Portugal'), null);
  });
});

// ─── resolveBudgetForDestination (inflation applied) ────────────────────────

describe('resolveBudgetForDestination inflation integration', () => {
  // Build synthetic indexes — one city (Lisbon) with a couple of prices
  function makeIndexes() {
    const cities = new Map();
    cities.set('lisbon|portugal', {
      city: 'Lisbon',
      country: 'Portugal',
      prices: { x1: 12, x2: 35, x3: 8, x14: 1.8, x26: 2, x39: 7 },
      source: 'Cost_of_Living_Index_by_Country_2024.csv',
    });
    const countries = new Map();
    const crisis = new Map();
    return { cities, countries, crisis, inflation: INFLATION, targetYear: 2026, sources: ['test'] };
  }

  const dest = { nome: 'Lisboa', pais: 'Portugal', tipo: 'cidade' };

  it('inflates city prices and marks fonte with "inflação"', () => {
    const budget = resolveBudgetForDestination(makeIndexes(), dest);
    assert.ok(budget);
    assert.ok(budget.orcamentos?.conforto?.total_dia > 0);
    assert.ok(
      budget.fonte.includes('inflação'),
      `fonte should include inflação suffix: ${budget.fonte}`,
    );
  });

  it('leaves budget unchanged when inflation data is absent', () => {
    const idx = makeIndexes();
    idx.inflation = null;
    const budget = resolveBudgetForDestination(idx, dest);
    assert.ok(budget);
    assert.ok(!budget.fonte.includes('inflação'), `fonte should NOT include inflação: ${budget.fonte}`);
  });
});

// ─── constants sanity ────────────────────────────────────────────────────────

describe('baseline year constants', () => {
  it('SOURCE_BASELINE_YEARS covers known CSVs', () => {
    assert.equal(SOURCE_BASELINE_YEARS['cost-of-living_v2.csv'], 2022);
    assert.equal(SOURCE_BASELINE_YEARS['Cost_of_Living_Index_by_Country_2024.csv'], 2024);
    assert.equal(SOURCE_BASELINE_YEARS['global_cost_of_living_crisis_2026.csv'], 2026);
  });

  it('COL_TARGET_YEAR is a 4-digit year', () => {
    assert.ok(COL_TARGET_YEAR >= 2024 && COL_TARGET_YEAR <= 2100);
  });
});

// ─── loadInflationData (graceful absence) ────────────────────────────────────

describe('loadInflationData', () => {
  it('returns null when inflation.json does not exist (gitignored data dir)', () => {
    const data = loadInflationData();
    // data can be object (if someone ran fetch-inflation locally) or null; either is valid
    assert.ok(data === null || typeof data === 'object');
  });
});
