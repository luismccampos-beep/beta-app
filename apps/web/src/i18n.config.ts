// List of supported locales (keep in sync with `src/i18n.ts`)
export const locales = ['pt', 'en', 'es', 'fr'] as const;
export const defaultLocale = 'pt' as const;

export type Locale = (typeof locales)[number];
