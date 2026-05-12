import type { PriceItem } from './types';
import { ITEM_TYPE_CONFIG, PERIOD_LABELS } from './constants';

export const formatPrice = (amount: number, currency: string, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};

export const getItemIcon = (type: PriceItem['type']): string => {
  switch (type) {
    case 'base':
      return 'Receipt';
    case 'discount':
      return 'Percent';
    case 'tax':
      return 'Calculator';
    case 'fee':
      return 'CreditCard';
    case 'extra':
      return 'TrendingUp';
    default:
      return 'DollarSign';
  }
};

export const getItemColor = (type: PriceItem['type']): string => {
  switch (type) {
    case 'base':
      return ITEM_TYPE_CONFIG.base.color;
    case 'discount':
      return ITEM_TYPE_CONFIG.discount.color;
    case 'tax':
      return ITEM_TYPE_CONFIG.tax.color;
    case 'fee':
      return ITEM_TYPE_CONFIG.fee.color;
    case 'extra':
      return ITEM_TYPE_CONFIG.extra.color;
    default:
      return 'text-foreground';
  }
};

export const getPeriodLabel = (period: 'daily' | 'monthly' | 'yearly'): string => {
  switch (period) {
    case 'daily':
      return PERIOD_LABELS.daily;
    case 'monthly':
      return PERIOD_LABELS.monthly;
    case 'yearly':
      return PERIOD_LABELS.yearly;
    default:
      return '';
  }
};

/**
 * Validates if the amount is a valid number for price calculation
 */
export const isValidPrice = (amount: number): boolean => {
  return !isNaN(amount) && isFinite(amount);
};

/**
 * Safely formats a price with fallback for invalid amounts
 */
export const safeFormatPrice = (
  amount: number, 
  currency: string, 
  locale: string
): string => {
  if (!isValidPrice(amount)) {
    return formatPrice(0, currency, locale);
  }
  return formatPrice(amount, currency, locale);
};