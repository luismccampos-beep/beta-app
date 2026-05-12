import { ITEM_TYPE_CONFIG, PERIOD_LABELS } from './constants';
export const formatPrice = (amount, currency, locale) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
    }).format(amount);
};
export const getItemIcon = (type) => {
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
export const getItemColor = (type) => {
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
export const getPeriodLabel = (period) => {
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
export const isValidPrice = (amount) => {
    return !isNaN(amount) && isFinite(amount);
};
/**
 * Safely formats a price with fallback for invalid amounts
 */
export const safeFormatPrice = (amount, currency, locale) => {
    if (!isValidPrice(amount)) {
        return formatPrice(0, currency, locale);
    }
    return formatPrice(amount, currency, locale);
};
//# sourceMappingURL=utils.js.map