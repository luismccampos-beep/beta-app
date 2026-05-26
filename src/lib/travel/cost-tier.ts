/** NYC = 100 reference scale from Kaggle country/city indices. */

export type CostTier = 1 | 2 | 3 | 4 | 5;

export type CostOfLivingSummary = {
  tier: CostTier;
  symbols: string;
  index?: number;
  nivel?: string;
  confianca?: 'alta' | 'media' | 'baixa';
  estimado?: boolean;
};

type CustoDeVida = {
  indices?: { cost_of_living?: number };
  nivel?: string;
  confianca?: 'alta' | 'media' | 'baixa';
  estimado?: boolean;
  orcamentos?: { conforto?: { total_dia: number } };
};

/** @param index NYC-normalized cost index (100 = New York). */
export function costTierFromIndex(index: number | null | undefined): CostTier {
  if (index == null || !Number.isFinite(index)) return 3;
  if (index < 35) return 1;
  if (index < 50) return 2;
  if (index < 65) return 3;
  if (index < 85) return 4;
  return 5;
}

/** Filled euro signs (1–5). */
export function costTierSymbols(tier: CostTier): string {
  return '€'.repeat(tier);
}

export function costTierLabelKey(tier: CostTier): string {
  return `costTier${tier}` as const;
}

/**
 * Build card/detail summary from bundle `custo_de_vida` or daily budget fallback.
 */
export function summarizeCostOfLiving(custo?: CustoDeVida | null): CostOfLivingSummary | null {
  if (!custo?.orcamentos && custo?.indices?.cost_of_living == null) return null;

  let index = custo.indices?.cost_of_living;
  if (index == null && custo.orcamentos?.conforto?.total_dia != null) {
    index = (custo.orcamentos.conforto.total_dia / 92) * 100;
  }

  const tier = costTierFromIndex(index);
  return {
    tier,
    symbols: costTierSymbols(tier),
    index: index != null ? Math.round(index) : undefined,
    nivel: custo.nivel,
    confianca: custo.confianca,
    estimado: custo.estimado,
  };
}
