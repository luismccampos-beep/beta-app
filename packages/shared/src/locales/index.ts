// Auto-generated - do not edit manually

import en from './en';
import es from './es';
import fr from './fr';
import pt from './pt';

export const resources = {
  en,
  es,
  fr,
  pt,
} as const;

export type Resources = typeof resources;
export type Language = keyof Resources;

// Named exports
export { en, es, fr, pt };

// Re-export types
export * from './types';
