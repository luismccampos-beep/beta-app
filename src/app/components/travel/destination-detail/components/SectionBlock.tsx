'use client';

import type { ReactNode, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { fadeInUp, staggerContainer } from '../constants/animations';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export function SectionBlock({
  title,
  icon: Icon,
  items = [],
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  items?: string[];
}) {
  const prefersReduced = useReducedMotion();

  if (!items.length) return null;

  if (prefersReduced) {
    return (
      <Card className="card-premium dark:bg-gray-900 group">
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-950 dark:text-white uppercase tracking-tighter">
            <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-primary-300">
              <Icon className="h-5 w-5" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">
          <ul className="space-y-2.5">
            {items.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-base font-medium text-gray-700 dark:text-gray-300 before:content-['•'] before:text-orange before:font-black"
              >
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div variants={fadeInUp}>
      <Card className="card-premium dark:bg-gray-900 group">
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-950 dark:text-white uppercase tracking-tighter">
            <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-primary-300 group-hover:scale-110 transition-transform">
              <Icon className="h-5 w-5" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">
          <motion.ul
            className="space-y-2.5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {items.map((item) => (
              <motion.li
                key={item}
                variants={fadeInUp}
                className="flex gap-2.5 text-base font-medium text-gray-700 dark:text-gray-300 before:content-['•'] before:text-orange before:font-black"
              >
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
