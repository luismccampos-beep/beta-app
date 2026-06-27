'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '../../../ui/button';
import { fadeInUp } from '../constants/animations';

export function AttributionFooter({
  wikivoyageUrl,
  license,
  t,
}: {
  wikivoyageUrl?: string;
  license?: string;
  t: (key: string, values?: Record<string, string>) => string;
}) {
  if (!wikivoyageUrl) return null;
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm"
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t('attribution', { license: license ?? 'CC BY-SA 3.0' })}
      </p>
      <Button asChild variant="outline" className="gap-2 min-h-11 shrink-0 touch-manipulation hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
        <a href={wikivoyageUrl} target="_blank" rel="noopener noreferrer">
          {t('viewFullArticle')}
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    </motion.div>
  );
}
