export const THEME_TYPES = {
  dark: 'dark',
  light: 'light',
  auto: 'auto',
} as const;

export type ThemeType = (typeof THEME_TYPES)[keyof typeof THEME_TYPES];
