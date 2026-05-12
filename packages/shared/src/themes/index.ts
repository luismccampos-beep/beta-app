// shared/src/themes/index.ts

// Export all tokens (values and types from tokens.ts)
export * from './tokens';

// Export only additional types from types.ts (avoid duplicating types already in tokens.ts)
export type {
  Theme,
  Palette,
  SemanticPalette,
  ThemeConfig,
  ThemeOptions,
  SpacingScale,
  Radii,
  Typography,
  Colors,
  Breakpoints,
  Shadows,
  ZIndex,
  Durations,
  Easings,
  ColorPalette,
  ColorScaleValue,
  ColorToken,
  SpacingValue,
  FontSizeValue,
  BreakpointValue,
  ThemeAdapter,
} from './types';

// Export theme creation and utilities
export * from './createTheme';
export * from './presets';
export * from './cssVars';
export * from './adapter';
export * from './themeTypes';
export { THEME_TYPES } from './themeTypes';
export type { ThemeType } from './themeTypes';

// Backward compatibility export (legacy theme shape)
export { theme as legacyTheme } from './theme';
export type { Theme as LegacyTheme } from './theme';
