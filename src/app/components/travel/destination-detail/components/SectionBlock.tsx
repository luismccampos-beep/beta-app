'use client';

import type { ReactNode, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { fadeInUp, staggerContainer } from '../constants/animations';

export function SectionBlock({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: string[];
}) {
  if (!items.length) return null;
  return (
    <motion.div variants={fadeInUp}>
      <Card className="group border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm hover:border-teal-300/60 dark:hover:border-teal-700/60 hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul
            className="space-y-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {items.map((item) => (
              <motion.li
                key={item}
                variants={fadeInUp}
                className="flex gap-2 text-sm text-gray-700 dark:text-gray-300 before:content-['•'] before:text-teal-500 dark:before:text-teal-400 before:font-bold"
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
