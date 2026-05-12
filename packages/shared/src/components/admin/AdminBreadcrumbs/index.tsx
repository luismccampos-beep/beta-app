"use client";

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

import { cn } from '../../../utils';

export interface AdminBreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export interface AdminBreadcrumbsProps {
  items: AdminBreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  className?: string;
  maxItems?: number;
}

export const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps> = ({
  items,
  separator = <ChevronRight className="w-4 h-4 text-muted-foreground" />,
  showHome = true,
  homeHref = '/admin',
  className,
  maxItems = 5
}) => {
  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  // Limit items to prevent overflow
  const displayItems = items.length > maxItems
    ? [
      ...items.slice(0, Math.floor(maxItems / 2) - 1),
      { label: '...', isActive: false },
      ...items.slice(-(Math.floor(maxItems / 2)))
    ]
    : items;

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      {/* Home */}
      {showHome && (
        <>
          <button
            onClick={() => handleNavigation(homeHref)}
            className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          {displayItems.length > 0 && separator}
        </>
      )}

      {/* Breadcrumb Items */}
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.label === '...';

        return (
          <React.Fragment key={index}>
            {isEllipsis ? (
              <span className="text-muted-foreground">...</span>
            ) : (
              <button
                onClick={() => item.href && !isLast && handleNavigation(item.href)}
                disabled={!item.href || isLast}
                className={cn(
                  'flex items-center space-x-1 transition-colors',
                  item.isActive || isLast
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                  (!item.href || isLast) && 'cursor-default'
                )}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            )}
            {!isLast && !isEllipsis && separator}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

/** @alias */
export default AdminBreadcrumbs;
