/// <reference lib="dom" />
// shared/src/themes/types.ts
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
export function isColorPalette(value) {
    if (!value || typeof value !== 'object')
        return false;
    const palette = value;
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
export function isPalette(value) {
    if (!value || typeof value !== 'object')
        return false;
    const palette = value;
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
export function isTheme(value) {
    if (!value || typeof value !== 'object')
        return false;
    const theme = value;
    return (typeof theme.name === 'string' &&
        isPalette(theme.palette) &&
        typeof theme.spacing === 'object' &&
        typeof theme.radii === 'object' &&
        typeof theme.typography === 'object');
}
/**
 * Type guard to check if value is a valid ThemeConfig
 * Validates minimum required properties for theme configuration
 *
 * @param value - Value to check
 * @returns True if value is a valid ThemeConfig
 */
export function isThemeConfig(value) {
    if (!value || typeof value !== 'object')
        return false;
    const config = value;
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
export function getColorValue(color, scale = 500) {
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
export function isScaledColor(color) {
    return typeof color === 'object' && isColorPalette(color);
}
/**
 * Extract base color from palette (typically the 500 shade)
 * Convenient helper to get the primary/default color from a palette
 *
 * @param color - Color value (string or ColorPalette)
 * @returns Base color string
 */
export function getBaseColor(color) {
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
export function getLighterShade(color, intensity = 1) {
    if (typeof color === 'string')
        return color;
    const shadeMap = {
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
export function getDarkerShade(color, intensity = 1) {
    if (typeof color === 'string')
        return color;
    const shadeMap = {
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
export function getForegroundColor(palette, colorKey) {
    const foregroundKey = `${String(colorKey)}Foreground`;
    // eslint-disable-next-line security/detect-object-injection
    return palette[foregroundKey];
}
/**
 * Check if theme is in dark mode
 *
 * @param theme - Theme object
 * @returns True if theme is in dark mode
 */
export function isDarkMode(theme) {
    return theme.mode === 'dark';
}
/**
 * Check if theme is in light mode
 *
 * @param theme - Theme object
 * @returns True if theme is in light mode
 */
export function isLightMode(theme) {
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
export function getSpacingValue(scale, key) {
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
export function getBreakpointValue(breakpoints, key) {
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
export function createMediaQuery(breakpoints, key, type = 'min') {
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
export function mergeThemes(base, override) {
    const result = {
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
export function validateTheme(theme) {
    const errors = [];
    if (!isTheme(theme)) {
        errors.push('Invalid theme structure');
        return errors;
    }
    const requiredSystems = ['spacing', 'radii', 'typography', 'breakpoints', 'shadows', 'zIndex'];
    requiredSystems.forEach((system) => {
        let hasSystem = false;
        switch (system) {
            case 'spacing':
                hasSystem = !!theme.spacing;
                break;
            case 'radii':
                hasSystem = !!theme.radii;
                break;
            case 'typography':
                hasSystem = !!theme.typography;
                break;
            case 'breakpoints':
                hasSystem = !!theme.breakpoints;
                break;
            case 'shadows':
                hasSystem = !!theme.shadows;
                break;
            case 'zIndex':
                hasSystem = !!theme.zIndex;
                break;
        }
        if (!hasSystem) {
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
export function extractCSSVariables(theme, prefix = '--') {
    const vars = {};
    // Extract palette colors
    Object.entries(theme.palette).forEach(([key, value]) => {
        if (typeof value === 'string') {
            vars[`${prefix}color-${key}`] = value;
        }
        else if (isColorPalette(value)) {
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
//# sourceMappingURL=types.js.map