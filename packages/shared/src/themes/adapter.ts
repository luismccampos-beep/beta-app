// shared/src/themes/adapter.ts
// Adapta temas antigos (legacy) para o novo tipo Theme e gera CSS vars.
import type { Theme, Palette } from './types';
import { createTheme } from './createTheme';

// Tipo inferido do tema legacy existente em ./theme
type LegacyTheme = typeof import('./theme').theme;

export function adaptLegacyTheme(name: string, legacy: LegacyTheme): Theme {
  // Mapeamento básico do legacy -> Palette moderna
  const palette: Partial<Palette> = {
    primary: legacy.primaryColor,
    primaryForeground: '#ffffff',
    background: '#ffffff',
    foreground: legacy.secondaryColor ?? '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#475569',
    border: '#e2e8f0',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
  };

  return createTheme({ name, palette: palette as Palette });
}
