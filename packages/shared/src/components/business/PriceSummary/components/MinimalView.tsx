"use client";

import React from 'react';

import { cn } from '../../../../utils';
import { formatPrice } from '../utils';
import { MinimalViewProps } from '../types';

export const MinimalView: React.FC<MinimalViewProps> = ({ 
  total, 
  currency, 
  locale, 
  highlightTotal 
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">Total</span>
    <span className={cn(
      'font-bold text-lg',
      highlightTotal && 'text-primary'
    )}>
      {formatPrice(total, currency, locale)}
    </span>
  </div>
);
