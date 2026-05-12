// packages/shared/src/types/ai-preferences/interfaces.ts
import { BudgetLevel } from './enums';

/**
 * Default budget range configurations for the 5 money choices
 */
export const BUDGET_RANGE_CONFIGS = {
    [BudgetLevel.Economy]: {
        level: BudgetLevel.Economy,
        minAmount: 0,
        maxAmount: 500,
        label: 'Economy',
        description: 'Budget-friendly options for cost-conscious travelers',
    },
    [BudgetLevel.Moderate]: {
        level: BudgetLevel.Moderate,
        minAmount: 300,
        maxAmount: 1000,
        label: 'Moderate',
        description: 'Moderate spending with balanced value',
    },
    [BudgetLevel.Comfort]: {
        level: BudgetLevel.Comfort,
        minAmount: 800,
        maxAmount: 2000,
        label: 'Comfort',
        description: 'Comfortable spending for a relaxing experience',
    },
    [BudgetLevel.Premium]: {
        level: BudgetLevel.Premium,
        minAmount: 1500,
        maxAmount: 5000,
        label: 'Premium',
        description: 'Premium experience with high-quality services',
    },
    [BudgetLevel.Luxury]: {
        level: BudgetLevel.Luxury,
        minAmount: 4000,
        maxAmount: 50000,
        label: 'Luxury',
        description: 'Luxury options with exclusive experiences',
    },
};
//# sourceMappingURL=interfaces.js.map