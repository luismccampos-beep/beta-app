"use client";

import React from 'react';
import { Info } from 'lucide-react';

import { cn } from '../../../../utils';
import { PriceItemRow } from './PriceItemRow';
import { SummaryCards } from './SummaryCards';
import { formatPrice } from '../utils';
import type { PriceItem, PriceCalculations } from '../types';

interface CalculationBreakdownProps {
  subtotal: number;
  discounts: number;
  taxes: number;
  fees: number;
  extras: number;
  total: number;
  currency: string;
  locale: string;
}

interface DetailedViewProps {
  calculations: PriceCalculations;
  items: PriceItem[];
  currency: string;
  locale: string;
  highlightTotal: boolean;
  showCalculation: boolean;
  onItemHover: (item: PriceItem | null) => void;
  hoveredItem: string | null;
  CalculationBreakdown: React.ComponentType<CalculationBreakdownProps>;
}

export const DetailedView: React.FC<DetailedViewProps> = ({
  calculations,
  items,
  currency,
  locale,
  highlightTotal,
  showCalculation,
  onItemHover,
  hoveredItem,
  CalculationBreakdown
}) => (
  <div className="space-y-4">
    {/* Summary Cards */}
    <SummaryCards
      subtotal={calculations.subtotal}
      discounts={calculations.discounts}
      taxes={calculations.taxes}
      fees={calculations.fees}
      extras={calculations.extras}
      currency={currency}
      locale={locale}
    />

    {/* Detailed Breakdown */}
    <div className="border rounded-lg p-4 space-y-3">
      <h4 className="font-medium flex items-center gap-2">
        <Info className="h-4 w-4" />
        Detalhamento
      </h4>
      
      {items.map((item) => (
        <PriceItemRow
          key={item.id}
          item={item}
          currency={currency}
          locale={locale}
          onHover={onItemHover}
          showHoverIcon
          isHovered={hoveredItem === item.id}
        />
      ))}

      {/* Total */}
      <div className={cn(
        'flex justify-between items-center font-bold text-lg pt-3 border-t-2',
        highlightTotal && 'text-primary'
      )}>
        <span>Total</span>
        <span>{formatPrice(calculations.total, currency, locale)}</span>
      </div>
    </div>

    {showCalculation && (
      <CalculationBreakdown
        subtotal={calculations.subtotal}
        discounts={calculations.discounts}
        taxes={calculations.taxes}
        fees={calculations.fees}
        extras={calculations.extras}
        total={calculations.total}
        currency={currency}
        locale={locale}
      />
    )}
  </div>
);