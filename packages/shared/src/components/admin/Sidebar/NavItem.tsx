"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';

import { cn } from '../../../utils';
import { NavItemProps } from './types';

export const NavItem: React.FC<NavItemProps> = ({
  item,
  isActive = false,
  isCollapsed = false,
  onClick,
  className
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    } else if (item.href) {
      if (item.external) {
        window.open(item.href, '_blank');
      } else {
        window.location.href = item.href;
      }
    }
  };

  return (
    <motion.div
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer',
        'hover:bg-muted/50',
        isActive && 'bg-primary/10 text-primary font-medium',
        isCollapsed && 'justify-center px-2',
        item.isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      {item.icon && (
        <div className={cn(
          'flex-shrink-0 transition-colors',
          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
        )}>
          <item.icon className="w-5 h-5" />
        </div>
      )}

      {/* Content */}
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={cn(
                'text-sm font-medium truncate',
                isActive ? 'text-primary' : 'text-foreground'
              )}>
                {item.label}
              </span>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {item.description}
              </p>
            )}
          </div>

          {/* External Link Indicator */}
          {item.external && (
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          )}

          {/* Chevron for nested items */}
          {item.children && item.children.length > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform" />
          )}
        </>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover border rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {item.label}
          {item.description && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {item.description}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

