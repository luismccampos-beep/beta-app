import React from 'react';

import { cn } from '../../../utils';

export interface TrustBadgeProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  icon: Icon,
  title,
  description,
  className
}) => (
  <div className={cn('flex items-start gap-3', className)}>
    <div className='rounded-lg bg-primary/10 p-2 shrink-0'>
      <Icon className='h-5 w-5 text-primary' />
    </div>
    <div>
      <h4 className='font-semibold text-sm mb-1'>{title}</h4>
      <p className='text-xs text-muted-foreground'>{description}</p>
    </div>
  </div>
);

/** @alias */
export default TrustBadge;
