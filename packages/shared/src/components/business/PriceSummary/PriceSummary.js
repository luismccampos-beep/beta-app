"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '../../../utils';
import { usePriceCalculations } from './hooks/usePriceCalculations';
// Import components
import { MinimalView, CompactView, DefaultView, DetailedView, CalculationBreakdown } from './components';
export const PriceSummary = ({ items, currency = 'BRL', locale = 'pt-PT', variant = 'default', showCalculation = true, showTaxes = true, showDiscounts = true, className, onItemHover, animated = true, highlightTotal = true }) => {
    const [hoveredItem, setHoveredItem] = React.useState(null);
    // Use custom hook for calculations
    const calculations = usePriceCalculations(items, showDiscounts, showTaxes);
    // Handle item hover
    const handleItemHover = React.useCallback((item) => {
        setHoveredItem(item?.id ?? null);
        onItemHover?.(item);
    }, [onItemHover]);
    // Render content based on variant
    const renderContent = () => {
        const { subtotal, discounts, taxes, fees, extras, total } = calculations;
        switch (variant) {
            case 'minimal':
                return (_jsx(MinimalView, { total: total, currency: currency, locale: locale, highlightTotal: highlightTotal }));
            case 'compact':
                return (_jsx(CompactView, { subtotal: subtotal, discounts: discounts, total: total, currency: currency, locale: locale, highlightTotal: highlightTotal }));
            case 'detailed':
                return (_jsx(DetailedView, { calculations: calculations, items: items, currency: currency, locale: locale, highlightTotal: highlightTotal, showCalculation: showCalculation, onItemHover: handleItemHover, hoveredItem: hoveredItem, CalculationBreakdown: CalculationBreakdown }));
            default:
                return (_jsxs(_Fragment, { children: [_jsx(DefaultView, { calculations: calculations, currency: currency, locale: locale, highlightTotal: highlightTotal, animated: animated }), showCalculation && (_jsx(CalculationBreakdown, { subtotal: subtotal, discounts: discounts, taxes: taxes, fees: fees, extras: extras, total: total, currency: currency, locale: locale }))] }));
        }
    };
    return (_jsx(motion.div, { initial: animated ? { opacity: 0, y: 20 } : false, animate: { opacity: 1, y: 0 }, transition: { duration: animated ? 0.5 : 0 }, className: cn('bg-card rounded-lg border p-4', className), children: renderContent() }));
};
/** @alias */
export default PriceSummary;
//# sourceMappingURL=PriceSummary.js.map