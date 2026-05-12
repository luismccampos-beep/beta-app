"use client";

import { Check, Globe, Languages } from 'lucide-react';
import { useState } from 'react';

export enum LanguageSwitcherSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum LanguageSwitcherVariant {
  DEFAULT = 'default',
  GHOST = 'ghost',
  OUTLINE = 'outline',
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
  pathname?: string;
  navigate?: (href: string) => void;
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
  pathname: pathnameProp,
  navigate,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const safePathname = pathnameProp ?? (typeof window !== 'undefined' ? window.location.pathname : '');

  const supportedLanguages: Language[] = getSupportedLanguages();
  
  // Get current language from pathname
  const getCurrentLanguage = (): Language => {
    const segments = safePathname.split('/').filter(Boolean);
    const langCode = segments[0];
    const currentLang = supportedLanguages.find((lang) => lang.code === langCode);
    return currentLang || supportedLanguages[0]!;
  };

  const currentLanguage: Language = getCurrentLanguage();

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage.code || isChanging) return;

    setIsChanging(true);
    try {
      // Store preference in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-language', languageCode);
      }

      // Navigate to new language
      const segments = safePathname.split('/').filter(Boolean);
      if (supportedLanguages.find(lang => lang.code === segments[0])) {
        // Replace existing language
        segments[0] = languageCode;
      } else {
        // Add language to beginning
        segments.unshift(languageCode);
      }
      
      const newPath = '/' + segments.join('/');
      if (navigate) {
        navigate(newPath);
      } else if (typeof window !== 'undefined') {
        window.location.assign(newPath);
      }

      // Call custom callback if provided
      onLanguageChange?.(languageCode);
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
        {showLabel && <span className="text-sm font-medium">{currentLanguage.name}</span>}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={getButtonSize(size)}
          className={`flex items-center gap-2 ${className}`}
          disabled={isChanging}
        >
          <Icon className={getIconSize(size)} />
          {showLabel && (
            <span className="text-sm font-medium">{currentLanguage.name}</span>
          )}
          {currentLanguage.flag && <span>{currentLanguage.flag}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-3 cursor-pointer"
            disabled={isChanging}
          >
            <span>{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {language.code === currentLanguage.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
