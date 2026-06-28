'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { fadeInUp } from '../travel/destination-detail/constants/animations';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Animation variants. Defaults to fadeInUp (opacity 0→1, y 40→0) */
  variants?: Variants;
  /** Viewport margin. Defaults to '-60px' */
  margin?: string;
  /** HTML element to render. Defaults to 'div' */
  as?: 'div' | 'section' | 'ol' | 'ul';
}

/**
 * A scroll-triggered animation wrapper.
 *
 * - Animates children with the provided variants when they scroll into view.
 * - Automatically respects the user's `prefers-reduced-motion` setting.
 * - Animates only once per mount (`viewport.once = true`).
 *
 * Usage:
 * ```tsx
 * <AnimatedSection className="space-y-4">
 *   <h2>Scroll down to see me</h2>
 * </AnimatedSection>
 * ```
 *
 * With stagger:
 * ```tsx
 * <AnimatedSection as="ul" variants={staggerContainer}>
 *   <motion.li variants={fadeInUp}>Item 1</motion.li>
 *   <motion.li variants={fadeInUp}>Item 2</motion.li>
 * </AnimatedSection>
 * ```
 */
export function AnimatedSection({
  children,
  className,
  variants = fadeInUp,
  margin = '-60px',
  as: Tag = 'div',
  ...rest
}: AnimatedSectionProps & Record<string, unknown>) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <Tag className={className} {...rest}>{children}</Tag>;
  }

  const MotionTag = motion[Tag as keyof typeof motion] as React.ComponentType<{
    variants: Variants;
    initial: string;
    whileInView: string;
    viewport: { once: boolean; margin: string };
    className?: string;
    children: ReactNode;
    [key: string]: unknown;
  }>;

  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
