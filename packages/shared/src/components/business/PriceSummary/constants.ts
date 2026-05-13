export const DEFAULT_CURRENCY = 'BRL';
export const DEFAULT_LOCALE = 'pt-PT';

export const ITEM_TYPE_CONFIG = {
  base: {
    icon: 'Receipt',
    color: 'text-foreground',
  },
  discount: {
    icon: 'Percent',
    color: 'text-green-600',
  },
  tax: {
    icon: 'Calculator',
    color: 'text-blue-600',
  },
  fee: {
    icon: 'CreditCard',
    color: 'text-orange-600',
  },
  extra: {
    icon: 'TrendingUp',
    color: 'text-purple-600',
  },
} as const;

export const PERIOD_LABELS = {
  monthly: 'mensal',
  yearly: 'anual',
  daily: 'diário',
} as const;

export const ANIMATION_DELAYS = {
  base: 0,
  discount: 0.1,
  tax: 0.2,
  fee: 0.3,
  extra: 0.4,
  total: 0.5,
} as const;
