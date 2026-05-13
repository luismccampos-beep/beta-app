export declare const DEFAULT_CURRENCY = "BRL";
export declare const DEFAULT_LOCALE = "pt-PT";
export declare const ITEM_TYPE_CONFIG: {
    readonly base: {
        readonly icon: "Receipt";
        readonly color: "text-foreground";
    };
    readonly discount: {
        readonly icon: "Percent";
        readonly color: "text-green-600";
    };
    readonly tax: {
        readonly icon: "Calculator";
        readonly color: "text-blue-600";
    };
    readonly fee: {
        readonly icon: "CreditCard";
        readonly color: "text-orange-600";
    };
    readonly extra: {
        readonly icon: "TrendingUp";
        readonly color: "text-purple-600";
    };
};
export declare const PERIOD_LABELS: {
    readonly monthly: "mensal";
    readonly yearly: "anual";
    readonly daily: "diário";
};
export declare const ANIMATION_DELAYS: {
    readonly base: 0;
    readonly discount: 0.1;
    readonly tax: 0.2;
    readonly fee: 0.3;
    readonly extra: 0.4;
    readonly total: 0.5;
};
