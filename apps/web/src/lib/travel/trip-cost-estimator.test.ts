import { describe, expect, it } from 'vitest';

import { estimateTripCost } from './trip-cost-estimator';
import type { MockDestination } from './mock-travel/types';

const baseDest: MockDestination = {
  id: 1,
  nome: 'Lisboa',
  pais: 'Portugal',
  paisCode: 'PT',
  iata: 'LIS',
  continente: 'Europa',
  tipo: 'cidade',
  clima: 'mediterrânico',
  descricao: '',
  imagem_url: '',
  custo_de_vida: {
    moeda: 'EUR',
    fonte: 'demo',
    nivel: 'cidade',
    orcamentos: { conforto: { total_dia: 80, moeda: 'EUR' } },
  },
};

describe('estimateTripCost', () => {
  it('sums accommodation, food, transport and flight', () => {
    const cost = estimateTripCost(
      baseDest,
      {
        nights: 3,
        travelers: 2,
        preferences: { budgetRange: [500, 3000], dailyBudgetProfile: 'conforto' },
      },
      { hotel: { id: 1, destino_id: 1, nome: 'H', estrelas: 3, preco_por_noite: 90, comodidades: [] }, flightPrice: 120 },
    );

    expect(cost.tripTotal).toBeGreaterThan(0);
    expect(cost.flightTotal).toBe(240);
    expect(cost.withinBudget).toBe(true);
  });

  it('flags over budget when trip exceeds max', () => {
    const cost = estimateTripCost(
      baseDest,
      {
        nights: 14,
        travelers: 4,
        preferences: { budgetRange: [100, 400], dailyBudgetProfile: 'luxo' },
      },
      { hotel: { id: 1, destino_id: 1, nome: 'H', estrelas: 5, preco_por_noite: 200, comodidades: [] }, flightPrice: 300 },
    );

    expect(cost.withinBudget).toBe(false);
  });
});
