export interface PriceItem {
    id: string;
    label: string;
    amount: number;
    type: 'base' | 'discount' | 'tax' | 'fee' | 'extra';
    description?: string;
    recurring?: boolean;
    period?: 'daily' | 'monthly' | 'yearly';
}
export interface PriceSummaryProps {
    items: PriceItem[];
    currency?: string;
    locale?: string;
    variant?: 'default' | 'compact' | 'detailed' | 'minimal';
    showCalculation?: boolean;
    showTaxes?: boolean;
    showDiscounts?: boolean;
    className?: string;
    onItemHover?: (item: PriceItem | null) => void;
    animated?: boolean;
    highlightTotal?: boolean;
}
export interface PriceCalculations {
    subtotal: number;
    discounts: number;
    taxes: number;
    fees: number;
    extras: number;
    total: number;
    getItemsByType: (type: PriceItem['type']) => PriceItem[];
}
export interface PriceItemRowProps {
    item: PriceItem;
    currency: string;
    locale: string;
    onHover?: (item: PriceItem | null) => void;
    showHoverIcon?: boolean;
    isHovered?: boolean;
}
export interface MinimalViewProps {
    total: number;
    currency: string;
    locale: string;
    highlightTotal: boolean;
}
export interface CompactViewProps {
    subtotal: number;
    discounts: number;
    total: number;
    currency: string;
    locale: string;
    highlightTotal: boolean;
}
export interface CalculationBreakdownProps {
    subtotal: number;
    discounts: number;
    taxes: number;
    fees: number;
    extras: number;
    total: number;
    currency: string;
    locale: string;
}
export interface SummaryCardsProps {
    subtotal: number;
    discounts: number;
    taxes: number;
    fees: number;
    extras: number;
    currency: string;
    locale: string;
}
