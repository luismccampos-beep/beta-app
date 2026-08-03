'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/travel/animations';

interface SkeletonCardProps {
  /** Show image skeleton (aspect-video) */
  image?: boolean;
  /** Number of text lines to show */
  lines?: number;
  /** Show badge rows */
  badges?: number;
  /** Show price + CTA bar */
  priceBar?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Reusable skeleton card with consistent shimmer animation across the app.
 * Used in results, destinations, dashboard, and other loading states.
 */
export function SkeletonCard({
  image = true,
  lines = 3,
  badges = 0,
  priceBar = true,
  className = '',
}: SkeletonCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden relative ${className}`}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite] pointer-events-none z-10" />

      {image && (
        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
      )}

      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>

        {badges > 0 && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: badges }).map((_, i) => (
              <div
                key={i}
                className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full"
                style={{ width: `${60 + (i * 17) % 40}px` }}
              />
            ))}
          </div>
        )}

        {/* Text lines */}
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={`line-${i}`}
            className="h-3 bg-gray-200 dark:bg-gray-700 rounded"
            style={{ width: i === lines - 1 ? `${55 + (i * 12) % 30}%` : '100%' }}
          />
        ))}

        {priceBar && (
          <div className="flex items-center justify-between pt-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
          </div>
        )}
      </div>
    </motion.div>
  );
}