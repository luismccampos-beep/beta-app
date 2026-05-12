import React from 'react';
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
export declare const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps>;
/** @alias */
export default AdminBreadcrumbs;
