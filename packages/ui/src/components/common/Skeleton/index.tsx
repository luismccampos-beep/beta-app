import React from 'react';

import { cn } from '../../../utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
  circle?: boolean; // deprecated, use variant="circular"
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', animation = 'pulse', width, height, circle, ...props }, ref) => {
    const finalVariant = circle ? 'circular' : variant;

    const baseClasses = 'bg-muted';

    const getVariantClasses = (value: SkeletonProps['variant'] = 'default') => {
      switch (value) {
        case 'text':
          return 'rounded-sm h-4';
        case 'circular':
          return 'rounded-full';
        case 'rectangular':
          return 'rounded-md';
        default:
          return 'rounded';
      }
    };

    const getAnimationClasses = (value: SkeletonProps['animation'] = 'pulse') => {
      switch (value) {
        case 'wave':
          return 'animate-shimmer bg-gradient-to-r from-transparent via-muted to-transparent bg-[length:200%_100%]';
        case 'none':
          return '';
        default:
          return 'animate-pulse';
      }
    };

    const style = {
      width: width || (finalVariant === 'text' ? '100%' : undefined),
      height: height || (finalVariant === 'text' ? '1rem' : undefined),
      ...props.style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          getVariantClasses(finalVariant),
          getAnimationClasses(animation),
          className
        )}
        style={style}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Card skeleton component
export interface CardSkeletonProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  lines?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showAvatar = true,
  showTitle = true,
  showDescription = true,
  lines = 3,
  className
}) => (
  <div className={cn('rounded-lg border p-4 space-y-3', className)}>
    {showAvatar && (
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2 flex-1">
          {showTitle && <Skeleton width="60%" height={16} />}
        </div>
      </div>
    )}
    
    {showDescription && (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            width={i === lines - 1 ? '80%' : '100%'} 
            height={14} 
          />
        ))}
      </div>
    )}
  </div>
);

// List skeleton component
export interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  showAvatar = true,
  className
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3">
        {showAvatar && <Skeleton variant="circular" width={32} height={32} />}
        <div className="space-y-2 flex-1">
          <Skeleton width="40%" height={14} />
          <Skeleton width="60%" height={12} />
        </div>
      </div>
    ))}
  </div>
);

// Table skeleton component
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className
}) => (
  <div className={cn('space-y-2', className)}>
    {showHeader && (
      <div className="flex space-x-4 p-2 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} width={100} height={20} />
        ))}
      </div>
    )}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex space-x-4 p-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton 
            key={`cell-${rowIndex}-${colIndex}`} 
            width={colIndex === 0 ? 120 : 80} 
            height={16} 
          />
        ))}
      </div>
    ))}
  </div>
);

export { Skeleton };
