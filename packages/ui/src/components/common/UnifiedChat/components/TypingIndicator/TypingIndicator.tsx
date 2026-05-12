import React from 'react';
import { useTranslations } from 'next-intl'; // 1. Migrated to next-intl

import { cn } from '../../../../../utils/cn';

export const TypingIndicator = React.memo(() => {
  // 1. Initialized useTranslations with the 'chat' namespace
  const t = useTranslations('chat');

  return (
    <div 
      className="flex items-end gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500" 
      role="status" 
      aria-live="polite"
    >
      {/* 2. Avatar with a subtler "breathing" pulse animation */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex-shrink-0 animate-subtle-pulse" />

      <div 
        className={cn(
          "relative flex items-center gap-1.5 px-4 py-3.5",
          // 3. Adjusted background for better visual hierarchy
          "bg-gray-100 dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700/60",
          "rounded-2xl rounded-bl-none shadow-sm"
        )}
      >
        {/* 4. Dots with the improved wave animation */}
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-typing-wave [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-typing-wave [animation-delay:200ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-typing-wave [animation-delay:400ms]" />
        </div>

        {/* 5. Glossy highlight effect with a subtler dark mode variant */}
        <div className="absolute inset-0 rounded-2xl rounded-bl-none bg-gradient-to-b from-white/30 to-transparent dark:from-white/5 pointer-events-none" />
        
        {/* 6. Simplified translation call for screen readers */}
        <span className="sr-only">{t('typing')}</span>
      </div>
    </div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';
