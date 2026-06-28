'use client';

import { useCallback, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';

interface UseMagneticOptions {
  /** Maximum distance the element moves toward the cursor (px) */
  maxDistance?: number;
  /** Spring stiffness */
  stiffness?: number;
  /** Spring damping */
  damping?: number;
}

interface UseMagneticResult {
  ref: React.RefCallback<HTMLElement>;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * Creates a magnetic hover effect where an element is attracted to the cursor.
 * Attach the ref to the element and apply x/y motion values.
 *
 * @example
 * const { ref, x, y } = useMagnetic({ maxDistance: 8 });
 * <motion.div ref={ref} style={{ x, y }}>
 *   <Button>Click me</Button>
 * </motion.div>
 */
export function useMagnetic(options: UseMagneticOptions = {}): UseMagneticResult {
  const { maxDistance = 6, stiffness = 300, damping = 15 } = options;

  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);

  const springX = useSpring(motionX, { stiffness, damping });
  const springY = useSpring(motionY, { stiffness, damping });

  const elementRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.3;
      const deltaY = (e.clientY - centerY) * 0.3;

      const clampedX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
      const clampedY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));

      motionX.set(clampedX);
      motionY.set(clampedY);
    },
    [maxDistance, motionX, motionY],
  );

  const handleMouseLeave = useCallback(() => {
    motionX.set(0);
    motionY.set(0);
  }, [motionX, motionY]);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('mousemove', handleMouseMove);
        elementRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }

      elementRef.current = node;

      if (node) {
        node.addEventListener('mousemove', handleMouseMove);
        node.addEventListener('mouseleave', handleMouseLeave);
      }
    },
    [handleMouseMove, handleMouseLeave],
  );

  return { ref, x: springX, y: springY };
}
