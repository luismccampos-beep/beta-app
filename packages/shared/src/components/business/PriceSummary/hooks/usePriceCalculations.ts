import { useMemo } from 'react';

import { PriceItem, PriceCalculations } from '../types';

export const usePriceCalculations = (
  items: PriceItem[],
  showDiscounts: boolean = true,
  showTaxes: boolean = true
): PriceCalculations => {
  return useMemo(() => {
    const getItemsByType = (type: PriceItem['type']) => 
      items.filter(item => item.type === type);

    const subtotal = getItemsByType('base').reduce((sum, item) => sum + item.amount, 0);
    const discounts = showDiscounts 
      ? getItemsByType('discount').reduce((sum, item) => sum + item.amount, 0)
      : 0;
    const taxes = showTaxes 
      ? getItemsByType('tax').reduce((sum, item) => sum + item.amount, 0)
      : 0;
    const fees = getItemsByType('fee').reduce((sum, item) => sum + item.amount, 0);
    const extras = getItemsByType('extra').reduce((sum, item) => sum + item.amount, 0);
    const total = items.reduce((sum, item) => sum + item.amount, 0);

    return {
      subtotal,
      discounts,
      taxes,
      fees,
      extras,
      total,
      getItemsByType
    };
  }, [items, showDiscounts, showTaxes]);
};
