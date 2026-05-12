import type { PriceItem } from './types';
export declare const formatPrice: (amount: number, currency: string, locale: string) => string;
export declare const getItemIcon: (type: PriceItem["type"]) => string;
export declare const getItemColor: (type: PriceItem["type"]) => string;
export declare const getPeriodLabel: (period: "daily" | "monthly" | "yearly") => string;
/**
 * Validates if the amount is a valid number for price calculation
 */
export declare const isValidPrice: (amount: number) => boolean;
/**
 * Safely formats a price with fallback for invalid amounts
 */
export declare const safeFormatPrice: (amount: number, currency: string, locale: string) => string;
