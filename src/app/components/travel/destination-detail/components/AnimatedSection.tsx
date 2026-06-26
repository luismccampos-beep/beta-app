'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../constants/animations';

export function AnimatedSection({
  children,
  className,
  margin = '-80px',
}: {
  children: ReactNode;
  className?: string;
  margin?: string;
}) {
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
