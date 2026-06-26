import type { ReactNode } from 'react';

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse ${className}`}
    />
  );
}

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="relative h-[42vh] min-h-[280px] max-h-[480px] w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <SkeletonCard className="h-32" />
        <SkeletonCard className="h-64" />
        <SkeletonCard className="h-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard className="h-40" />
          <SkeletonCard className="h-40" />
        </div>
      </div>
    </div>
  );
}
