// shared/src/themes/tokenHelpers.ts
import type {
  ColorGroup,
  ColorScale,
  SpacingKey,
  FontSizeKey,
  BreakpointKey,
} from './tokens.js';
import { colors, spacing, typography, breakpoints } from './tokens.js';

/**
 * Acessa cor com escala de forma type-safe
 */
export function getColor(group: ColorGroup, scale: ColorScale): string {
  // eslint-disable-next-line security/detect-object-injection
  const colorGroup = colors[group];
  if (!colorGroup) {
    throw new Error(`Invalid color group "${group}"`);
  }
  // eslint-disable-next-line security/detect-object-injection
  const color = colorGroup[scale];
  if (!color) {
    throw new Error(`Invalid color scale "${scale}" for group "${group}"`);
  }
  return color;
}

/**
 * Gera múltiplos de espaçamento
 */
export function spacingMultiple(...keys: SpacingKey[]): string {
  return keys.map((key) => {
    // eslint-disable-next-line security/detect-object-injection
    return spacing[key];
  }).join(' ');
}

/**
 * Cria media query a partir de breakpoint
 */
export function mediaQuery(breakpoint: BreakpointKey, type: 'min' | 'max' = 'min'): string {
  // eslint-disable-next-line security/detect-object-injection
  const value = breakpoints[breakpoint];
  return `@media (${type}-width: ${value})`;
}

/**
 * Combina font-size e line-height
 */
export function fontStyle(size: FontSizeKey, lineHeight: keyof typeof typography.lineHeight): string {
  // eslint-disable-next-line security/detect-object-injection
  const fontSize = typography.fontSize[size];
  // eslint-disable-next-line security/detect-object-injection
  const lHeight = String((typography.lineHeight as unknown as Record<string, number>)[lineHeight]);
  return `${fontSize}/${lHeight}`;
}