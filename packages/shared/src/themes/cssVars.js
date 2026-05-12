/**
 * Converte string para kebab-case
 * @example toKebabCase('primaryColor') => 'primary-color'
 */
function toKebabCase(input) {
    return input
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
/**
 * Verifica se um valor é um objeto simples (não array, não null)
 */
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * Processa objetos aninhados recursivamente
 * @example processNested({ primary: { 500: '#fff' } }, 'color') => { '--color-primary-500': '#fff' }
 */
function processNested(obj, baseKey, prefix) {
    const vars = {};
    Object.entries(obj).forEach(([key, value]) => {
        const varKey = `--${prefix}${baseKey}-${toKebabCase(key)}`;
        if (isPlainObject(value)) {
            // Se é objeto, processa recursivamente
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                const nestedVarKey = `${varKey}-${toKebabCase(nestedKey)}`;
                // eslint-disable-next-line security/detect-object-injection
                vars[nestedVarKey] = String(nestedValue);
            });
        }
        else {
            // eslint-disable-next-line security/detect-object-injection
            vars[varKey] = String(value);
        }
    });
    return vars;
}
/**
 * Converte um Theme em CSS Custom Properties
 * @param theme - Objeto de tema
 * @param options - Opções de conversão
 * @returns Objeto com CSS vars como chaves
 */
export function themeToCssVars(theme, options = {}) {
    const prefix = options.prefix ? `${options.prefix}-` : '';
    const vars = {};
    // Colors/Palette (suporta objetos aninhados como primary.500)
    if (theme.palette) {
        Object.assign(vars, processNested(theme.palette, 'color', prefix));
    }
    // Spacing
    if (theme.spacing) {
        Object.entries(theme.spacing).forEach(([key, value]) => {
            vars[`--${prefix}space-${key}`] = String(value);
        });
    }
    // Radii
    if (theme.radii) {
        Object.entries(theme.radii).forEach(([key, value]) => {
            vars[`--${prefix}radius-${toKebabCase(key)}`] = String(value);
        });
    }
    // Typography
    if (theme.typography) {
        const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } = theme.typography;
        // Font families
        if (fontFamily) {
            if (isPlainObject(fontFamily)) {
                Object.entries(fontFamily).forEach(([key, value]) => {
                    vars[`--${prefix}font-family-${toKebabCase(key)}`] = String(value);
                });
            }
            else {
                vars[`--${prefix}font-family`] = String(fontFamily);
            }
        }
        // Font sizes
        if (fontSize) {
            Object.entries(fontSize).forEach(([key, value]) => {
                vars[`--${prefix}font-size-${toKebabCase(key)}`] = String(value);
            });
        }
        // Font weights
        if (fontWeight) {
            Object.entries(fontWeight).forEach(([key, value]) => {
                vars[`--${prefix}font-weight-${toKebabCase(key)}`] = String(value);
            });
        }
        // Line heights
        if (lineHeight) {
            Object.entries(lineHeight).forEach(([key, value]) => {
                vars[`--${prefix}line-height-${toKebabCase(key)}`] = String(value);
            });
        }
        // Letter spacing
        if (letterSpacing) {
            Object.entries(letterSpacing).forEach(([key, value]) => {
                vars[`--${prefix}letter-spacing-${toKebabCase(key)}`] = String(value);
            });
        }
    }
    // Breakpoints
    if (theme.breakpoints) {
        Object.entries(theme.breakpoints).forEach(([key, value]) => {
            vars[`--${prefix}breakpoint-${toKebabCase(key)}`] = String(value);
        });
    }
    // Shadows
    if (theme.shadows) {
        Object.entries(theme.shadows).forEach(([key, value]) => {
            vars[`--${prefix}shadow-${toKebabCase(key)}`] = String(value);
        });
    }
    // Z-index
    if (theme.zIndex) {
        Object.entries(theme.zIndex).forEach(([key, value]) => {
            vars[`--${prefix}z-index-${toKebabCase(key)}`] = String(value);
        });
    }
    // Durations
    if (theme.durations) {
        Object.entries(theme.durations).forEach(([key, value]) => {
            vars[`--${prefix}duration-${toKebabCase(key)}`] = String(value);
        });
    }
    // Easings
    if (theme.easings) {
        Object.entries(theme.easings).forEach(([key, value]) => {
            vars[`--${prefix}easing-${toKebabCase(key)}`] = String(value);
        });
    }
    return vars;
}
/**
 * Converte objeto de CSS vars em string CSS
 * @param vars - Objeto com CSS custom properties
 * @param options - Opções de formatação
 * @returns String CSS pronta para uso
 */
export function cssVarsString(vars, options = {}) {
    const { indent = '  ', includeComments = false } = options;
    let result = Object.entries(vars)
        .map(([key, value]) => `${indent}${key}: ${value};`)
        .join('\n');
    if (includeComments) {
        result = `${indent}/* Auto-generated CSS variables from theme */
${result}`;
    }
    return result;
}
/**
 * Gera CSS completo com :root
 * @param theme - Tema a ser convertido
 * @param options - Opções de conversão
 */
export function generateThemeCss(theme, options = {}) {
    const vars = themeToCssVars(theme, options);
    const cssVars = cssVarsString(vars, { includeComments: options.includeComments });
    return `:root {
${cssVars}
}`;
}
/**
 * Helper para gerar variável CSS com fallback
 * @example cssVar('color-primary-500', '#f97316')
 * @returns "var(--akm-color-primary-500, #f97316)"
 */
export function cssVar(name, fallback, prefix = 'akm') {
    const varName = name.startsWith('--') ? name : `--${prefix}-${name}`;
    return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`;
}
/**
 * Extrai CSS vars de um elemento
 * Útil para debugging
 */
export function extractCssVars(element = document.documentElement) {
    const styles = getComputedStyle(element);
    const vars = {};
    Array.from(styles).forEach((property) => {
        if (property.startsWith('--')) {
            // eslint-disable-next-line security/detect-object-injection
            vars[property] = styles.getPropertyValue(property).trim();
        }
    });
    return vars;
}
/* global document, getComputedStyle */
//# sourceMappingURL=cssVars.js.map