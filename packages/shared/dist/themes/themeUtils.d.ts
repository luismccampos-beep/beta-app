import type { ColorPalette, Theme, ThemeConfig, ThemeOptions } from './types';
/**
 * Cria um tema completo a partir de configuração parcial
 */
export declare function createTheme(config: ThemeConfig, options?: ThemeOptions): Theme;
/**
 * Verifica se um valor é uma paleta de cores com escala
 */
export declare function isColorPalette(value: unknown): value is ColorPalette;
/**
 * Extrai cor base de uma paleta (pega o 500)
 */
export declare function getBaseColor(color: string | ColorPalette): string;
/**
 * Inverte modo do tema (light <-> dark)
 */
export declare function invertThemeMode(theme: Theme): Theme;
/**
 * Mescla dois temas (theme2 sobrescreve theme1)
 */
export declare function mergeThemes(theme1: Theme, theme2: Partial<Theme>): Theme;
