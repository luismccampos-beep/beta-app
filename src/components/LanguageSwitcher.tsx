'use client';

import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';

// ── Supported languages ────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
] as const;

// ── Props ──────────────────────────────────────────────────────────────────────

export type LanguageSwitcherVariant = 'default' | 'overlay';

export interface LanguageSwitcherProps {
  /** Visual variant:
   *  - 'default': bordered container with flag buttons, suitable for headers
   *  - 'overlay': glass-morphism background, larger flags, suited for hero overlays */
  variant?: LanguageSwitcherVariant;
  /** Show the Languages icon next to the buttons (default: true for 'default' variant) */
  showIcon?: boolean;
  /** Show language name labels instead of flag emojis */
  showLabels?: boolean;
  /** Extra CSS classes for the outer wrapper */
  className?: string;
  /** Called after locale cookie is set, before reload. If omitted, uses window.location.reload() */
  onLocaleChange?: (locale: string) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function LanguageSwitcher({
  variant = 'default',
  showIcon = true,
  showLabels = false,
  className = '',
  onLocaleChange,
}: LanguageSwitcherProps) {
  const locale = useLocale();

  const setLocale = (nextLocale: string) => {
    if (nextLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    if (onLocaleChange) {
      onLocaleChange(nextLocale);
    } else {
      window.location.reload();
    }
  };

  const isOverlay = variant === 'overlay';

  const buttons = (
    <>
      {LANGUAGES.map((lang) => (
        <motion.button
          key={lang.code}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => setLocale(lang.code)}
          title={lang.name}
          aria-label={lang.name}
          className={
            isOverlay
              ? `px-2 sm:px-2.5 py-1.5 sm:py-2 text-lg sm:text-xl leading-none rounded-lg transition-all shrink-0
                ${locale === lang.code
                  ? 'bg-gradient-to-br from-teal-500 to-orange-500 text-white shadow-md scale-105 ring-2 ring-white/40 dark:ring-white/30'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                }`
              : `px-2 sm:px-2.5 py-1 sm:py-1.5 text-sm sm:text-base leading-none rounded-md transition-all shrink-0 font-medium
                ${locale === lang.code
                  ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-md scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                }`
          }
        >
          {showLabels ? lang.name : lang.flag}
        </motion.button>
      ))}
    </>
  );

  // ── Overlay variant (glass bg, no icon, larger) ──────────────────────
  if (isOverlay) {
    return (
      <div className={`flex rounded-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-1 shadow-lg ${className}`}>
        {buttons}
      </div>
    );
  }

  // ── Default variant (border, optional icon) ──────────────────────────
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <Languages className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 hidden sm:block" />
      )}
      <div className="inline-flex rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-0.5 shadow-sm">
        {buttons}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
