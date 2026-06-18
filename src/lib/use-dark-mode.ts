'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme-mode';

/** Returns true if dark mode should be active on initial load. */
function resolveInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Shared hook for dark/light mode with localStorage persistence.
 * Manages the `dark` CSS class on `<html>` via Tailwind's class-based dark mode.
 *
 * Usage (drop-in replacement for the existing per-page pattern):
 *   const { isDark, toggle } = useDarkMode();
 *
 * The hook reads the saved preference on mount, falls back to
 * `prefers-color-scheme`, and persists every change to localStorage.
 */
export function useDarkMode(): { isDark: boolean; toggle: () => void } {
  const [isDark, setIsDark] = useState(resolveInitialDarkMode);

  // Apply the class on mount and whenever isDark changes.
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { isDark, toggle };
}
