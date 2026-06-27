'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../constants/animations';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export function AnimatedSection({
  children,
  className,
  margin = '-80px',
}: {
  children: ReactNode;
  className?: string;
  margin?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
