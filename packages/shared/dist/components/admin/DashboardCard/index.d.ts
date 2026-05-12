import React from 'react';
export interface DashboardCardProps {
    title?: string;
    description?: string;
    icon?: React.ComponentType<{
        className?: string;
    }> | React.ReactElement;
    href?: string;
    color?: 'blue' | 'green' | 'purple' | 'cyan' | 'orange' | 'red' | 'yellow' | 'indigo' | 'rose' | 'emerald';
    value?: string | number;
    change?: string | number;
    trend?: 'up' | 'down' | 'neutral';
    stats?: {
        value: string;
        change: number;
        trend: 'up' | 'down' | 'neutral';
    };
    actions?: {
        label: string;
        href: string;
        variant?: 'default' | 'outline';
    }[];
    className?: string;
    onClick?: () => void;
    [key: string]: unknown;
}
export declare const DashboardCard: React.FC<DashboardCardProps>;
/** @alias */
export default DashboardCard;
