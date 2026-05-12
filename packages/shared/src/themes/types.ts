/// <reference lib="dom" />
// shared/src/themes/types.ts

import type {
  spacing,
  radii,
  typography,
  colors,
  breakpoints,
  shadows,
  zIndex,
  durations,
  easings,
  ColorScale,
  SpacingKey,
  RadiiKey,
  FontSizeKey,
  FontWeightKey,
  LineHeightKey,
  BreakpointKey,
  ShadowKey,
  ZIndexKey,
  DurationKey,
  EasingKey,
} from './tokens.js';

// ============================================================================
// BASE SYSTEM TYPES
// ============================================================================

/**
 * Spacing scale system
 * Provides consistent spacing values throughout the application
 */
export type SpacingScale = typeof spacing;

/**
 * Border radius system
 * Defines corner rounding values for UI elements
 */
export type Radii = typeof radii;

/**
 * Complete typography system
 * Includes font sizes, weights, line heights, and font families
 */
export type Typography = typeof typography;

/**
 * Complete color system
 * Comprehensive color palette with semantic naming
 */
export type Colors = typeof colors;

/**
 * Responsive breakpoints
 * Screen size breakpoints for responsive design
 */
export type Breakpoints = typeof breakpoints;

/**
 * Shadow system
 * Elevation shadows for depth perception
 */
export type Shadows = typeof shadows;

/**
 * Z-index hierarchy
 * Stacking order for layered UI elements
 */
export type ZIndex = typeof zIndex;

/**
 * Animation durations
 * Standardized timing values for transitions and animations
 */
export type Durations = typeof durations;

/**
 * Easing functions
 * Motion curves for smooth animations
 */
export type Easings = typeof easings;

// ============================================================================
// COLOR PALETTE TYPES
// ============================================================================

/**
 * Numeric color scale from 50 (lightest) to 900 (darkest)
 * Follows Material Design and Tailwind CSS conventions
 * 
 * Scale guide:
 * - 50-100: Very light shades (backgrounds, hover states)
 * - 200-400: Light to medium shades (borders, disabled states)
 * - 500: Base/default color
 * - 600-700: Dark shades (hover, active states)
 * - 800-900: Very dark shades (text on light backgrounds)
 */
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

/**
 * Main theme color palette
 * Supports both direct color strings and scaled color objects
 * 
 * @example
 * ```typescript
 * const palette: Palette = {
 *   background: '#ffffff',
 *   foreground: '#000000',
 *   primary: {
 *     50: '#eff6ff',
 *     500: '#3b82f6',
 *     900: '#1e3a8a'
 *   },
 *   success: '#10b981'
 * };
 * ```
 */
export interface Palette {
  // Base colors
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;

  // Primary and secondary colors (can be string or ColorPalette)
  primary: string | ColorPalette;
  primaryForeground: string;
  secondary?: string | ColorPalette;
  secondaryForeground?: string;

  // State colors
  success: string | ColorPalette;
  successForeground?: string;
  warning: string | ColorPalette;
  warningForeground?: string;
  danger: string | ColorPalette;
  dangerForeground?: string;
  info?: string | ColorPalette;
  infoForeground?: string;

  // Additional colors
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  destructiveForeground?: string;

  // Grayscale
  gray?: ColorPalette;
}

/**
 * Semantic color palette for specific UI contexts
 * Provides consistent color semantics across the application
 * 
 * @example
 * ```typescript
 * const semantic: SemanticPalette = {
 *   text: {
 *     primary: '#000000',
 *     secondary: '#666666',
 *     disabled: '#cccccc'
 *   },
 *   status: {
 *     success: '#10b981',
 *     danger: '#ef4444'
 *   }
 * };
 * ```
 */
export interface SemanticPalette {
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: {
    default: string;
    hover: string;
    focus: string;
  };
  action: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    disabled: string;
  };
  status: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
}

// ============================================================================
// THEME TYPE
// ============================================================================

/**
 * Complete theme structure
 * Contains all design tokens and systems for consistent UI styling
 * 
 * @example
 * ```typescript
 * const theme: Theme = {
 *   name: 'light',
 *   mode: 'light',
 *   palette: { ... },
 *   spacing: { ... },
 *   typography: { ... }
 * };
 * ```
 */
export interface Theme {
  /** Theme identifier name */
  name: string;

  /** Theme mode (light/dark) */
  mode?: 'light' | 'dark';

  /** Main color palette */
  palette: Palette;

  /** Semantic color palette (optional) */
  semantic?: SemanticPalette;

  /** Spacing system */
  spacing: SpacingScale;

  /** Border radius system */
  radii: Radii;

  /** Typography system */
  typography: Typography;

  /** Responsive breakpoints */
  breakpoints: Breakpoints;

