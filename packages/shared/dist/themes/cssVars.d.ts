import type { Theme } from './types.js';
export interface CssVarOptions {
    prefix?: string;
    includeComments?: boolean;
}
/**
 * Converte um Theme em CSS Custom Properties
 * @param theme - Objeto de tema
 * @param options - Opções de conversão
 * @returns Objeto com CSS vars como chaves
 */
export declare function themeToCssVars(theme: Theme, options?: CssVarOptions): Record<string, string>;
/**
 * Converte objeto de CSS vars em string CSS
 * @param vars - Objeto com CSS custom properties
 * @param options - Opções de formatação
 * @returns String CSS pronta para uso
 */
export declare function cssVarsString(vars: Record<string, string>, options?: {
    indent?: string | undefined;
    includeComments?: boolean | undefined;
}): string;
/**
 * Gera CSS completo com :root
 * @param theme - Tema a ser convertido
 * @param options - Opções de conversão
 */
export declare function generateThemeCss(theme: Theme, options?: CssVarOptions): string;
/**
 * Helper para gerar variável CSS com fallback
 * @example cssVar('color-primary-500', '#f97316')
 * @returns "var(--akm-color-primary-500, #f97316)"
 */
export declare function cssVar(name: string, fallback?: string, prefix?: string): string;
/**
 * Extrai CSS vars de um elemento
 * Útil para debugging
 */
export declare function extractCssVars(element?: HTMLElement): Record<string, string>;
