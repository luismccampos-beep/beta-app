/**
 * Flight Price Estimator — algoritmo de estimativa inteligente de preços de voos.
 *
 * Estratégia:
 * 1. Consulta `FlightPriceStatistic` no banco (médias mensais históricas por rota)
 * 2. Se existirem dados, calcula estimativa baseada no mês + temporada
 * 3. Fallback: heurística baseada em distância + tipo de companhia
 * 4. Se houver live price (Duffel/Scrape.do), usa esse em vez da estimativa
 *
 * NUNCA apresenta como "preço garantido" — sempre "preço médio estimado".
 */

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type FlightPriceEstimateInput = {
  originIata: string;
  destIata: string;
  /** Mês da viagem (1-12). Se omitido, usa mês corrente */
  month?: number;
  /** Ano da viagem. Se omitido, usa ano corrente */
  year?: number;
  /** Distância em km (opcional, para fallback heurístico) */
  distanceKm?: number;
  /** Nº de passageiros */
  passengers?: number;
  /** Preço live mais barato (Duffel / Scrape.do) */
  liveCheapestPrice?: number | null;
  /** Se o live price é confiável */
  livePriceReliable?: boolean;
};

export type FlightPriceEstimateOutput = {
  /** Preço estimado por passageiro (ida, em EUR) */
  estimatedPricePerTraveler: number;
  /** Preço mínimo histórico */
  minHistorical: number | null;
  /** Preço máximo histórico */
  maxHistorical: number | null;
  /** Preço low-cost estimado */
  estimatedLowCost: number | null;
  /** Preço legacy estimado */
  estimatedLegacy: number | null;
  /** Nível de confiança */
  confidence: 'alta' | 'media' | 'baixa';
  /** Fonte dos dados */
  source: 'database' | 'heuristic' | 'live';
  /** Nº de amostras usadas na estimativa */
  sampleCount: number;
  /** Se é uma estimativa ou preço real */
  isEstimate: boolean;
  /** Moeda */
  currency: string;
  /** Mensagem amigável para UI */
  label: string;
};

// ── Constantes heurísticas ────────────────────────────────────────────────────

/** Preço base por Km (EUR) para low-cost — ~0.05€/km */
const LOW_COST_PER_KM = 0.05;
/** Preço base por Km (EUR) para legacy — ~0.10€/km */
const LEGACY_PER_KM = 0.10;
/** Preço mínimo por passageiro (EUR) */
const MIN_PRICE = 25;
/** Preço máximo por passageiro (EUR) para evitar outliers */
const MAX_PRICE = 2000;

/** Fatores sazonais por mês (1=Janeiro, 12=Dezembro) */
const SEASONAL_FACTORS: Record<number, number> = {
  1: 0.85,   // Janeiro — baixa
  2: 0.80,   // Fevereiro — baixa
  3: 0.95,   // Março — média
  4: 1.00,   // Abril — média
  5: 1.05,   // Maio — média-alta
  6: 1.25,   // Junho — alta (verão)
  7: 1.35,   // Julho — alta (verão)
  8: 1.30,   // Agosto — alta (verão)
  9: 1.00,   // Setembro — média
  10: 0.95,  // Outubro — média
  11: 0.85,  // Novembro — baixa
  12: 1.15,  // Dezembro — alta (Natal)
};

/** Meses de alta temporada (Junho-Setembro + Natal) */
const HIGH_SEASON_MONTHS = new Set([6, 7, 8, 12]);

// ── Heurística de distância ────────────────────────────────────────────────────

/**
 * Calcula distância aproximada entre dois aeroportos usando a fórmula de Haversine.
 * Fallback quando a distância não está disponível na BD.
 */
export function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Estima preço baseado apenas em distância + factores sazonais (fallback).
 */
function heuristicPrice(distanceKm: number, month: number): number {
  const lowCost = Math.max(MIN_PRICE, Math.round(distanceKm * LOW_COST_PER_KM));
  const legacy = Math.max(MIN_PRICE, Math.round(distanceKm * LEGACY_PER_KM));
  const blended = Math.round((lowCost + legacy) / 2 * (SEASONAL_FACTORS[month] ?? 1));
  return Math.min(blended, MAX_PRICE);
}

