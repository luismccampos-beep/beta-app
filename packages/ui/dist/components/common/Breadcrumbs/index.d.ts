import React from 'react';
export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
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
export declare const Breadcrumbs: React.FC<BreadcrumbsProps>;
/** @alias */
export default Breadcrumbs;
export interface BreadcrumbItemProps extends BreadcrumbItem {
    isLast?: boolean;
    onNavigate?: (href: string, item: BreadcrumbItem) => void;
    onItemClick?: (item: BreadcrumbItem, index: number) => void;
    index?: number;
}
export declare const BreadcrumbItem: React.FC<BreadcrumbItemProps>;
