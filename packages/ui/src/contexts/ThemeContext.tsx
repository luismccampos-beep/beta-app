'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// ==========================================================================
// Theme Types
// ==========================================================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
}

export interface AgencyTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  cssVariables: Record<string, string>;
}

export interface ThemeContextType {
  theme: ThemeColors;
  agencyTheme: AgencyTheme | null;
  setAgencyTheme: (theme: AgencyTheme) => void;
  applyTheme: (colors: Partial<ThemeColors>) => void;
  resetTheme: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// ==========================================================================
// Default Theme
// ==========================================================================

const defaultTheme: ThemeColors = {
  primary: '59 130 246', // blue-500
  secondary: '16 185 129', // emerald-500
  accent: '245 158 11', // amber-500
  background: '255 255 255', // white
  foreground: '15 23 42', // slate-900
  muted: '241 245 249', // slate-100
  mutedForeground: '71 85 105', // slate-600
  border: '226 232 240', // slate-200
  input: '255 255 255', // white
  ring: '59 130 246', // blue-500
  destructive: '239 68 68', // red-500
  destructiveForeground: '255 255 255', // white
};

const darkTheme: ThemeColors = {
  ...defaultTheme,
  background: '15 23 42', // slate-900
  foreground: '248 250 252', // slate-50
  muted: '30 41 59', // slate-800
  mutedForeground: '148 163 184', // slate-400
  border: '51 65 85', // slate-700
  input: '15 23 42', // slate-900
};

// ==========================================================================
// Utility Functions
// ==========================================================================

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : defaultTheme.primary;
}

function applyCssVariables(colors: ThemeColors) {
  const root = document.documentElement;
  
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });
}

function createAgencyThemeColors(agencyTheme: AgencyTheme): Partial<ThemeColors> {
  return {
    primary: hexToRgb(agencyTheme.primaryColor),
    secondary: hexToRgb(agencyTheme.secondaryColor),
    accent: hexToRgb(agencyTheme.accentColor),
    ring: hexToRgb(agencyTheme.primaryColor),
  };
}

// ==========================================================================
// Theme Context
// ==========================================================================

const ThemeContext = createContext<ThemeContextType | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultAgencyTheme?: AgencyTheme | null;
  enableDarkMode?: boolean;
}

