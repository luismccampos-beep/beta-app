"use client";

import { motion } from 'framer-motion';
import { Check, Globe, Languages } from 'lucide-react';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export enum LanguageSwitcherSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum LanguageSwitcherVariant {
  GHOST = 'ghost',
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface LanguageSwitcherProps {
  size?: LanguageSwitcherSize;
  showLabel?: boolean;
  variant?: LanguageSwitcherVariant;
  className?: string;
  useGlobeIcon?: boolean;
  onLanguageChange?: (languageCode: string) => void;
  // External UI components to avoid circular dependency
  Button?: React.ComponentType<Record<string, unknown>>;
  DropdownMenu?: React.ComponentType<Record<string, unknown>>;
  DropdownMenuContent?: React.ComponentType<Record<string, unknown>>;
  DropdownMenuItem?: React.ComponentType<Record<string, unknown>>;
  DropdownMenuTrigger?: React.ComponentType<Record<string, unknown>>;
}

const getSupportedLanguages = (): Language[] => {
  return [
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];
};

const getButtonSize = (size: LanguageSwitcherSize) => {
  switch (size) {
    case LanguageSwitcherSize.SMALL:
      return 'sm';
    case LanguageSwitcherSize.LARGE:
      return 'lg';
    default:
      return 'default';
  }
};

const getIconSize = (size: LanguageSwitcherSize) => {
  switch (size) {
    case LanguageSwitcherSize.SMALL:
      return 'h-4 w-4';
    case LanguageSwitcherSize.LARGE:
      return 'h-6 w-6';
    default:
      return 'h-5 w-5';
  }
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  size = LanguageSwitcherSize.MEDIUM,
  showLabel = true,
  variant = LanguageSwitcherVariant.GHOST,
  className = '',
  useGlobeIcon = true,
  onLanguageChange,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
}) => {
  const t = useTranslations('language');
  const locale = useLocale();
  const [isChanging, setIsChanging] = useState(false);

  const supportedLanguages: Language[] = getSupportedLanguages();
  const currentLanguage: Language =
    supportedLanguages.find((lang) => lang.code === locale) || supportedLanguages[0]!;

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === locale || isChanging) return;

    setIsChanging(true);
    try {
      document.cookie = `NEXT_LOCALE=${languageCode}; path=/; max-age=${60 * 60 * 24 * 365}`;

      // Store preference in localStorage
      const globalObj = globalThis as unknown as {
        localStorage?: { setItem?: (key: string, value: string) => void };
      };
      globalObj.localStorage?.setItem?.('preferred-language', languageCode);

      // Call custom callback if provided
      onLanguageChange?.(languageCode);

      globalThis.location?.reload?.();
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const Icon = useGlobeIcon ? Globe : Languages;

  // If UI components are not provided, return a minimal version
  if (!Button || !DropdownMenu || !DropdownMenuContent || !DropdownMenuItem || !DropdownMenuTrigger) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Icon className={getIconSize(size)} />
        {showLabel && (
          <span className='flex items-center gap-1 text-sm font-medium'>
            <span>{currentLanguage.flag}</span>
            <span className='hidden sm:inline'>{currentLanguage.code.toUpperCase()}</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={getButtonSize(size)}
          className={`flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-primary/40 rounded-lg bg-gradient-to-br from-white/30 via-white/10 to-white/5 backdrop-blur-sm ${className}`}
          disabled={isChanging}
          aria-label={t('select') || 'Select language'}
        >
          <Icon className={getIconSize(size)} />
          {showLabel && (
            <span className='flex items-center gap-1 text-sm font-medium'>
              <span>{currentLanguage.flag}</span>
              <span className='hidden sm:inline'>{currentLanguage.code.toUpperCase()}</span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' sideOffset={6}>
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className='bg-gradient-to-tr from-white/30 via-white/10 to-white/5 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden'
        >
          {supportedLanguages.map((language: Language) => {
            const isActive = currentLanguage.code === language.code;
            return (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isChanging}
                aria-checked={isActive}
                className='p-0'
              >
                <motion.div
                  whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center justify-between gap-3 px-4 py-2 cursor-pointer transition-all rounded-lg ${isActive
                      ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 shadow-md font-semibold text-primary'
                      : 'hover:bg-white/10 text-foreground/90'
                    }`}
                >
                  <div className='flex items-center gap-2'>
                    <span className='text-xl'>{language.flag}</span>
                    <span>{language.name}</span>
                  </div>
                  {isActive && <Check className='h-5 w-5 text-primary' />}
                </motion.div>
              </DropdownMenuItem>
            );
          })}
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
