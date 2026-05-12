"use client";

import React from 'react';
import { Info } from 'lucide-react';

import { cn } from '../../../../utils';
import { PriceItemRowProps } from '../types';
import { getItemIcon, getItemColor, formatPrice } from '../utils';

export const PriceItemRow: React.FC<PriceItemRowProps> = ({ 
  item, 
  currency, 
  locale, 
  onHover, 
  showHoverIcon, 
  isHovered 
}) => (
  <div 
    className="flex justify-between items-center py-2 border-b last:border-b-0"
    onMouseEnter={() => onHover?.(item)}
    onMouseLeave={() => onHover?.(null)}
  >
    <div className="flex items-center gap-2">
      {getItemIcon(item.type)}
      <div>
        <span className="text-sm">{item.label}</span>
        {item.description && (
          <p className="text-xs text-muted-foreground">{item.description}</p>
        )}
        {item.recurring && item.period && (
          <span className="text-xs text-muted-foreground">
            ({item.period === 'monthly' ? 'mensal' : item.period === 'yearly' ? 'anual' : 'diário'})
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={cn('font-medium', getItemColor(item.type))}>
        {item.type === 'discount' ? '-' : ''}{formatPrice(item.amount, currency, locale)}
      </span>
      {showHoverIcon && isHovered && (
        <Info className="h-3 w-3 text-muted-foreground" />
      )}
    </div>
  </div>
);
