import React from 'react';
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'text' | 'circular' | 'rectangular';
    animation?: 'pulse' | 'wave' | 'none';
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}
declare const Skeleton: React.ForwardRefExoticComponent<SkeletonProps & React.RefAttributes<HTMLDivElement>>;
export interface CardSkeletonProps {
    showAvatar?: boolean;
    showTitle?: boolean;
    showDescription?: boolean;
    lines?: number;
    className?: string;
}
export declare const CardSkeleton: React.FC<CardSkeletonProps>;
export interface ListSkeletonProps {
    items?: number;
    showAvatar?: boolean;
    className?: string;
}
export declare const ListSkeleton: React.FC<ListSkeletonProps>;
export interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    showHeader?: boolean;
    className?: string;
}
export declare const TableSkeleton: React.FC<TableSkeletonProps>;
export { Skeleton };
