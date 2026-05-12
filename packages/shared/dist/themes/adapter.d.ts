import type { Theme } from './types';
type LegacyTheme = typeof import('./theme').theme;
export declare function adaptLegacyTheme(name: string, legacy: LegacyTheme): Theme;
export {};
