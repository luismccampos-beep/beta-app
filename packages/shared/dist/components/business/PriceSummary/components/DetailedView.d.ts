import React from 'react';
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
export declare const DetailedView: React.FC<DetailedViewProps>;
export {};
