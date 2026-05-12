"use client";

import React from 'react';

import { cn } from '../../../../utils';
import { formatPrice } from '../utils';
import { CompactViewProps } from '../types';

export const CompactView: React.FC<CompactViewProps> = ({ 
  subtotal, 
  discounts, 
  total, 
  currency, 
  locale, 
  highlightTotal 
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span>Subtotal</span>
      <span>{formatPrice(subtotal, currency, locale)}</span>
    </div>
    {discounts > 0 && (
      <div className="flex justify-between text-sm text-green-600">
        <span>Descontos</span>
        <span>-{formatPrice(discounts, currency, locale)}</span>
      </div>
    )}
    <div className={cn(
      'flex justify-between font-semibold pt-2 border-t',
      highlightTotal && 'text-primary'
    )}>
      <span>Total</span>
      <span>{formatPrice(total, currency, locale)}</span>
    </div>
  </div>
);
