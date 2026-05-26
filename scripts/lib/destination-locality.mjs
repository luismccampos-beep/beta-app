/**
 * Infere "tamanho" do destino para ajustar índices país/continente/global.
 */
import { fold, leafCityName } from './cost-of-living-data.mjs';

/** Capitais conhecidas (nome normalizado). */
const CAPITAL_NAMES = new Set(
  [
    'lisbon', 'lisboa', 'madrid', 'paris', 'london', 'londres', 'rome', 'roma', 'berlin', 'berlim',
    'amsterdam', 'amesterdao', 'brussels', 'bruxelas', 'vienna', 'viena', 'prague', 'praga',
    'budapest', 'budapeste', 'warsaw', 'varsavia', 'athens', 'atenas', 'dublin', 'stockholm',
    'estocolmo', 'oslo', 'copenhagen', 'copenhaga', 'helsinki', 'bucharest', 'zagreb',
    'tokyo', 'toquio', 'beijing', 'pequim', 'shanghai', 'xangai', 'seoul', 'bangkok',
    'banguecoque', 'jakarta', 'manila', 'hanoi', 'singapore', 'singapura', 'delhi', 'mumbai',
    'cairo', 'cairo', 'nairobi', 'cape town', 'cidade do cabo', 'johannesburg', 'joanesburgo',
    'sydney', 'canberra', 'melbourne', 'wellington', 'auckland',
    'ottawa', 'toronto', 'washington', 'new york', 'nova york', 'mexico city', 'cidade do mexico',
    'brasilia', 'brasília', 'sao paulo', 'são paulo', 'rio de janeiro', 'buenos aires',
    'santiago', 'lima', 'bogota', 'quito', 'caracas', 'havana', 'havana',
    'moscow', 'moscou', 'kyiv', 'kiev', 'ankara', 'istanbul', 'istambul', 'tel aviv',
    'riyadh', 'dubai', 'doha', 'islamabad', 'karachi', 'dhaka', 'kathmandu',
    'bern', 'berne', 'zurich', 'zurique', 'geneva', 'genebra',
  ].map(fold),
);

/**
 * @param {{ nome?: string; tipo?: string; iata?: string | null; pais?: string }} dest
 * @returns {{ tier: string; factor: number; label: string }}
 */
export function inferLocalityTier(dest) {
  const leaf = fold(leafCityName(dest.nome ?? ''));
  const full = fold(dest.nome ?? '');

  if (CAPITAL_NAMES.has(leaf)) {
    return { tier: 'capital', factor: 1.2, label: 'capital' };
  }
  if (
    /\b(parque nacional|national park|reserva natural|provincia de|regiao de|region de|district)\b/.test(
      full,
    ) ||
    dest.tipo === 'campo'
  ) {
    return { tier: 'rural', factor: 0.6, label: 'área rural' };
  }
  if (/\b(vila|aldeia|hamlet|village)\b/.test(full) || dest.tipo === 'montanha') {
    return { tier: 'vila', factor: 0.7, label: 'vila / montanha' };
  }
  if ((dest.nome ?? '').includes('/')) {
    return { tier: 'bairro', factor: 0.85, label: 'sub-região' };
  }
  if (dest.tipo === 'ilha') {
    return { tier: 'ilha', factor: 1.05, label: 'ilha' };
  }
  if (dest.tipo === 'praia') {
    return { tier: 'praia', factor: 1.0, label: 'praia' };
  }
  if (dest.tipo === 'cidade' || dest.iata) {
    return { tier: 'cidade', factor: 1.0, label: 'cidade' };
  }
  return { tier: 'pequena', factor: 0.8, label: 'localidade pequena' };
}

/** Índice custo de vida (NYC=100) por continente — fallback. */
export const CONTINENT_INDEX = {
  europa: { costIndex: 55, restaurantIndex: 58, groceriesIndex: 52 },
  america: { costIndex: 58, restaurantIndex: 55, groceriesIndex: 54 },
  asia: { costIndex: 42, restaurantIndex: 38, groceriesIndex: 40 },
  africa: { costIndex: 38, restaurantIndex: 36, groceriesIndex: 37 },
  oceania: { costIndex: 62, restaurantIndex: 60, groceriesIndex: 58 },
  'oriente medio': { costIndex: 52, restaurantIndex: 50, groceriesIndex: 48 },
};

const GLOBAL_INDEX = { costIndex: 50, restaurantIndex: 50, groceriesIndex: 50 };

/** @param {string} [continente] */
export function continentIndices(continente) {
  const k = fold(continente ?? '')
    .replace('america do norte', 'america')
    .replace('america do sul', 'america')
    .replace('oriente médio', 'oriente medio')
    .replace('oriente medio', 'oriente medio');
  if (k.includes('europa')) return CONTINENT_INDEX.europa;
  if (k.includes('america') || k.includes('américa')) return CONTINENT_INDEX.america;
  if (k.includes('asia') || k.includes('ásia')) return CONTINENT_INDEX.asia;
  if (k.includes('africa') || k.includes('áfrica')) return CONTINENT_INDEX.africa;
  if (k.includes('oceania') || k.includes('oceânia')) return CONTINENT_INDEX.oceania;
  if (k.includes('oriente')) return CONTINENT_INDEX['oriente medio'];
  return GLOBAL_INDEX;
}

export { GLOBAL_INDEX };
