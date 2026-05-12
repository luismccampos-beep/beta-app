"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { NavigationError, reportError } from '../../../logger';
import { cn } from '../../../utils';
import { sanitizeHref, sanitizeText } from '../../../utils/sanitize';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: BreadcrumbItem[];
  ariaLabel?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  className?: string;
  ariaLabel?: string;
  onNavigate?: (href: string, item: BreadcrumbItem) => void;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  maxItems?: number;
  maxItemsMobile?: number;
  usePathFallback?: boolean;
  pathname?: string;
  segmentLabels?: Record<string, string>;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  homeHref = '/',
  className,
  ariaLabel,
  onNavigate,
  onItemClick,
  maxItems = 6,
  maxItemsMobile = 3,
  usePathFallback = true,
  pathname: pathnameProp,
  segmentLabels,
}) => {
  const router = useRouter();
  const pathFromRouter = usePathname();
  const pathname = pathnameProp ?? pathFromRouter ?? (typeof window !== 'undefined' ? window.location.pathname : undefined);
  const [isMobile, setIsMobile] = useState(false);
  type DisplayItem = BreadcrumbItem & { isLast?: boolean; isEllipsis?: boolean };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(max-width: 640px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    setIsMobile(media.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const normalizedItems = useMemo(() => {
    const flatten = (source: BreadcrumbItem[] = []): BreadcrumbItem[] => {
      return source.flatMap((item) => {
        const { children, ...rest } = item;
        const current = { ...rest } as BreadcrumbItem;
        const nested = children ? flatten(children) : [];
        return [current, ...nested];
      });
    };

    const fromPath = (): BreadcrumbItem[] => {
      if (!pathname) return [];
      const segments = pathname.split('/').filter(Boolean);
      let acc = '';
      return segments.map((segment) => {
        acc += `/${segment}`;
        const mappedLabel = segmentLabels
          ? Object.entries(segmentLabels).find(([key]) => key === segment)?.[1]
          : undefined;
        const decoded = decodeURIComponent(segment);
        const baseLabel = mappedLabel ?? decoded.replace(/[-_]/g, ' ');
        const label = sanitizeText(baseLabel, { maxLength: 48 }) || decoded;
        return { label, href: acc };
      });
    };

    const sourceItems = items && items.length > 0 ? flatten(items) : usePathFallback ? fromPath() : [];
    return sourceItems.map((item) => {
      const { href, ...rest } = item;
      const safeHref = sanitizeHref(href);
      const nextItem: BreadcrumbItem = {
        ...rest,
        label: sanitizeText(item.label, { maxLength: 48 }),
      };
      if (safeHref) {
        nextItem.href = safeHref;
      }
      return nextItem;
    });
  }, [items, pathname, segmentLabels, usePathFallback]);

  const resolvedHomeHref = sanitizeHref(homeHref) || '/';
  const hasHomeAlready = normalizedItems[0]?.href === resolvedHomeHref;
  const allItems = showHome && !hasHomeAlready
    ? [{ label: 'Home', href: resolvedHomeHref, icon: Home }, ...normalizedItems]
    : normalizedItems;

  const displayItems = useMemo<DisplayItem[]>(() => {
    if (allItems.length <= (isMobile ? maxItemsMobile : maxItems)) {
      return allItems.map((item, index) => ({ ...item, isLast: index === allItems.length - 1 }));
    }
    const limit = isMobile ? maxItemsMobile : maxItems;
    const headCount = 1;
    const tailCount = Math.max(1, limit - headCount - 1);
    const head = allItems.slice(0, headCount);
    const tail = allItems.slice(allItems.length - tailCount);
    const merged: DisplayItem[] = [
      ...head,
      { label: '…', ariaLabel: 'Collapsed breadcrumbs' },
      ...tail,
    ];
    return merged.map((item, index) => ({ ...item, isLast: index === merged.length - 1, isEllipsis: item.label === '…' }));
  }, [allItems, isMobile, maxItems, maxItemsMobile]);

  const handleNavigate = (item: BreadcrumbItem, index: number) => {
    if (!item.href) return;
    try {
      onItemClick?.(item, index);
      if (onNavigate) {
        onNavigate(item.href, item);
      } else {
        if (router?.push) {
          router.push(item.href);
        } else if (typeof window !== 'undefined') {
          window.location.assign(item.href);
        }
      }
    } catch {
      reportError(new NavigationError('Breadcrumb navigation failed', { href: item.href, index, label: item.label }), {
        tags: { component: 'Breadcrumbs' },
      });
    }
  };

  return (
    <nav
      aria-label={ariaLabel || 'Breadcrumb'}
      className={cn('mb-6', className)}
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {displayItems.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
            {item.isEllipsis ? (
              <span className="text-muted-foreground" aria-label={item.ariaLabel || 'Collapsed breadcrumbs'}>
                {item.label}
              </span>
            ) : item.href && !item.isLast ? (
              <button
                type="button"
                onClick={() => handleNavigate(item, index)}
                className="hover:text-foreground transition-colors flex items-center gap-1 max-w-[160px] truncate"
                aria-label={item.ariaLabel || item.label}
              >
                {item.icon && <item.icon className="h-4 w-4" aria-hidden="true" />}
                {item.label}
              </button>
            ) : (
              <span
                className="text-foreground font-medium flex items-center gap-1 max-w-[160px] truncate"
                aria-current={item.isLast ? 'page' : undefined}
                aria-label={item.ariaLabel || item.label}
              >
                {item.icon && <item.icon className="h-4 w-4" aria-hidden="true" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/** @alias */
export default Breadcrumbs;

export interface BreadcrumbItemProps extends BreadcrumbItem {
  isLast?: boolean;
  onNavigate?: (href: string, item: BreadcrumbItem) => void;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  index?: number;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  label,
  href,
  icon: Icon,
  isLast = false,
  onNavigate,
  onItemClick,
  index = 0,
  ariaLabel,
}) => {
  const safeLabel = sanitizeText(label, { maxLength: 48 });
  const safeHref = sanitizeHref(href);

  if (safeHref && !isLast) {
    return (
      <button
        type="button"
        onClick={() => {
          try {
            const payload: BreadcrumbItem = { label: safeLabel, href: safeHref };
            if (Icon) {
              payload.icon = Icon;
            }
            onItemClick?.(payload, index);
            if (onNavigate) {
              onNavigate(safeHref, payload);
            } else {
              if (typeof window !== 'undefined') {
                window.location.assign(safeHref);
              }
            }
          } catch {
            reportError(new NavigationError('Breadcrumb item navigation failed', { href: safeHref, index, label: safeLabel }), {
              tags: { component: 'BreadcrumbItem' },
            });
          }
        }}
        className='hover:text-foreground transition-colors flex items-center gap-1'
        aria-label={ariaLabel || safeLabel}
      >
        {Icon && <Icon className='h-4 w-4' aria-hidden="true" />}
        {safeLabel}
      </button>
    );
  }

  return (
    <span className='text-foreground font-medium flex items-center gap-1' aria-current={isLast ? 'page' : undefined}>
      {Icon && <Icon className='h-4 w-4' aria-hidden="true" />}
      {safeLabel}
    </span>
  );
};