  /** Shadow system */
  shadows: Shadows;

  /** Z-index hierarchy */
  zIndex: ZIndex;

  /** Animation durations */
  durations: Durations;

  /** Easing functions */
  easings: Easings;

  /** Complete color system (optional, for direct access) */
  colors?: Colors;
}

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

/**
 * Partial theme configuration for extending or creating new themes
 * Allows selective override of theme properties
 */
export type ThemeConfig = Partial<Theme> & {
  name: string;
  palette: Partial<Palette>;
};

/**
 * Options for theme creation and customization
 */
export interface ThemeOptions {
  /** Base theme to extend */
  extends?: Theme;
  /** Theme mode */
  mode?: 'light' | 'dark';
  /** Whether to auto-generate semantic palette */
  generateSemantic?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract color scale values from ColorPalette
 * Returns the numeric keys (50, 100, 200, etc.)
 */
export type ColorScaleValue<T> = T extends ColorPalette ? keyof T : never;

/**
 * Complete color token reference (group.scale)
 * Enables type-safe color references like "primary.500" or "success.700"
 * 
 * @example
 * ```typescript
 * const color: ColorToken = "primary.500"; // ✓ Valid
 * const invalid: ColorToken = "primary.1000"; // ✗ Type error
 * ```
 */
export type ColorToken<T extends keyof Colors = keyof Colors> = T extends keyof Colors
  ? Colors[T] extends ColorPalette
    ? `${T & string}.${keyof ColorPalette & string}`
    : T
  : never;

/**
 * Spacing value - can be a predefined key or custom string
 * Allows autocomplete for keys while accepting custom values
 * 
 * @example
 * ```typescript
 * const spacing1: SpacingValue = "4"; // Predefined
 * const spacing2: SpacingValue = "2.5rem"; // Custom
 * ```
 */
export type SpacingValue = SpacingKey | (string & Record<never, never>);

/**
 * Font size value - can be a predefined key or custom string
 */
export type FontSizeValue = FontSizeKey | (string & Record<never, never>);

/**
 * Breakpoint value - can be a predefined key or custom string
 */
export type BreakpointValue = BreakpointKey | (string & Record<never, never>);

// ============================================================================
// THEME MODE
// ============================================================================

/**
 * Theme mode options
 * - light: Light color scheme
 * - dark: Dark color scheme
 * - system: Follow system preference
 */
export type ThemeMode = 'light' | 'dark' | 'system';

// ============================================================================
// THEME ADAPTER
// ============================================================================

/**
 * Adapter function for transforming external theme formats
 * Converts theme structures from other design systems into the canonical Theme format
 *
 * @template TFrom - Input theme format (defaults to unknown for type safety)
 * @template TTo - Output theme format (defaults to Theme)
 *
 * @param source - Source theme in external format
 * @param name - Name for the adapted theme
 * @returns Theme in canonical format
 *
 * @example
 * ```typescript
 * // Adapt Material-UI theme to canonical format
 * const muiAdapter: ThemeAdapter<MuiTheme> = (source, name) => ({
 *   name,
 *   mode: source.palette.mode,
 *   palette: {
 *     background: source.palette.background.default,
 *     foreground: source.palette.text.primary,
 *     primary: source.palette.primary.main,
 *     primaryForeground: source.palette.primary.contrastText,
 *   },
 *   spacing: source.spacing,
 *   // ... map other systems
 * });
 * 
 * const theme = muiAdapter(muiTheme, 'mui-light');
 * ```
 */
export type ThemeAdapter<TFrom = unknown, TTo extends Theme = Theme> = (
  source: TFrom,
  name: string
) => TTo;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if value is a valid ColorPalette
 * Validates presence of all required scale values (50-900)
 * 
 * @param value - Value to check
 * @returns True if value is a valid ColorPalette
 * 
 * @example
 * ```typescript
 * if (isColorPalette(color)) {
 *   // TypeScript knows color has properties 50-900
 *   const base = color[500];
 * }
 * ```
 */
export function isColorPalette(value: unknown): value is ColorPalette {
  if (!value || typeof value !== 'object') return false;

  const palette = value as Record<string, unknown>;
  const requiredKeys = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

  return requiredKeys.every((key) => {
    // eslint-disable-next-line security/detect-object-injection
    return typeof palette[key] === 'string';
  });
}

/**
 * Type guard to check if value is a valid Palette
 * Validates presence of all required color properties
 * 
 * @param value - Value to check
 * @returns True if value is a valid Palette
 */
export function isPalette(value: unknown): value is Palette {
  if (!value || typeof value !== 'object') return false;

  const palette = value as Record<string, unknown>;
  const requiredKeys = [
    'background',
    'foreground',
    'muted',
    'mutedForeground',
    'border',
    'primary',
    'primaryForeground',
  ];

  return requiredKeys.every((key) => {
    // eslint-disable-next-line security/detect-object-injection
    return palette[key] !== undefined;
  });
}

/**
 * Type guard to check if value is a valid Theme
 * Validates presence of all required theme properties
 * 
 * @param value - Value to check
 * @returns True if value is a valid Theme
 */
export function isTheme(value: unknown): value is Theme {
  if (!value || typeof value !== 'object') return false;

  const theme = value as Record<string, unknown>;

  return (
    typeof theme.name === 'string' &&
    isPalette(theme.palette) &&
    typeof theme.spacing === 'object' &&
    typeof theme.radii === 'object' &&
    typeof theme.typography === 'object'
  );
}

/**
 * Type guard to check if value is a valid ThemeConfig
 * Validates minimum required properties for theme configuration
 * 
 * @param value - Value to check
 * @returns True if value is a valid ThemeConfig
 */
export function isThemeConfig(value: unknown): value is ThemeConfig {
  if (!value || typeof value !== 'object') return false;

  const config = value as Record<string, unknown>;

  return typeof config.name === 'string' && typeof config.palette === 'object';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get color value from palette, supporting both direct colors and scaled palettes
 *
 * @param color - Color value (string or ColorPalette)
 * @param scale - Scale value for ColorPalette (defaults to 500)
 * @returns Color string
 *
 * @example
 * ```typescript
 * const color1 = getColorValue("#000000"); // "#000000"
 * const color2 = getColorValue(colorPalette, 600); // colorPalette[600]
 * const color3 = getColorValue(colorPalette); // colorPalette[500] (default)
 * ```
 */
export function getColorValue(
  color: string | ColorPalette,
  scale: keyof ColorPalette = 500
): string {
  if (typeof color === 'string') {
    return color;
  }
  // eslint-disable-next-line security/detect-object-injection
  return color[scale];
}

/**
 * Check if a color is a scaled palette
 * Type guard to distinguish between string colors and ColorPalette objects
 * 
 * @param color - Color to check
 * @returns True if color is a ColorPalette
 */
export function isScaledColor(color: string | ColorPalette): color is ColorPalette {
  return typeof color === 'object' && isColorPalette(color);
}

/**
 * Extract base color from palette (typically the 500 shade)
 * Convenient helper to get the primary/default color from a palette
 * 
 * @param color - Color value (string or ColorPalette)
 * @returns Base color string
 */
export function getBaseColor(color: string | ColorPalette): string {
  return getColorValue(color, 500);
}

/**
 * Get lighter shade from color palette
 * Returns a lighter variant of the color for hover states, backgrounds, etc.
 * 
 * @param color - Color value
 * @param intensity - How much lighter (1-5, default 1)
 * @returns Lighter color string
 */
export function getLighterShade(
  color: string | ColorPalette,
  intensity: 1 | 2 | 3 | 4 | 5 = 1
): string {
  if (typeof color === 'string') return color;
  
  const shadeMap: Record<number, keyof ColorPalette> = {
    1: 400,
    2: 300,
    3: 200,
    4: 100,
    5: 50,
  };
  
   
  // Safe: intensity is constrained to keys of shadeMap object
  // eslint-disable-next-line security/detect-object-injection
  return getColorValue(color, shadeMap[intensity]);
}

/**
 * Get darker shade from color palette
 * Returns a darker variant of the color for active states, text, etc.
 * 
 * @param color - Color value
 * @param intensity - How much darker (1-4, default 1)
 * @returns Darker color string
 */
export function getDarkerShade(
  color: string | ColorPalette,
  intensity: 1 | 2 | 3 | 4 = 1
): string {
  if (typeof color === 'string') return color;
  
  const shadeMap: Record<number, keyof ColorPalette> = {
    1: 600,
    2: 700,
    3: 800,
    4: 900,
  };
  
   
  // Safe: intensity is constrained to keys of shadeMap object
  // eslint-disable-next-line security/detect-object-injection
  return getColorValue(color, shadeMap[intensity]);
}

/**
 * Get contrasting foreground color for a background
 * Returns the appropriate foreground color based on the color type
 * 
 * @param palette - Theme palette
 * @param colorKey - Key of the background color
 * @returns Foreground color string
 */
export function getForegroundColor(
  palette: Palette,
  colorKey: keyof Palette
): string | undefined {
  const foregroundKey = `${String(colorKey)}Foreground` as keyof Palette;
  // eslint-disable-next-line security/detect-object-injection
  return palette[foregroundKey] as string | undefined;
}

/**
 * Check if theme is in dark mode
 * 
 * @param theme - Theme object
 * @returns True if theme is in dark mode
 */
export function isDarkMode(theme: Theme): boolean {
  return theme.mode === 'dark';
}

/**
 * Check if theme is in light mode
 * 
 * @param theme - Theme object
 * @returns True if theme is in light mode
 */
export function isLightMode(theme: Theme): boolean {
  return theme.mode === 'light' || theme.mode === undefined;
}

/**
 * Get spacing value with unit
 * Converts spacing key to CSS value with rem unit
 * 
 * @param scale - Spacing scale object
 * @param key - Spacing key
 * @returns CSS spacing value (e.g., "1rem")
 */
export function getSpacingValue(scale: SpacingScale, key: SpacingKey): string {
  // eslint-disable-next-line security/detect-object-injection
  return scale[key];
}

/**
 * Get breakpoint value in pixels
 * Converts breakpoint to numeric pixel value
 * 
 * @param breakpoints - Breakpoints object
 * @param key - Breakpoint key
 * @returns Pixel value as number
 */
export function getBreakpointValue(breakpoints: Breakpoints, key: BreakpointKey): number {
  // eslint-disable-next-line security/detect-object-injection
  const value = breakpoints[key];
  return parseInt(value.replace('px', ''), 10);
}

/**
 * Create media query string for breakpoint
 * 
 * @param breakpoints - Breakpoints object
 * @param key - Breakpoint key
 * @param type - Query type (min-width or max-width)
 * @returns Media query string
 * 
 * @example
 * ```typescript
 * const query = createMediaQuery(breakpoints, 'md', 'min');
 * // "@media (min-width: 768px)"
 * ```
 */
export function createMediaQuery(
  breakpoints: Breakpoints,
  key: BreakpointKey,
  type: 'min' | 'max' = 'min'
): string {
  const value = getBreakpointValue(breakpoints, key);
  const width = type === 'max' ? value - 1 : value;
  return `@media (${type}-width: ${width}px)`;
}

/**
 * Merge theme configurations
 * Deep merges theme configs with proper type safety
 * 
 * @param base - Base theme
 * @param override - Theme overrides
 * @returns Merged theme
 */
export function mergeThemes(base: Theme, override: Partial<Theme>): Theme {
  const result: Theme = {
    ...base,
    ...override,
    palette: {
      ...base.palette,
      ...override.palette,
    },
  };

  // Handle semantic palette merge with proper type safety
  if (override.semantic !== undefined) {
    result.semantic = {
      ...base.semantic,
      ...override.semantic,
      text: { ...base.semantic?.text, ...override.semantic.text },
      background: { ...base.semantic?.background, ...override.semantic.background },
      border: { ...base.semantic?.border, ...override.semantic.border },
      action: { ...base.semantic?.action, ...override.semantic.action },
      status: { ...base.semantic?.status, ...override.semantic.status },
    };
  }

  return result;
}

/**
 * Validate theme completeness
 * Checks if theme has all required properties
 * 
 * @param theme - Theme to validate
 * @returns Array of missing properties (empty if valid)
 */
export function validateTheme(theme: unknown): string[] {
  const errors: string[] = [];

  if (!isTheme(theme)) {
    errors.push('Invalid theme structure');
    return errors;
  }

  const requiredSystems = ['spacing', 'radii', 'typography', 'breakpoints', 'shadows', 'zIndex'];
  requiredSystems.forEach((system) => {
    // Safe: system is from predefined array of valid Theme property keys
    if (!theme[system as keyof Theme]) {
      errors.push(`Missing ${system} system`);
    }
  });

  return errors;
}

/**
 * Extract CSS variables from theme
 * Converts theme values to CSS custom properties
 * 
 * @param theme - Theme object
 * @param prefix - Variable prefix (default: '--')
 * @returns Object with CSS variable names and values
 * 
 * @example
 * ```typescript
 * const vars = extractCSSVariables(theme);
 * // { '--color-background': '#ffffff', '--spacing-4': '1rem', ... }
 * ```
 */
export function extractCSSVariables(
  theme: Theme,
  prefix: string = '--'
): Record<string, string> {
  const vars: Record<string, string> = {};

  // Extract palette colors
  Object.entries(theme.palette).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`${prefix}color-${key}`] = value;
    } else if (isColorPalette(value)) {
      Object.entries(value).forEach(([scale, color]) => {
        vars[`${prefix}color-${key}-${scale}`] = color;
      });
    }
  });

  // Extract spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    vars[`${prefix}spacing-${key}`] = value;
  });

  return vars;
}

// ============================================================================
// RE-EXPORTS FROM TOKENS
// ============================================================================

export type {
  ColorScale,
  SpacingKey,
  RadiiKey,
  FontSizeKey,
  FontWeightKey,
  LineHeightKey,
  BreakpointKey,
  ShadowKey,
  ZIndexKey,
  DurationKey,
  EasingKey,
};
