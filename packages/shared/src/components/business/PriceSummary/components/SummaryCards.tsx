"use client";

import React from 'react';
import { Receipt, Percent, Calculator, CreditCard } from 'lucide-react';

import { formatPrice } from '../utils';
import { SummaryCardsProps } from '../types';

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  subtotal,
  discounts,
  taxes,
  fees,
  extras,
  currency,
  locale
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Receipt className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Base</span>
      </div>
      <div className="font-semibold">
        {formatPrice(subtotal, currency, locale)}
      </div>
    </div>
    
    {discounts > 0 && (
      <div className="bg-green-50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Percent className="h-4 w-4 text-green-600" />
          <span className="text-xs text-green-600">Descontos</span>
        </div>
        <div className="font-semibold text-green-600">
          -{formatPrice(discounts, currency, locale)}
        </div>
      </div>
    )}

    {taxes > 0 && (
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-blue-600">Impostos</span>
        </div>
        <div className="font-semibold text-blue-600">
          {formatPrice(taxes, currency, locale)}
        </div>
      </div>
    )}

    {(fees + extras) > 0 && (
      <div className="bg-orange-50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="h-4 w-4 text-orange-600" />
          <span className="text-xs text-orange-600">Taxas</span>
        </div>
        <div className="font-semibold text-orange-600">
          {formatPrice(fees + extras, currency, locale)}
        </div>
      </div>
    )}
  </div>
);
