"use client";

import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '../../../utils';
// Import types and hooks
import type { PriceSummaryProps, PriceItem } from './types';
import { usePriceCalculations } from './hooks/usePriceCalculations';
// Import components
import {
  MinimalView,
  CompactView,
  DefaultView,
  DetailedView,
  CalculationBreakdown
} from './components';

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  items,
  currency = 'BRL',
  locale = 'pt-PT',
  variant = 'default',
  showCalculation = true,
  showTaxes = true,
  showDiscounts = true,
  className,
  onItemHover,
  animated = true,
  highlightTotal = true
}) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  // Use custom hook for calculations
  const calculations = usePriceCalculations(items, showDiscounts, showTaxes);

  // Handle item hover
  const handleItemHover = React.useCallback((item: PriceItem | null) => {
    setHoveredItem(item?.id ?? null);
    onItemHover?.(item);
  }, [onItemHover]);

  // Render content based on variant
  const renderContent = () => {
    const { subtotal, discounts, taxes, fees, extras, total } = calculations;

    switch (variant) {
      case 'minimal':
        return (
          <MinimalView
            total={total}
            currency={currency}
            locale={locale}
            highlightTotal={highlightTotal}
          />
        );
      case 'compact':
        return (
          <CompactView
            subtotal={subtotal}
            discounts={discounts}
            total={total}
            currency={currency}
            locale={locale}
            highlightTotal={highlightTotal}
          />
        );
      case 'detailed':
        return (
          <DetailedView
            calculations={calculations}
            items={items}
            currency={currency}
            locale={locale}
            highlightTotal={highlightTotal}
            showCalculation={showCalculation}
            onItemHover={handleItemHover}
            hoveredItem={hoveredItem}
            CalculationBreakdown={CalculationBreakdown}
          />
        );
      default:
        return (
          <>
            <DefaultView
              calculations={calculations}
              currency={currency}
              locale={locale}
              highlightTotal={highlightTotal}
              animated={animated}
            />
            {showCalculation && (
              <CalculationBreakdown
                subtotal={subtotal}
                discounts={discounts}
                taxes={taxes}
                fees={fees}
                extras={extras}
                total={total}
                currency={currency}
                locale={locale}
              />
            )}
          </>
        );
    }
  };

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animated ? 0.5 : 0 }}
      className={cn('bg-card rounded-lg border p-4', className)}
    >
      {renderContent()}
    </motion.div>
  );
};

/** @alias */
export default PriceSummary;
