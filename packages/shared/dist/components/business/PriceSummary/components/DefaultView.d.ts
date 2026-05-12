import React from 'react';
import type { PriceCalculations } from '../types';
interface DefaultViewProps {
    calculations: PriceCalculations;
    currency: string;
    locale: string;
    highlightTotal: boolean;
    animated: boolean;
}
export declare const DefaultView: React.FC<DefaultViewProps>;
export {};
