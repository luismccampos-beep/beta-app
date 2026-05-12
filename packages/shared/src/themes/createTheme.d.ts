import { spacing, radii, typography, breakpoints, shadows, zIndex, durations, easings } from './tokens';
import type { Theme, Palette } from './types';
/**
 * Opções obrigatórias para criação de tema
 */
export interface CreateThemeOptions {
    /** Nome identificador do tema */
    name: string;
    /** Paleta de cores (campos obrigatórios: background, foreground, primary, primaryForeground) */
    palette: Partial<Palette> & Pick<Palette, 'background' | 'foreground' | 'primary' | 'primaryForeground'>;
    /** Modo do tema (light/dark) */
    mode?: 'light' | 'dark' | undefined;
    /** Customizações adicionais de espaçamento */
    spacing?: Partial<typeof spacing> | undefined;
    /** Customizações de border-radius */
    radii?: Partial<typeof radii> | undefined;
    /** Customizações tipográficas */
    typography?: Partial<typeof typography> | undefined;
    /** Breakpoints customizados */
    breakpoints?: Partial<typeof breakpoints> | undefined;
    /** Sombras customizadas */
    shadows?: Partial<typeof shadows> | undefined;
    /** Z-index customizado */
    zIndex?: Partial<typeof zIndex> | undefined;
    /** Durações customizadas */
    durations?: Partial<typeof durations> | undefined;
    /** Easings customizados */
    easings?: Partial<typeof easings> | undefined;
    /** Se deve gerar paleta semântica automaticamente */
    generateSemantic?: boolean | undefined;
}
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
export declare function createTheme(options: CreateThemeOptions): Theme;
/**
 * Cria um tema light
 */
export declare function createLightTheme(options: Omit<CreateThemeOptions, 'mode'>): Theme;
/**
 * Cria um tema dark
 */
export declare function createDarkTheme(options: Omit<CreateThemeOptions, 'mode'>): Theme;
/**
 * Cria um par de temas (light + dark) com a mesma configuração
 */
export declare function createThemePair(options: Omit<CreateThemeOptions, 'mode' | 'name'> & {
    baseName: string;
}): {
    light: Theme;
    dark: Theme;
};
/**
 * Estende um tema existente com novas configurações
 */
export declare function extendTheme(baseTheme: Theme, overrides: Partial<CreateThemeOptions>): Theme;
/**
 * Valida se um tema está completo e correto
 */
export declare function validateTheme(theme: Theme): {
    valid: boolean;
    errors: string[];
};
