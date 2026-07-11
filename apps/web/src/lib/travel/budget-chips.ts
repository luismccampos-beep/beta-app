export type BudgetChip = {
  id: string;
  label: string;
  range: [number, number];
  emoji: string;
};

export const BUDGET_CHIPS: BudgetChip[] = [
  { id: 'economico', label: 'Económico', range: [500, 2000], emoji: '🎒' },
  { id: 'conforto', label: 'Conforto', range: [2000, 5000], emoji: '✈️' },
  { id: 'premium', label: 'Premium', range: [5000, 15000], emoji: '🌟' },
  { id: 'luxo', label: 'Luxo', range: [15000, 50000], emoji: '👑' },
];
