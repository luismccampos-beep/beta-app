import type { ColorGroup, ColorScale, SpacingKey, FontSizeKey, BreakpointKey } from './tokens.js';
import { typography } from './tokens.js';
/**
 * Acessa cor com escala de forma type-safe
 */
export declare function getColor(group: ColorGroup, scale: ColorScale): string;
/**
 * Gera múltiplos de espaçamento
 */
export declare function spacingMultiple(...keys: SpacingKey[]): string;
/**
 * Cria media query a partir de breakpoint
 */
export declare function mediaQuery(breakpoint: BreakpointKey, type?: 'min' | 'max'): string;
/**
 * Combina font-size e line-height
 */
export declare function fontStyle(size: FontSizeKey, lineHeight: keyof typeof typography.lineHeight): string;
