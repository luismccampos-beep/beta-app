import type { spacing, radii, typography, colors, breakpoints, shadows, zIndex, durations, easings, ColorScale, SpacingKey, RadiiKey, FontSizeKey, FontWeightKey, LineHeightKey, BreakpointKey, ShadowKey, ZIndexKey, DurationKey, EasingKey } from './tokens.js';
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
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    primary: string | ColorPalette;
    primaryForeground: string;
    secondary?: string | ColorPalette;
    secondaryForeground?: string;
    success: string | ColorPalette;
    successForeground?: string;
    warning: string | ColorPalette;
    warningForeground?: string;
    danger: string | ColorPalette;
    dangerForeground?: string;
    info?: string | ColorPalette;
    infoForeground?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    destructiveForeground?: string;
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
export type ColorToken<T extends keyof Colors = keyof Colors> = T extends keyof Colors ? Colors[T] extends ColorPalette ? `${T & string}.${keyof ColorPalette & string}` : T : never;
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
/**
 * Theme mode options
 * - light: Light color scheme
 * - dark: Dark color scheme
 * - system: Follow system preference
 */
export type ThemeMode = 'light' | 'dark' | 'system';
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
export type ThemeAdapter<TFrom = unknown, TTo extends Theme = Theme> = (source: TFrom, name: string) => TTo;
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
export declare function isColorPalette(value: unknown): value is ColorPalette;
/**
 * Type guard to check if value is a valid Palette
 * Validates presence of all required color properties
 *
 * @param value - Value to check
 * @returns True if value is a valid Palette
 */
export declare function isPalette(value: unknown): value is Palette;
/**
 * Type guard to check if value is a valid Theme
 * Validates presence of all required theme properties
 *
 * @param value - Value to check
 * @returns True if value is a valid Theme
 */
export declare function isTheme(value: unknown): value is Theme;
/**
 * Type guard to check if value is a valid ThemeConfig
 * Validates minimum required properties for theme configuration
 *
 * @param value - Value to check
 * @returns True if value is a valid ThemeConfig
 */
export declare function isThemeConfig(value: unknown): value is ThemeConfig;
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
export declare function getColorValue(color: string | ColorPalette, scale?: keyof ColorPalette): string;
/**
 * Check if a color is a scaled palette
 * Type guard to distinguish between string colors and ColorPalette objects
 *
 * @param color - Color to check
 * @returns True if color is a ColorPalette
 */
export declare function isScaledColor(color: string | ColorPalette): color is ColorPalette;
/**
 * Extract base color from palette (typically the 500 shade)
 * Convenient helper to get the primary/default color from a palette
 *
 * @param color - Color value (string or ColorPalette)
 * @returns Base color string
 */
export declare function getBaseColor(color: string | ColorPalette): string;
/**
 * Get lighter shade from color palette
 * Returns a lighter variant of the color for hover states, backgrounds, etc.
 *
 * @param color - Color value
 * @param intensity - How much lighter (1-5, default 1)
 * @returns Lighter color string
 */
export declare function getLighterShade(color: string | ColorPalette, intensity?: 1 | 2 | 3 | 4 | 5): string;
/**
 * Get darker shade from color palette
 * Returns a darker variant of the color for active states, text, etc.
 *
 * @param color - Color value
 * @param intensity - How much darker (1-4, default 1)
 * @returns Darker color string
 */
export declare function getDarkerShade(color: string | ColorPalette, intensity?: 1 | 2 | 3 | 4): string;
/**
 * Get contrasting foreground color for a background
 * Returns the appropriate foreground color based on the color type
 *
 * @param palette - Theme palette
 * @param colorKey - Key of the background color
 * @returns Foreground color string
 */
export declare function getForegroundColor(palette: Palette, colorKey: keyof Palette): string | undefined;
/**
 * Check if theme is in dark mode
 *
 * @param theme - Theme object
 * @returns True if theme is in dark mode
 */
export declare function isDarkMode(theme: Theme): boolean;
/**
 * Check if theme is in light mode
 *
 * @param theme - Theme object
 * @returns True if theme is in light mode
 */
export declare function isLightMode(theme: Theme): boolean;
/**
 * Get spacing value with unit
 * Converts spacing key to CSS value with rem unit
 *
 * @param scale - Spacing scale object
 * @param key - Spacing key
 * @returns CSS spacing value (e.g., "1rem")
 */
export declare function getSpacingValue(scale: SpacingScale, key: SpacingKey): string;
/**
 * Get breakpoint value in pixels
 * Converts breakpoint to numeric pixel value
 *
 * @param breakpoints - Breakpoints object
 * @param key - Breakpoint key
 * @returns Pixel value as number
 */
export declare function getBreakpointValue(breakpoints: Breakpoints, key: BreakpointKey): number;
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
export declare function createMediaQuery(breakpoints: Breakpoints, key: BreakpointKey, type?: 'min' | 'max'): string;
/**
 * Merge theme configurations
 * Deep merges theme configs with proper type safety
 *
 * @param base - Base theme
 * @param override - Theme overrides
 * @returns Merged theme
 */
export declare function mergeThemes(base: Theme, override: Partial<Theme>): Theme;
/**
 * Validate theme completeness
 * Checks if theme has all required properties
 *
 * @param theme - Theme to validate
 * @returns Array of missing properties (empty if valid)
 */
export declare function validateTheme(theme: unknown): string[];
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
export declare function extractCSSVariables(theme: Theme, prefix?: string): Record<string, string>;
export type { ColorScale, SpacingKey, RadiiKey, FontSizeKey, FontWeightKey, LineHeightKey, BreakpointKey, ShadowKey, ZIndexKey, DurationKey, EasingKey, };
