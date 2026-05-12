// shared/src/themes/themeUtils.ts
import { breakpoints, colors, durations, easings, radii, semanticColors, shadows, spacing, typography, zIndex } from './tokens';
import type { ColorPalette, Theme, ThemeConfig, ThemeOptions } from './types';

// Default palette values
const defaultPalette = {
  background: '#ffffff',
  foreground: '#000000',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  border: '#e5e7eb',
  primary: colors.primary,
  primaryForeground: '#ffffff',
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
};

/**
 * Helper to get theme property with fallback chain
 */
function getThemeValue<T>(configValue: T | undefined, baseValue: T | undefined, defaultValue: T): T {
  return configValue || baseValue || defaultValue;
}

/**
 * Cria um tema completo a partir de configuração parcial
 */
export function createTheme(config: ThemeConfig, options: ThemeOptions = {}): Theme {
  const { extends: baseTheme, mode = 'light', generateSemantic = true } = options;

  const theme: Theme = {
    name: config.name,
    mode,
    palette: {
      ...defaultPalette,
      ...baseTheme?.palette,
      ...config.palette,
    },
    spacing: getThemeValue(config.spacing, baseTheme?.spacing, spacing),
    radii: getThemeValue(config.radii, baseTheme?.radii, radii),
    typography: getThemeValue(config.typography, baseTheme?.typography, typography),
    breakpoints: getThemeValue(config.breakpoints, baseTheme?.breakpoints, breakpoints),
    shadows: getThemeValue(config.shadows, baseTheme?.shadows, shadows),
    zIndex: getThemeValue(config.zIndex, baseTheme?.zIndex, zIndex),
    durations: getThemeValue(config.durations, baseTheme?.durations, durations),
    easings: getThemeValue(config.easings, baseTheme?.easings, easings),
    colors,
  };

  if (generateSemantic) {
    theme.semantic = semanticColors;
  }

  return theme;
}

/**
 * Verifica se um valor é uma paleta de cores com escala
 */
export function isColorPalette(value: unknown): value is ColorPalette {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return '500' in obj && typeof obj['500'] === 'string';
}

/**
 * Extrai cor base de uma paleta (pega o 500)
 */
export function getBaseColor(color: string | ColorPalette): string {
  return isColorPalette(color) ? color[500] : color;
}

/**
 * Inverte modo do tema (light <-> dark)
 */
export function invertThemeMode(theme: Theme): Theme {
  const newMode = theme.mode === 'dark' ? 'light' : 'dark';
  return {
    ...theme,
    mode: newMode,
    name: `${theme.name}-${newMode}`,
  };
}

/**
 * Mescla dois temas (theme2 sobrescreve theme1)
 */
export function mergeThemes(theme1: Theme, theme2: Partial<Theme>): Theme {
  return createTheme(
    {
      name: theme2.name || theme1.name,
      palette: { ...theme1.palette, ...theme2.palette },
      spacing: theme2.spacing || theme1.spacing,
      radii: theme2.radii || theme1.radii,
      typography: theme2.typography || theme1.typography,
    },
    { extends: theme1 }
  );
}