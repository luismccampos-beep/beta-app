"use client";

import React from 'react';
import { Calculator } from 'lucide-react';

import { formatPrice } from '../utils';
import { CalculationBreakdownProps } from '../types';

export const CalculationBreakdown: React.FC<CalculationBreakdownProps> = ({
  subtotal,
  discounts,
  taxes,
  fees,
  extras,
  total,
  currency,
  locale
}) => (
  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
    <h4 className="font-medium mb-2 flex items-center gap-2">
      <Calculator className="h-4 w-4" />
      Cálculo
    </h4>
    <div className="text-xs space-y-1 font-mono">
      <div>Base: {formatPrice(subtotal, currency, locale)}</div>
      {discounts > 0 && (
        <div className="text-green-600">
          - Descontos: {formatPrice(discounts, currency, locale)}
        </div>
      )}
      {taxes > 0 && (
        <div className="text-blue-600">
          + Impostos: {formatPrice(taxes, currency, locale)}
        </div>
      )}
      {fees > 0 && (
        <div className="text-orange-600">
          + Taxas: {formatPrice(fees, currency, locale)}
        </div>
      )}
      {extras > 0 && (
        <div className="text-purple-600">
          + Extras: {formatPrice(extras, currency, locale)}
        </div>
      )}
      <div className="font-bold pt-1 border-t">
        = Total: {formatPrice(total, currency, locale)}
      </div>
    </div>
  </div>
);