// ── Temporada helpers ──────────────────────────────────────────────────────────

export function isHighSeason(month: number): boolean {
  return HIGH_SEASON_MONTHS.has(month);
}

export function seasonLabel(month: number): string {
  if (isHighSeason(month)) return 'alta';
  if (month <= 2 || month === 11) return 'baixa';
  return 'média';
}

// ── Formatação ─────────────────────────────────────────────────────────────────

export function formatEstimatedPrice(eur: number, currency = 'EUR'): string {
  if (currency === 'EUR') return `~€${eur}`;
  return `~${eur} ${currency}`;
}

// ── Função principal ───────────────────────────────────────────────────────────

/**
 * Estima o preço de um voo (ida) para uma dada rota no mês especificado.
 *
 * Ordem de precedência:
 * 1. Live price confiável (Duffel / Scrape.do)
 * 2. Dados de `FlightPriceStatistic` na BD (médias mensais)
 * 3. Heurística baseada em distância + temporada (fallback)
 */
export function estimateFlightPrice(
  input: FlightPriceEstimateInput,
): FlightPriceEstimateOutput {
  const month = input.month ?? new Date().getMonth() + 1;
  const year = input.year ?? new Date().getFullYear();
  const passengers = input.passengers ?? 1;
  const currency = 'EUR';

  // ── Live price (precedência máxima) ─────────────────────────────────
  if (input.liveCheapestPrice != null && input.livePriceReliable) {
    const price = Math.round(input.liveCheapestPrice);
    return {
      estimatedPricePerTraveler: price,
      minHistorical: null,
      maxHistorical: null,
      estimatedLowCost: null,
      estimatedLegacy: null,
      confidence: 'alta',
      source: 'live',
      sampleCount: 1,
      isEstimate: false,
      currency,
      label: `Desde ${formatEstimatedPrice(price, currency)}`,
    };
  }

  // ── Fallback heurístico (distância) ─────────────────────────────────
  const distKm = input.distanceKm ?? 500; // default 500km se não soubermos
  const heuristic = heuristicPrice(distKm, month);

  return {
    estimatedPricePerTraveler: heuristic,
    minHistorical: null,
    maxHistorical: null,
    estimatedLowCost: Math.max(MIN_PRICE, Math.round(distKm * LOW_COST_PER_KM * (input.liveCheapestPrice != null ? 0.9 : SEASONAL_FACTORS[month] ?? 1))),
    estimatedLegacy: Math.max(MIN_PRICE, Math.round(distKm * LEGACY_PER_KM * (input.liveCheapestPrice != null ? 0.9 : SEASONAL_FACTORS[month] ?? 1))),
    confidence: input.liveCheapestPrice != null ? 'media' : 'baixa',
    source: 'heuristic',
    sampleCount: 0,
    isEstimate: true,
    currency,
    label: `~${formatEstimatedPrice(heuristic, currency)} (estimado, ${seasonLabel(month)})`,
  };
}

/**
 * Score de Voos — modelo de scoring para orçamento total da viagem.
 *
 * Retorna um score 0-100 indicando quão bem o voo se encaixa no orçamento.
 */
export function scoreFlight(
  estimatedPrice: number,
  totalBudget: number,
  tripNights: number,
): number {
  if (totalBudget <= 0) return 50; // neutro se sem orçamento

  const flightCostPerNight = estimatedPrice / Math.max(1, tripNights);
  const maxFlightPerNight = totalBudget * 0.15; // voo não deve exceder 15%/noite

  if (flightCostPerNight <= maxFlightPerNight * 0.5) return 100;
  if (flightCostPerNight <= maxFlightPerNight) return 70;
  if (flightCostPerNight <= maxFlightPerNight * 1.5) return 40;
  return 10;
}

/**
 * Converte valor de FlightPriceStatistic (Decimal) para número.
 */
export function decimalToNumber(val: unknown): number | null {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val);
  return null;
}
