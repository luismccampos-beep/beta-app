// shared/src/themes/presets.ts
import { colors } from './tokens';
import { createTheme } from './createTheme';

export const lightTheme = createTheme({
  name: 'light',
  palette: {
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#475569',
    border: '#e2e8f0',
    primary: colors.primary[600],
    primaryForeground: '#ffffff',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
  },
});

export const darkTheme = createTheme({
  name: 'dark',
  palette: {
    background: '#0b1020',
    foreground: '#e2e8f0',
    muted: '#111827',
    mutedForeground: '#94a3b8',
    border: '#1f2937',
    primary: colors.primary[500],
    primaryForeground: '#ffffff',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
});
