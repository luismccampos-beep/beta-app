export declare const THEME_TYPES: {
    readonly dark: "dark";
    readonly light: "light";
    readonly auto: "auto";
};
export type ThemeType = (typeof THEME_TYPES)[keyof typeof THEME_TYPES];
