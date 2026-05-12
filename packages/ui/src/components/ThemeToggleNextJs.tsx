"use client";

import { Moon } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@akmleva/ui';

interface ThemeToggleProps {
  onToggleTheme?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({
  onToggleTheme,
  className = '',
  size = 'md',
}: ThemeToggleProps) {
  // Simple toggle without theme context dependency
  const handleToggle = () => {
    // Just call the callback - let the app handle the theme logic
    onToggleTheme?.();
  };

  const getIcon = () => {
    // Default to moon icon
    return Moon;
  };

  const getTooltipText = () => {
    return 'Alternar tema';
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };

  const Icon = getIcon();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`${getButtonSize()} ${className}`}
            onClick={handleToggle}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
