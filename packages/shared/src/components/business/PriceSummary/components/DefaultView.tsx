"use client";

import React from 'react';
import { motion } from 'framer-motion';

import { getItemIcon, formatPrice } from '../utils';
import { ANIMATION_DELAYS } from '../constants';
import { cn } from '../../../../utils';
import type { PriceCalculations } from '../types';

interface DefaultViewProps {
  calculations: PriceCalculations;
  currency: string;
  locale: string;
  highlightTotal: boolean;
  animated: boolean;
}

export const DefaultView: React.FC<DefaultViewProps> = ({
  calculations,
  currency,
  locale,
  highlightTotal,
  animated
}) => (
  <div className="space-y-3">
    {/* Base Items */}
    {calculations.getItemsByType('base').map(item => (
      <motion.div
        key={item.id}
        initial={animated ? { opacity: 0, x: -10 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: ANIMATION_DELAYS.base }}
        className="flex justify-between items-start"
      >
        <div className="flex items-center gap-2">
          {getItemIcon(item.type)}
          <div>
            <span className="text-sm font-medium">{item.label}</span>
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
        <span className="font-medium">
          {formatPrice(item.amount, currency, locale)}
        </span>
      </motion.div>
    ))}

    {/* Discounts */}
    {calculations.discounts > 0 && calculations.getItemsByType('discount').map(item => (
      <motion.div
        key={item.id}
        initial={animated ? { opacity: 0, x: -10 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: ANIMATION_DELAYS.discount }}
        className="flex justify-between items-center text-green-600"
      >
        <div className="flex items-center gap-2">
          {getItemIcon(item.type)}
          <span className="text-sm">{item.label}</span>
        </div>
        <span className="font-medium">
          -{formatPrice(item.amount, currency, locale)}
        </span>
      </motion.div>
    ))}

    {/* Taxes */}
    {calculations.taxes > 0 && calculations.getItemsByType('tax').map(item => (
      <motion.div
        key={item.id}
        initial={animated ? { opacity: 0, x: -10 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: ANIMATION_DELAYS.tax }}
        className="flex justify-between items-center text-blue-600"
      >
        <div className="flex items-center gap-2">
          {getItemIcon(item.type)}
          <span className="text-sm">{item.label}</span>
        </div>
        <span className="font-medium">
          {formatPrice(item.amount, currency, locale)}
        </span>
      </motion.div>
    ))}

    {/* Fees */}
    {calculations.fees > 0 && calculations.getItemsByType('fee').map(item => (
      <motion.div
        key={item.id}
        initial={animated ? { opacity: 0, x: -10 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: ANIMATION_DELAYS.fee }}
        className="flex justify-between items-center text-orange-600"
      >
        <div className="flex items-center gap-2">
          {getItemIcon(item.type)}
          <span className="text-sm">{item.label}</span>
        </div>
        <span className="font-medium">
          {formatPrice(item.amount, currency, locale)}
        </span>
      </motion.div>
    ))}

    {/* Extras */}
    {calculations.extras > 0 && calculations.getItemsByType('extra').map(item => (
      <motion.div
        key={item.id}
        initial={animated ? { opacity: 0, x: -10 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: ANIMATION_DELAYS.extra }}
        className="flex justify-between items-center text-purple-600"
      >
        <div className="flex items-center gap-2">
          {getItemIcon(item.type)}
          <span className="text-sm">{item.label}</span>
        </div>
        <span className="font-medium">
          {formatPrice(item.amount, currency, locale)}
        </span>
      </motion.div>
    ))}

    {/* Total */}
    <motion.div
      initial={animated ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: ANIMATION_DELAYS.total }}
      className={cn(
        'flex justify-between items-center font-bold text-lg pt-3 border-t',
        highlightTotal && 'text-primary'
      )}
    >
      <span>Total</span>
      <span>{formatPrice(calculations.total, currency, locale)}</span>
    </motion.div>
  </div>
);
