/**
 * Hierarquia de orçamentos: cidade (exato/fuzzy) → país ajustado → continente → global.
 */
import {
  countryToEnglish,
  fold,
  leafCityName,
  lookupCityRow,
  lookupCityGlobal,
  lookupCountryRow,
} from './cost-of-living-data.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { continentIndices, inferLocalityTier } from './destination-locality.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOURISM_INDEX = resolve(__dirname, '../../data/tourism cost/tourism-expenditure-index.json');

const REFERENCE_DAILY_USD = 92;

/** @type {import('../../data/tourism cost/tourism-expenditure-index.json') | null} */
let tourismCache = undefined;

function loadTourismIndex() {
  if (tourismCache !== undefined) return tourismCache;
  if (!existsSync(TOURISM_INDEX)) {
    tourismCache = null;
    return null;
  }
  try {
    tourismCache = JSON.parse(readFileSync(TOURISM_INDEX, 'utf8'));
    return tourismCache;
  } catch {
    tourismCache = null;
    return null;
  }
}

/**
 * @param {string} countryEn
 */
function budgetsFromTourism(countryEn) {
  const idx = loadTourismIndex();
  if (!idx?.countries) return null;
  const row = idx.countries[fold(countryEn)];
  if (!row?.budgetsUsd) return null;
  return {
    nivel: 'pais',
    estimado: true,
    confianca: 'media',
    moeda: 'USD',
    fonte: `UNWTO ${row.displayName ?? countryEn} (${row.year}) · gasto turístico/dia`,
    fator_localidade: 1,
    indices: {
      cost_of_living: row.colIndexFromTourism,
    },
    orcamentos: {
      mochileiro: {
        total_dia: row.budgetsUsd.mochileiro,
        moeda: 'USD',
        itens: [`Gasto turístico UNWTO ÷${row.tripDaysAssumed ?? 5} dias`],
      },
      conforto: {
        total_dia: row.budgetsUsd.conforto,
        moeda: 'USD',
        itens: [`~$${row.spendPerDayUsd}/dia (visitante médio)`],
      },
      luxo: {
        total_dia: row.budgetsUsd.luxo,
        moeda: 'USD',
        itens: [`Intensidade turística relativa ${row.relativeSpend}`],
      },
    },
  };
}

/**
 * @param {Record<string, number | null>} prices
 */
export function budgetsFromCityPrices(prices) {
  const meal = prices.x1;
  const mid = prices.x2;
  const mc = prices.x3;
  const coffee = prices.x14;
  const transit = prices.x26 ?? prices.x27;
  const taxi = prices.x39;

  const midPerPerson = mid != null ? mid / 2 : null;
  const mealCheap = meal ?? mc;

  /** @type {Record<string, { total_dia: number; moeda: string; itens: string[] }>} */
  const out = {};

  if (mealCheap != null && transit != null) {
    out.mochileiro = {
      total_dia: round(mealCheap * 2.5 + transit * 2),
      moeda: 'USD',
      itens: [`Refeição económica ×2.5`, `Transporte local`],
    };
  }

  if (mealCheap != null && midPerPerson != null && transit != null) {
    out.conforto = {
      total_dia: round(mealCheap + midPerPerson + (coffee ?? 0) + transit * 2),
      moeda: 'USD',
      itens: [`Refeição mista`, `Transporte`],
    };
  }

  if (midPerPerson != null) {
    out.luxo = {
      total_dia: round(midPerPerson * 2 + (coffee ?? 0) * 2 + (taxi ?? transit ?? 0) * 2),
      moeda: 'USD',
      itens: [`Refeições mid-range`, taxi != null ? `Táxi` : `Transporte`],
    };
  }

  return Object.keys(out).length ? out : null;
}

/**
 * @param {{ costIndex?: number | null; restaurantIndex?: number | null; groceriesIndex?: number | null }} idx
 * @param {number} localityFactor
 */
export function budgetsFromIndices(idx, localityFactor = 1) {
  const col = (idx.costIndex ?? 50) * localityFactor;
  const rest = (idx.restaurantIndex ?? col) * localityFactor;
  const groc = (idx.groceriesIndex ?? col) * localityFactor;
  const blend = col * 0.5 + rest * 0.3 + groc * 0.2;
  const base = REFERENCE_DAILY_USD * (blend / 100);

  return {
    mochileiro: {
      total_dia: round(base * 0.68),
      moeda: 'USD',
      itens: [`Índice ~${round(col)} (NYC=100)`],
    },
    conforto: {
      total_dia: round(base),
      moeda: 'USD',
      itens: [`Índice restaurantes ~${round(rest)}`],
    },
    luxo: {
      total_dia: round(base * 1.42),
      moeda: 'USD',
      itens: [`Estimativa ajustada`],
    },
  };
}

