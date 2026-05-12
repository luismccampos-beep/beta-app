import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { cn } from '../../../utils';

const SIZE_CLASSES = {
  sm: { screen: 'h-6 w-6', spinner: 'h-4 w-4' },
  md: { screen: 'h-8 w-8', spinner: 'h-6 w-6' },
  lg: { screen: 'h-12 w-12', spinner: 'h-8 w-8' },
} as const;

type Size = keyof typeof SIZE_CLASSES;

function getSizeClasses(size: Size) {
  switch (size) {
    case 'sm':
      return SIZE_CLASSES.sm;
    case 'lg':
      return SIZE_CLASSES.lg;
    default:
      return SIZE_CLASSES.md;
  }
}

export interface LoadingScreenProps {
  message?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  size?: Size;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Carregando...',
  className,
  icon: Icon = Sparkles,
  size = 'md',
}) => {
  const { screen: iconSize } = getSizeClasses(size);

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center',
        className,
      )}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <Icon className={cn('text-primary', iconSize)} />
        </motion.div>
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

/** @alias */
export default LoadingScreen;

export interface LoadingSpinnerProps {
  className?: string;
  size?: Size;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'md',
  text,
}) => {
  const { spinner: spinnerSize } = getSizeClasses(size);

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
          spinnerSize,
        )}
      />
      {text && (
        <span className="ml-2 text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
};
