// shared/src/themes/createTheme.ts
import { colors, spacing, radii, typography, breakpoints, shadows, zIndex, durations, easings, } from './tokens';
/**
 * Gera paleta semântica baseada na paleta principal
 */
function generateSemanticPalette(palette) {
    return {
        text: {
            primary: palette.foreground,
            secondary: palette.mutedForeground,
            tertiary: colors.gray[500],
            disabled: colors.gray[400],
            inverse: palette.background,
        },
        background: {
            primary: palette.background,
            secondary: palette.muted,
            tertiary: colors.gray[100],
            inverse: palette.foreground,
        },
        border: {
            default: palette.border,
            hover: colors.gray[300],
            focus: typeof palette.primary === 'string' ? palette.primary : colors.primary[500],
        },
        action: {
            primary: typeof palette.primary === 'string' ? palette.primary : colors.primary[500],
            primaryHover: typeof palette.primary === 'string' ? palette.primary : colors.primary[600],
            secondary: typeof palette.secondary === 'string' ? palette.secondary : colors.secondary?.[500] || colors.gray[500],
            secondaryHover: typeof palette.secondary === 'string' ? palette.secondary : colors.secondary?.[600] || colors.gray[600],
            disabled: colors.gray[300],
        },
        status: {
            success: typeof palette.success === 'string' ? palette.success : colors.success[500],
            warning: typeof palette.warning === 'string' ? palette.warning : colors.warning[500],
            danger: typeof palette.danger === 'string' ? palette.danger : colors.danger[500],
            info: typeof palette.info === 'string' ? palette.info : colors.info?.[500] || colors.secondary[500],
        },
    };
}
/**
 * Paleta padrão para temas light
 */
const defaultLightPalette = {
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    primary: colors.primary[600],
    primaryForeground: '#ffffff',
    secondary: colors.secondary[500],
    secondaryForeground: '#ffffff',
    success: colors.success[500],
    successForeground: '#ffffff',
    warning: colors.warning[500],
    warningForeground: '#ffffff',
    danger: colors.danger[500],
    dangerForeground: '#ffffff',
    info: colors.info[500],
    infoForeground: '#ffffff',
    accent: colors.primary[500],
    accentForeground: '#ffffff',
    gray: colors.gray,
};
/**
 * Paleta padrão para temas dark
 */
const defaultDarkPalette = {
    background: '#0f172a',
    foreground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    border: '#334155',
    primary: colors.primary[500],
    primaryForeground: '#ffffff',
    secondary: colors.secondary[400],
    secondaryForeground: '#ffffff',
    success: colors.success[400],
    successForeground: '#ffffff',
    warning: colors.warning[400],
    warningForeground: '#ffffff',
    danger: colors.danger[400],
    dangerForeground: '#ffffff',
    info: colors.info[400],
    infoForeground: '#ffffff',
    accent: colors.primary[400],
    accentForeground: '#ffffff',
    gray: colors.gray,
};
/**
 * Cria um tema completo a partir das opções fornecidas
 *
 * @param options - Configurações do tema
 * @returns Tema completo pronto para uso
 *
 * @example
 * ```ts
 * const myTheme = createTheme({
 *   name: 'my-app',
 *   mode: 'light',
 *   palette: {
 *     background: '#ffffff',
 *     foreground: '#000000',
 *     primary: colors.primary[600],
 *     primaryForeground: '#ffffff',
 *   },
 * });
 * ```
 */
export function createTheme(options) {
    const { name, palette: customPalette, mode = 'light', spacing: customSpacing, radii: customRadii, typography: customTypography, breakpoints: customBreakpoints, shadows: customShadows, zIndex: customZIndex, durations: customDurations, easings: customEasings, generateSemantic = true, } = options;
    // Seleciona paleta base conforme o modo
    const basePalette = mode === 'dark' ? defaultDarkPalette : defaultLightPalette;
    // Mescla paletas
    const palette = {
        ...basePalette,
        ...customPalette,
    };
    // Cria tema base
    const theme = {
        name,
        mode,
        palette,
        spacing: customSpacing ? { ...spacing, ...customSpacing } : spacing,
        radii: customRadii ? { ...radii, ...customRadii } : radii,
        typography: customTypography ? { ...typography, ...customTypography } : typography,
        breakpoints: customBreakpoints ? { ...breakpoints, ...customBreakpoints } : breakpoints,
        shadows: customShadows ? { ...shadows, ...customShadows } : shadows,
        zIndex: customZIndex ? { ...zIndex, ...customZIndex } : zIndex,
        durations: customDurations ? { ...durations, ...customDurations } : durations,
        easings: customEasings ? { ...easings, ...customEasings } : easings,
        colors,
    };
    // Gera paleta semântica se solicitado
    if (generateSemantic) {
        theme.semantic = generateSemanticPalette(palette);
    }
    return theme;
}
/**
 * Cria um tema light
 */
export function createLightTheme(options) {
    return createTheme({ ...options, mode: 'light' });
}
/**
 * Cria um tema dark
 */
export function createDarkTheme(options) {
    return createTheme({ ...options, mode: 'dark' });
}
/**
 * Cria um par de temas (light + dark) com a mesma configuração
 */
export function createThemePair(options) {
    const { baseName, ...themeOptions } = options;
    return {
        light: createLightTheme({
            ...themeOptions,
            name: `${baseName}-light`,
        }),
        dark: createDarkTheme({
            ...themeOptions,
            name: `${baseName}-dark`,
        }),
    };
}
/**
 * Estende um tema existente com novas configurações
 */
export function extendTheme(baseTheme, overrides) {
    return createTheme({
        name: overrides.name || `${baseTheme.name}-extended`,
        mode: overrides.mode || baseTheme.mode,
        palette: {
            ...baseTheme.palette,
            ...overrides.palette,
        },
        spacing: overrides.spacing ? { ...baseTheme.spacing, ...overrides.spacing } : baseTheme.spacing,
        radii: overrides.radii ? { ...baseTheme.radii, ...overrides.radii } : baseTheme.radii,
        typography: overrides.typography ? { ...baseTheme.typography, ...overrides.typography } : baseTheme.typography,
        breakpoints: overrides.breakpoints,
        shadows: overrides.shadows,
        zIndex: overrides.zIndex,
        durations: overrides.durations,
        easings: overrides.easings,
        generateSemantic: overrides.generateSemantic,
    });
}
/**
 * Valida se um tema está completo e correto
 */
export function validateTheme(theme) {
    const errors = [];
    if (!theme.name) {
        errors.push('Theme must have a name');
    }
    const requiredPaletteKeys = [
        'background',
        'foreground',
        'primary',
        'primaryForeground',
    ];
    requiredPaletteKeys.forEach((key) => {
        // eslint-disable-next-line security/detect-object-injection
        if (!theme.palette[key]) {
            errors.push(`Palette missing required key: ${String(key)}`);
        }
    });
    if (!theme.spacing || Object.keys(theme.spacing).length === 0) {
        errors.push('Theme must have spacing defined');
    }
    if (!theme.typography) {
        errors.push('Theme must have typography defined');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
//# sourceMappingURL=createTheme.js.map