"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';

import { getItemIcon, formatPrice } from '../utils';
import { ANIMATION_DELAYS } from '../constants';
import { cn } from '../../../../utils';

export const DefaultView = ({ calculations, currency, locale, highlightTotal, animated }) => (
  _jsxs("div", { className: "space-y-3", children: [
    calculations.getItemsByType('base').map(item => (
      _jsxs(motion.div, { 
        initial: animated ? { opacity: 0, x: -10 } : false, 
        animate: { opacity: 1, x: 0 }, 
        transition: { duration: 0.2, delay: ANIMATION_DELAYS.base }, 
        className: "flex justify-between items-start", 
        children: [
          _jsxs("div", { 
            className: "flex items-center gap-2", 
            children: [
              getItemIcon(item.type), 
              _jsxs("div", { 
                children: [
                  _jsx("span", { className: "text-sm font-medium", children: item.label }), 
                  item.description && (
                    _jsx("p", { className: "text-xs text-muted-foreground", children: item.description })
                  ), 
                  item.recurring && item.period && (
                    _jsxs("span", { 
                      className: "text-xs text-muted-foreground", 
                      children: [
                        "(",
                        item.period === 'monthly' ? 'mensal' : item.period === 'yearly' ? 'anual' : 'diário',
                        ")"
                      ]
                    })
                  )
                ]
              })
            ]
          }), 
          _jsx("span", { className: "font-medium", children: formatPrice(item.amount, currency, locale) })
        ]
      }, item.id)
    )),
    calculations.discounts > 0 && calculations.getItemsByType('discount').map(item => (
      _jsxs(motion.div, { 
        initial: animated ? { opacity: 0, x: -10 } : false, 
        animate: { opacity: 1, x: 0 }, 
        transition: { duration: 0.2, delay: ANIMATION_DELAYS.discount }, 
        className: "flex justify-between items-center text-green-600", 
        children: [
          _jsxs("div", { 
            className: "flex items-center gap-2", 
            children: [
              getItemIcon(item.type), 
              _jsx("span", { className: "text-sm", children: item.label })
            ]
          }), 
          _jsxs("span", { 
            className: "font-medium", 
            children: [
              "-",
              formatPrice(item.amount, currency, locale)
            ]
          })
        ]
      }, item.id)
    )),
    calculations.taxes > 0 && calculations.getItemsByType('tax').map(item => (
      _jsxs(motion.div, { 
        initial: animated ? { opacity: 0, x: -10 } : false, 
        animate: { opacity: 1, x: 0 }, 
        transition: { duration: 0.2, delay: ANIMATION_DELAYS.tax }, 
        className: "flex justify-between items-center text-blue-600", 
        children: [
          _jsxs("div", { 
            className: "flex items-center gap-2", 
            children: [
              getItemIcon(item.type), 
              _jsx("span", { className: "text-sm", children: item.label })
            ]
          }), 
          _jsx("span", { 
            className: "font-medium", 
            children: formatPrice(item.amount, currency, locale)
          })
        ]
      }, item.id)
    )),
    calculations.fees > 0 && calculations.getItemsByType('fee').map(item => (
      _jsxs(motion.div, { 
        initial: animated ? { opacity: 0, x: -10 } : false, 
        animate: { opacity: 1, x: 0 }, 
        transition: { duration: 0.2, delay: ANIMATION_DELAYS.fee }, 
        className: "flex justify-between items-center text-orange-600", 
        children: [
          _jsxs("div", { 
            className: "flex items-center gap-2", 
            children: [
              getItemIcon(item.type), 
              _jsx("span", { className: "text-sm", children: item.label })
            ]
          }), 
          _jsx("span", { 
            className: "font-medium", 
            children: formatPrice(item.amount, currency, locale)
          })
        ]
      }, item.id)
    )),
    calculations.extras > 0 && calculations.getItemsByType('extra').map(item => (
      _jsxs(motion.div, { 
        initial: animated ? { opacity: 0, x: -10 } : false, 
        animate: { opacity: 1, x: 0 }, 
        transition: { duration: 0.2, delay: ANIMATION_DELAYS.extra }, 
        className: "flex justify-between items-center text-purple-600", 
        children: [
          _jsxs("div", { 
            className: "flex items-center gap-2", 
            children: [
              getItemIcon(item.type), 
              _jsx("span", { className: "text-sm", children: item.label })
            ]
          }), 
          _jsx("span", { 
            className: "font-medium", 
            children: formatPrice(item.amount, currency, locale)
          })
        ]
      }, item.id)
    )),
    _jsxs(motion.div, { 
      initial: animated ? { opacity: 0, y: 10 } : false, 
      animate: { opacity: 1, y: 0 }, 
      transition: { duration: 0.3, delay: ANIMATION_DELAYS.total }, 
      className: cn('flex justify-between items-center font-bold text-lg pt-3 border-t', highlightTotal && 'text-primary'), 
      children: [
        _jsx("span", { children: "Total" }), 
        _jsx("span", { children: formatPrice(calculations.total, currency, locale) })
      ]
    })
  ]})
);
//# sourceMappingURL=DefaultView.js.map