"use client";

import { useMemo } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@akmleva/ui';

type ThemeToggleState = 'light' | 'dark' | 'system';

interface SharedThemeToggleProps {
  theme?: ThemeToggleState;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onChangeTheme?: (theme: ThemeToggleState) => void;
  t?: (key: string, defaultValue?: string) => string;
}

export default function SharedThemeToggle({
  theme,
  isDark,
  onToggleTheme,
  onChangeTheme,
  t,
}: SharedThemeToggleProps) {
  const resolvedTheme: ThemeToggleState = useMemo(() => {
    if (theme) return theme;
    if (typeof isDark === 'boolean') return isDark ? 'dark' : 'light';
    return 'system';
  }, [theme, isDark]);

  const label = t ? t('theme.toggle', 'Alternar tema') : 'Alternar tema';

  const handleClick = () => {
    if (onToggleTheme) {
      onToggleTheme();
      return;
    }

    if (onChangeTheme) {
      if (resolvedTheme === 'light') {
        onChangeTheme('dark');
      } else {
        onChangeTheme('light');
      }
    }
  };

  const Icon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            onClick={handleClick}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

