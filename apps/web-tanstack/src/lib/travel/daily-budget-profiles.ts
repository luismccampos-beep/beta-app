/**
 * Perfis diários de orçamento (mochileiro / conforto / luxo) com fórmula transparente.
 * Preços de referência: colunas x1–x39 do CSV Kaggle (estilo Numbeo).
 */

export type TravelBudgetProfileId = 'mochileiro' | 'conforto' | 'luxo';

export const TRAVEL_BUDGET_PROFILE_IDS: TravelBudgetProfileId[] = [
  'mochileiro',
  'conforto',
  'luxo',
];

export const PROFILE_TO_BUDGET_PRIORITY: Record<TravelBudgetProfileId, string> = {
  mochileiro: 'maximum-savings',
  conforto: 'balanced',
  luxo: 'luxury',
};

export type CityPriceRow = {
  x1?: number | null;
  x2?: number | null;
  x3?: number | null;
  x14?: number | null;
  x26?: number | null;
  x39?: number | null;
};

export type BudgetLineId =
  | 'breakfastSupermarket'
  | 'breakfastCafe'
  | 'breakfastHotel'
  | 'lunchCheap'
  | 'lunchMid'
  | 'lunchFine'
  | 'dinnerStreet'
  | 'dinnerMid'
  | 'dinnerFine'
  | 'transport'
  | 'attractions';

export type BudgetLine = {
  id: BudgetLineId;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type DailyBudgetEstimate = {
  profile: TravelBudgetProfileId;
  total: number;
  currency: string;
  lines: BudgetLine[];
  referenceCity: string;
  referenceCountry: string;
};

/** Londres — dados reais do CSV (USD). */
export const REFERENCE_LONDON: CityPriceRow = {
  x1: 18.45,
  x2: 79.95,
  x3: 8.0,
  x14: 8.19,
  x26: 15.99,
  x39: 28.88,
};

/** Lisboa — referência PT (USD). */
export const REFERENCE_LISBON: CityPriceRow = {
  x1: 12.64,
  x2: 52.69,
  x3: 7.38,
  x14: 6.94,
  x26: 2.07,
  x39: 9.58,
};

const FX_TO: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  BRL: 5.05,
};

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function midMeal(p: CityPriceRow) {
  return p.x2 != null ? p.x2 / 2 : (p.x1 ?? 10) * 1.35;
}

/**
 * Custo diário = refeições + transporte + atrações (estimativa).
 * Cada perfil usa preço mínimo / médio / alto conforme a tabela de referência.
 */
export function calculateDailyBudget(
  profile: TravelBudgetProfileId,
  prices: CityPriceRow,
): DailyBudgetEstimate {
  const cheap = prices.x1 ?? prices.x3 ?? 10;
  const mc = prices.x3 ?? cheap * 0.85;
  const cafe = prices.x14 ?? cheap * 0.45;
  const mid = midMeal(prices);
  const transit = prices.x26 ?? 2;
  const taxi = prices.x39 ?? transit * 4;

  /** @type {BudgetLine[]} */
  const lines: BudgetLine[] = [];

  if (profile === 'mochileiro') {
    const breakfast = round(Math.min(mc, cheap * 0.6));
    const lunch = round(cheap);
    const dinner = round(mc);
    lines.push(
      { id: 'breakfastSupermarket', quantity: 1, unitPrice: breakfast, subtotal: breakfast },
      { id: 'lunchCheap', quantity: 1, unitPrice: lunch, subtotal: lunch },
      { id: 'dinnerStreet', quantity: 1, unitPrice: dinner, subtotal: dinner },
      { id: 'transport', quantity: 2, unitPrice: round(transit), subtotal: round(transit * 2) },
    );
  } else if (profile === 'conforto') {
    lines.push(
      { id: 'breakfastCafe', quantity: 1, unitPrice: round(cafe), subtotal: round(cafe) },
      { id: 'lunchMid', quantity: 1, unitPrice: round(mid), subtotal: round(mid) },
      { id: 'dinnerMid', quantity: 1, unitPrice: round(mid), subtotal: round(mid) },
      { id: 'transport', quantity: 2, unitPrice: round(transit), subtotal: round(transit * 2) },
      {
        id: 'attractions',
        quantity: 1,
        unitPrice: round(mid * 0.35),
        subtotal: round(mid * 0.35),
      },
    );
  } else {
    const fine = round(mid * 1.25);
    const hotelBreakfast = round(mid * 0.95);
    lines.push(
      { id: 'breakfastHotel', quantity: 1, unitPrice: hotelBreakfast, subtotal: hotelBreakfast },
      { id: 'lunchFine', quantity: 1, unitPrice: fine, subtotal: fine },
      { id: 'dinnerFine', quantity: 1, unitPrice: fine, subtotal: fine },
      { id: 'transport', quantity: 2, unitPrice: round(taxi), subtotal: round(taxi * 2) },
      {
        id: 'attractions',
        quantity: 1,
        unitPrice: round(fine * 0.5),
        subtotal: round(fine * 0.5),
      },
    );
  }

  const total = round(lines.reduce((s, l) => s + l.subtotal, 0));

  return {
    profile,
    total,
    currency: 'USD',
    lines,
    referenceCity: 'London',
    referenceCountry: 'United Kingdom',
  };
}

export function convertBudgetEstimate(
  estimate: DailyBudgetEstimate,
  targetCurrency: string,
): DailyBudgetEstimate {
  const rate = FX_TO[targetCurrency] ?? 1;
  if (rate === 1 && estimate.currency === targetCurrency) return estimate;

  const fromRate = FX_TO[estimate.currency] ?? 1;
  const factor = rate / fromRate;

  return {
    ...estimate,
    currency: targetCurrency,
    total: round(estimate.total * factor),
    lines: estimate.lines.map((l) => ({
      ...l,
      unitPrice: round(l.unitPrice * factor),
      subtotal: round(l.subtotal * factor),
    })),
  };
}

export function estimateForProfile(
  profile: TravelBudgetProfileId,
  currency = 'USD',
  reference: CityPriceRow = REFERENCE_LONDON,
): DailyBudgetEstimate {
  const base = calculateDailyBudget(profile, reference);
  base.referenceCity = reference === REFERENCE_LISBON ? 'Lisbon' : 'London';
  base.referenceCountry = reference === REFERENCE_LISBON ? 'Portugal' : 'United Kingdom';
  return convertBudgetEstimate(base, currency);
}

/** Usa orçamento do bundle quando disponível; senão calcula a partir de preços. */
export function dailyTotalFromBundle(
  profile: TravelBudgetProfileId,
  custo?: {
    orcamentos?: Partial<Record<TravelBudgetProfileId, { total_dia: number; moeda: string }>>;
  } | null,
): { total: number; moeda: string; fromBundle: boolean } | null {
  const o = custo?.orcamentos?.[profile];
  if (o?.total_dia != null) {
    return { total: o.total_dia, moeda: o.moeda ?? 'USD', fromBundle: true };
  }
  return null;
}
