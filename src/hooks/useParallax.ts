'use client';

import { useRef } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';

interface UseParallaxOptions {
  /** Speed multiplier: 0 = no movement, 1 = moves with scroll, -1 = opposite direction */
  speed?: number;
  /** Offset range [start, end] as fraction of viewport (0 to 1) */
  offset?: [number, number];
  /** Optional shared container ref for scroll tracking. When omitted, a new ref is created. */
  containerRef?: React.RefObject<HTMLElement | null>;
}

interface UseParallaxResult {
  /** The ref to attach to the scroll container. Only set when containerRef is NOT provided. */
  ref: React.RefObject<HTMLElement> | null;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}

/**
 * Creates a parallax scroll effect on an element.
 * Returns transformed motion values. The ref should be attached to the scroll container.
 *
 * When `containerRef` is provided, multiple instances share the same scroll target,
 * each deriving different speed-based transforms. The returned `ref` will be null.
 *
 * @example
 * const sectionRef = useRef<HTMLElement>(null);
 * const hero = useParallax({ speed: 0.3, containerRef: sectionRef });
 * const orb = useParallax({ speed: -0.4, containerRef: sectionRef });
 * <section ref={sectionRef}>
 *   <motion.div style={{ y: hero.y }}>...</motion.div>
 *   <motion.div style={{ y: orb.y }}>...</motion.div>
 * </section>
 */
export function useParallax(
  options: UseParallaxOptions = {},
): UseParallaxResult {
  const { speed = 0.5, offset = [0, 1], containerRef } = options;

  const ownRef = useRef<HTMLElement>(null!);
  const targetRef = containerRef ?? ownRef;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: [`start ${offset[0] * 100}%`, `end ${offset[1] * 100}%`],
  });

  const range = speed > 0 ? [-100 * speed, 100 * speed] : [100 * Math.abs(speed), -100 * Math.abs(speed)];

  const y = useTransform(scrollYProgress, [0, 1], range);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

  return {
    ref: containerRef ? null : ownRef,
    y,
    scale,
    opacity,
  };
}
