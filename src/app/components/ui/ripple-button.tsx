'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { useRipple } from '../../../hooks/useRipple';
import { useMagnetic } from '../../../hooks/useMagnetic';

type RippleButtonProps = React.ComponentProps<typeof Button> & {
  /** Enable magnetic hover effect. Default: true */
  magnetic?: boolean;
  /** Magnetic pull distance in px. Default: 4 */
  magneticDistance?: number;
};

/**
 * A Button wrapper that adds a ripple effect on click and an optional
 * magnetic hover effect. Passes all Button props through.
 *
 * @example
 * <RippleButton onClick={handleClick} variant="brand" size="lg">
 *   Get Started
 * </RippleButton>
 */
export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ magnetic = true, magneticDistance = 4, onClick, className = '', children, ...props }, ref) => {
    const handleRipple = useRipple();
    const magnet = useMagnetic({ maxDistance: magneticDistance, stiffness: 250, damping: 15 });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      handleRipple(e);
      onClick?.(e);
    };

    const content = (
      <Button
        ref={ref}
        onClick={handleClick}
        className={`ripple ${className}`}
        {...props}
      >
        {children}
      </Button>
    );

    if (magnetic) {
      return (
        <div ref={magnet.ref}>
          <motion.div style={{ x: magnet.x, y: magnet.y }}>
            {content}
          </motion.div>
        </div>
      );
    }

    return content;
  },
);

RippleButton.displayName = 'RippleButton';
