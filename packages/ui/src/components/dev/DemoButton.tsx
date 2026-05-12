import React from 'react';
import { Button } from '@akmleva/ui';
import { Shield } from 'lucide-react';

import { cn } from '../../utils/cn';

export interface DemoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  variant?: 'full' | 'compact';
  isLoading?: boolean;
}

export const DemoButton: React.FC<DemoButtonProps> = ({
  label,
  sublabel,
  icon,
  variant = 'full',
  isLoading = false,
  className,
  onClick,
  ...props
}) => {
  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        disabled={isLoading}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        {icon || <Shield className="h-4 w-4" />}
        {label}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
      className={cn('flex items-center justify-center gap-2 w-full h-auto py-2', className)}
      {...props}
    >
      {icon || <Shield className="h-4 w-4" />}
      <div className="text-left flex flex-col">
        <span className="font-medium text-sm leading-none">{label}</span>
        {sublabel && <span className="text-xs opacity-75 mt-1">{sublabel}</span>}
      </div>
    </Button>
  );
};
