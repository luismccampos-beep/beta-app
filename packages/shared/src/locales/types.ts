// Auto-generated - do not edit manually

import type { Resources } from './index';

export type Language = 'en' | 'es' | 'fr' | 'pt';

export type Namespace = keyof Resources[Language];

export type TranslationKey<
  L extends Language,
  N extends Namespace
> = N extends keyof Resources[L] ? keyof Resources[L][N] : never;

export type Messages = Resources[Language];