export function ThemeProvider({ 
  children, 
  defaultAgencyTheme = null, 
  enableDarkMode = true 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);
  const [agencyTheme, setAgencyThemeState] = useState<AgencyTheme | null>(defaultAgencyTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ==========================================================================
  // Theme Management
  // ==========================================================================

  const applyTheme = useCallback((colors: Partial<ThemeColors>) => {
    const newTheme = { ...theme, ...colors };
    setTheme(newTheme);
    applyCssVariables(newTheme);
  }, [theme]);

  const resetTheme = useCallback(() => {
    const baseTheme = isDarkMode ? darkTheme : defaultTheme;
    const finalTheme = agencyTheme 
      ? { ...baseTheme, ...createAgencyThemeColors(agencyTheme) }
      : baseTheme;
    
    setTheme(finalTheme);
    applyCssVariables(finalTheme);
  }, [isDarkMode, agencyTheme]);

  const setAgencyTheme = useCallback((newAgencyTheme: AgencyTheme) => {
    setAgencyThemeState(newAgencyTheme);
    
    const baseTheme = isDarkMode ? darkTheme : defaultTheme;
    const agencyColors = createAgencyThemeColors(newAgencyTheme);
    const finalTheme = { ...baseTheme, ...agencyColors };
    
    setTheme(finalTheme);
    applyCssVariables(finalTheme);
    
    // Apply agency-specific CSS variables
    Object.entries(newAgencyTheme.cssVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    const baseTheme = newDarkMode ? darkTheme : defaultTheme;
    const finalTheme = agencyTheme 
      ? { ...baseTheme, ...createAgencyThemeColors(agencyTheme) }
      : baseTheme;
    
    setTheme(finalTheme);
    applyCssVariables(finalTheme);
    
    // Store preference
    localStorage.setItem('theme-mode', newDarkMode ? 'dark' : 'light');
  }, [isDarkMode, agencyTheme]);

  // ==========================================================================
  // Effects
  // ==========================================================================

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme-mode');
    const prefersDark = enableDarkMode && (
      savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    
    setIsDarkMode(prefersDark);
    
    // Check for agency context in cookie (set by middleware)
    const agencyCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('agency_context='));
    
    if (agencyCookie) {
      try {
        const agencyContext = JSON.parse(decodeURIComponent(agencyCookie.split('=')[1]));
        const agencyThemeFromCookie: AgencyTheme = {
          primaryColor: agencyContext.primaryColor || '#3B82F6',
          secondaryColor: agencyContext.secondaryColor || '#10B981',
          accentColor: agencyContext.accentColor || '#F59E0B',
          logoUrl: agencyContext.logoUrl,
          cssVariables: {
            '--agency-primary': agencyContext.primaryColor || '#3B82F6',
            '--agency-secondary': agencyContext.secondaryColor || '#10B981',
            '--agency-accent': agencyContext.accentColor || '#F59E0B',
            '--agency-primary-rgb': hexToRgb(agencyContext.primaryColor || '#3B82F6'),
            '--agency-secondary-rgb': hexToRgb(agencyContext.secondaryColor || '#10B981'),
            '--agency-accent-rgb': hexToRgb(agencyContext.accentColor || '#F59E0B'),
          },
        };
        
        setAgencyTheme(agencyThemeFromCookie);
      } catch (error) {
        console.error('Error parsing agency context cookie:', error);
      }
    } else if (defaultAgencyTheme) {
      setAgencyTheme(defaultAgencyTheme);
    } else {
      // Apply default theme
      const baseTheme = prefersDark ? darkTheme : defaultTheme;
      setTheme(baseTheme);
      applyCssVariables(baseTheme);
    }
  }, [enableDarkMode, defaultAgencyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableDarkMode) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-mode')) {
        // Only auto-change if user hasn't manually set preference
        const newDarkMode = e.matches;
        setIsDarkMode(newDarkMode);
        
        const baseTheme = newDarkMode ? darkTheme : defaultTheme;
        const finalTheme = agencyTheme 
          ? { ...baseTheme, ...createAgencyThemeColors(agencyTheme) }
          : baseTheme;
        
        setTheme(finalTheme);
        applyCssVariables(finalTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableDarkMode, agencyTheme]);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue: ThemeContextType = {
    theme,
    agencyTheme,
    setAgencyTheme,
    applyTheme,
    resetTheme,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// ==========================================================================
// Hook
// ==========================================================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// ==========================================================================
// Utility Hooks
// ==========================================================================

export function useAgencyColors() {
  const { agencyTheme } = useTheme();
  
  if (!agencyTheme) {
    return {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      logo: null,
    };
  }
  
  return {
    primary: agencyTheme.primaryColor,
    secondary: agencyTheme.secondaryColor,
    accent: agencyTheme.accentColor,
    logo: agencyTheme.logoUrl,
  };
}

export function useThemeClasses() {
  const { theme } = useTheme();
  
  return {
    primary: `rgb(${theme.primary})`,
    secondary: `rgb(${theme.secondary})`,
    accent: `rgb(${theme.accent})`,
    background: `rgb(${theme.background})`,
    foreground: `rgb(${theme.foreground})`,
    muted: `rgb(${theme.muted})`,
    mutedForeground: `rgb(${theme.mutedForeground})`,
    border: `rgb(${theme.border})`,
    input: `rgb(${theme.input})`,
    ring: `rgb(${theme.ring})`,
    destructive: `rgb(${theme.destructive})`,
    destructiveForeground: `rgb(${theme.destructiveForeground})`,
  };
}