/**
 * @param {Record<string, unknown>} crisisRow
 * @param {number} localityFactor
 */
export function enrichFromCrisisRow(crisisRow, localityFactor = 1) {
  const col = /** @type {number | null} */ (crisisRow.costIndex ?? null);
  const indices = {
    cost_of_living: col != null ? round(col * localityFactor) : undefined,
    rent: crisisRow.rentIndex ?? undefined,
    restaurant: crisisRow.restaurantIndex ?? undefined,
  };
  const orcamentos = budgetsFromIndices(
    {
      costIndex: col,
      restaurantIndex: /** @type {number | null} */ (crisisRow.restaurantIndex ?? null),
    },
    localityFactor,
  );
  return { indices, orcamentos };
}

/**
 * @param {ReturnType<typeof import('./cost-of-living-data.mjs').loadCostOfLivingIndexes>} indexes
 * @param {{ nome: string; pais: string; continente?: string; tipo?: string; iata?: string | null }} dest
 */
export function resolveBudgetForDestination(indexes, dest) {
  const tier = inferLocalityTier(dest);
  const cityName = leafCityName(dest.nome);
  let countryEn = countryToEnglish(dest.pais);

  let match =
    countryEn && lookupCityRow(indexes.cities, indexes.crisis, cityName, countryEn);
  if (!match) match = lookupCityGlobal(indexes.cities, indexes.crisis, cityName);

  const cityRow = match?.cityRow ?? null;
  const crisisRow = match?.crisisRow ?? null;
  const matchedCity = match?.matchedCity;

  if (!countryEn && cityRow?.country) {
    countryEn = /** @type {string} */ (cityRow.country);
  }

  if (cityRow?.prices) {
    const orcamentos = budgetsFromCityPrices(
      /** @type {Record<string, number | null>} */ (cityRow.prices),
    );
    if (orcamentos) {
      return {
        nivel: 'cidade',
        estimado: false,
        confianca: match?.match === 'fuzzy' ? 'media' : 'alta',
        moeda: 'USD',
        fonte: `Kaggle (${cityRow.source}) — ${matchedCity}${match?.match === 'fuzzy' ? ' (nome aprox.)' : ''}`,
        fator_localidade: tier.factor,
        indices: crisisRow
          ? {
              cost_of_living: crisisRow.costIndex,
              restaurant: crisisRow.restaurantIndex,
            }
          : undefined,
        orcamentos,
      };
    }
  }

  if (crisisRow && !cityRow?.prices) {
    const { indices, orcamentos } = enrichFromCrisisRow(crisisRow, tier.factor);
    return {
      nivel: 'cidade',
      estimado: true,
      confianca: 'media',
      moeda: 'USD',
      fonte: `Kaggle (${crisisRow.source}) — ${matchedCity}`,
      fator_localidade: tier.factor,
      indices,
      orcamentos,
    };
  }

  const countryRow = countryEn ? lookupCountryRow(indexes.countries, countryEn) : null;
  if (!countryRow && countryEn) {
    const tourism = budgetsFromTourism(countryEn);
    if (tourism) return tourism;
  }

  if (countryRow) {
    return {
      nivel: 'pais',
      estimado: true,
      confianca: 'media',
      moeda: 'USD',
      fonte: `Índice ${countryEn} (${countryRow.source}) · ${tier.label} ×${tier.factor}`,
      fator_localidade: tier.factor,
      indices: {
        cost_of_living: round(
          (/** @type {number} */ (countryRow.costIndex) ?? 50) * tier.factor,
        ),
        rent: countryRow.rentIndex,
        restaurant: countryRow.restaurantIndex,
      },
      orcamentos: budgetsFromIndices(
        {
          costIndex: /** @type {number | null} */ (countryRow.costIndex),
          restaurantIndex: /** @type {number | null} */ (countryRow.restaurantIndex),
          groceriesIndex: /** @type {number | null} */ (countryRow.groceriesIndex),
        },
        tier.factor,
      ),
    };
  }

  const cont = continentIndices(dest.continente);
  return {
    nivel: countryEn ? 'global' : 'continente',
    estimado: true,
    confianca: 'baixa',
    moeda: 'USD',
    fonte: countryEn
      ? `Estimativa global · ${tier.label} ×${tier.factor}`
      : `Estimativa ${dest.continente || 'continental'} · ${tier.label} ×${tier.factor}`,
    fator_localidade: tier.factor,
    indices: {
      cost_of_living: round(cont.costIndex * tier.factor),
      restaurant: round(cont.restaurantIndex * tier.factor),
    },
    orcamentos: budgetsFromIndices(cont, tier.factor),
  };
}

/** @param {number} n */
function round(n) {
  return Math.round(n * 100) / 100;
}
