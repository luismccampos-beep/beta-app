/**
 * Design tokens e escalas base compartilhadas entre temas
 * Seguindo padrão de Design System moderno
 */
/**
 * Paleta de cores do sistema
 * Baseada em escalas de 50-900 para flexibilidade
 */
export declare const colors: {
    readonly primary: {
        readonly 50: "#fff7ed";
        readonly 100: "#ffedd5";
        readonly 200: "#fed7aa";
        readonly 300: "#fdba74";
        readonly 400: "#fb923c";
        readonly 500: "#f97316";
        readonly 600: "#ea580c";
        readonly 700: "#c2410c";
        readonly 800: "#9a3412";
        readonly 900: "#7c2d12";
    };
    readonly secondary: {
        readonly 50: "#f0f9ff";
        readonly 100: "#e0f2fe";
        readonly 200: "#bae6fd";
        readonly 300: "#7dd3fc";
        readonly 400: "#38bdf8";
        readonly 500: "#0ea5e9";
        readonly 600: "#0284c7";
        readonly 700: "#0369a1";
        readonly 800: "#075985";
        readonly 900: "#0c4a6e";
    };
    readonly gray: {
        readonly 50: "#f9fafb";
        readonly 100: "#f3f4f6";
        readonly 200: "#e5e7eb";
        readonly 300: "#d1d5db";
        readonly 400: "#9ca3af";
        readonly 500: "#6b7280";
        readonly 600: "#4b5563";
        readonly 700: "#374151";
        readonly 800: "#1f2937";
        readonly 900: "#111827";
    };
    readonly success: {
        readonly 50: "#f0fdf4";
        readonly 100: "#dcfce7";
        readonly 200: "#bbf7d0";
        readonly 300: "#86efac";
        readonly 400: "#4ade80";
        readonly 500: "#16a34a";
        readonly 600: "#15803d";
        readonly 700: "#166534";
        readonly 800: "#14532d";
        readonly 900: "#052e16";
    };
    readonly warning: {
        readonly 50: "#fffbeb";
        readonly 100: "#fef3c7";
        readonly 200: "#fde68a";
        readonly 300: "#fcd34d";
        readonly 400: "#fbbf24";
        readonly 500: "#d97706";
        readonly 600: "#b45309";
        readonly 700: "#92400e";
        readonly 800: "#78350f";
        readonly 900: "#451a03";
    };
    readonly danger: {
        readonly 50: "#fef2f2";
        readonly 100: "#fee2e2";
        readonly 200: "#fecaca";
        readonly 300: "#fca5a5";
        readonly 400: "#f87171";
        readonly 500: "#dc2626";
        readonly 600: "#b91c1c";
        readonly 700: "#991b1b";
        readonly 800: "#7f1d1d";
        readonly 900: "#450a0a";
    };
    readonly info: {
        readonly 50: "#eff6ff";
        readonly 100: "#dbeafe";
        readonly 200: "#bfdbfe";
        readonly 300: "#93c5fd";
        readonly 400: "#60a5fa";
        readonly 500: "#3b82f6";
        readonly 600: "#2563eb";
        readonly 700: "#1d4ed8";
        readonly 800: "#1e40af";
        readonly 900: "#1e3a8a";
    };
};
/**
 * Sistema de espaçamento baseado em múltiplos de 4px
 * Garante consistência visual em toda aplicação
 */
export declare const spacing: {
    readonly 0: "0px";
    readonly 0.5: "2px";
    readonly 1: "4px";
    readonly 1.5: "6px";
    readonly 2: "8px";
    readonly 2.5: "10px";
    readonly 3: "12px";
    readonly 3.5: "14px";
    readonly 4: "16px";
    readonly 5: "20px";
    readonly 6: "24px";
    readonly 7: "28px";
    readonly 8: "32px";
    readonly 9: "36px";
    readonly 10: "40px";
    readonly 11: "44px";
    readonly 12: "48px";
    readonly 14: "56px";
    readonly 16: "64px";
    readonly 20: "80px";
    readonly 24: "96px";
    readonly 28: "112px";
    readonly 32: "128px";
    readonly 36: "144px";
    readonly 40: "160px";
    readonly 44: "176px";
    readonly 48: "192px";
    readonly 52: "208px";
    readonly 56: "224px";
    readonly 60: "240px";
    readonly 64: "256px";
    readonly 72: "288px";
    readonly 80: "320px";
    readonly 96: "384px";
};
/**
 * Sistema de border-radius
 */
export declare const radii: {
    readonly none: "0px";
    readonly sm: "2px";
    readonly base: "4px";
    readonly md: "6px";
    readonly lg: "8px";
    readonly xl: "12px";
    readonly '2xl': "16px";
    readonly '3xl': "24px";
    readonly full: "9999px";
};
/**
 * Sistema tipográfico
 */
export declare const typography: {
    readonly fontFamily: {
        readonly sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"";
        readonly mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace";
        readonly serif: "ui-serif, Georgia, Cambria, \"Times New Roman\", Times, serif";
    };
    readonly fontSize: {
        readonly xs: "12px";
        readonly sm: "14px";
        readonly base: "16px";
        readonly lg: "18px";
        readonly xl: "20px";
        readonly '2xl': "24px";
        readonly '3xl': "30px";
        readonly '4xl': "36px";
        readonly '5xl': "48px";
        readonly '6xl': "60px";
        readonly '7xl': "72px";
        readonly '8xl': "96px";
        readonly '9xl': "128px";
    };
    readonly fontWeight: {
        readonly thin: 100;
        readonly extralight: 200;
        readonly light: 300;
        readonly normal: 400;
        readonly medium: 500;
        readonly semibold: 600;
        readonly bold: 700;
        readonly extrabold: 800;
        readonly black: 900;
    };
    readonly lineHeight: {
        readonly none: 1;
        readonly tight: 1.25;
        readonly snug: 1.375;
        readonly normal: 1.5;
        readonly relaxed: 1.625;
        readonly loose: 2;
    };
    readonly letterSpacing: {
        readonly tighter: "-0.05em";
        readonly tight: "-0.025em";
        readonly normal: "0em";
        readonly wide: "0.025em";
        readonly wider: "0.05em";
        readonly widest: "0.1em";
    };
};
/**
 * Breakpoints responsivos
 */
export declare const breakpoints: {
    readonly xs: "320px";
    readonly sm: "640px";
    readonly md: "768px";
    readonly lg: "1024px";
    readonly xl: "1280px";
    readonly '2xl': "1536px";
};
/**
 * Sombras e elevações
 */
export declare const shadows: {
    readonly none: "none";
    readonly sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
    readonly base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
    readonly md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
    readonly lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
    readonly xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    readonly '2xl': "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
    readonly inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)";
};
/**
 * Z-index hierarchy
 */
export declare const zIndex: {
    readonly base: 0;
    readonly dropdown: 1000;
    readonly sticky: 1020;
    readonly fixed: 1030;
    readonly modalBackdrop: 1040;
    readonly modal: 1050;
    readonly popover: 1060;
    readonly tooltip: 1070;
};
/**
 * Durações de animação
 */
export declare const durations: {
    readonly fast: "150ms";
    readonly base: "200ms";
    readonly slow: "300ms";
    readonly slower: "500ms";
};
/**
 * Easing functions
 */
export declare const easings: {
    readonly linear: "linear";
    readonly ease: "ease";
    readonly easeIn: "ease-in";
    readonly easeOut: "ease-out";
    readonly easeInOut: "ease-in-out";
};
export type ColorScale = keyof typeof colors.primary;
export type ColorGroup = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type RadiiKey = keyof typeof radii;
export type FontSizeKey = keyof typeof typography.fontSize;
export type FontWeightKey = keyof typeof typography.fontWeight;
export type LineHeightKey = keyof typeof typography.lineHeight;
export type BreakpointKey = keyof typeof breakpoints;
export type ShadowKey = keyof typeof shadows;
export type ZIndexKey = keyof typeof zIndex;
export type DurationKey = keyof typeof durations;
export type EasingKey = keyof typeof easings;
/**
 * Paleta semântica - mapeia intenções para cores específicas
 */
export declare const semanticColors: {
    readonly text: {
        readonly primary: "#111827";
        readonly secondary: "#4b5563";
        readonly tertiary: "#6b7280";
        readonly disabled: "#9ca3af";
        readonly inverse: "#ffffff";
    };
    readonly background: {
        readonly primary: "#ffffff";
        readonly secondary: "#f9fafb";
        readonly tertiary: "#f3f4f6";
        readonly inverse: "#111827";
    };
    readonly border: {
        readonly default: "#e5e7eb";
        readonly hover: "#d1d5db";
        readonly focus: "#f97316";
    };
    readonly action: {
        readonly primary: "#f97316";
        readonly primaryHover: "#ea580c";
        readonly secondary: "#0ea5e9";
        readonly secondaryHover: "#0284c7";
        readonly disabled: "#d1d5db";
    };
    readonly status: {
        readonly success: "#16a34a";
        readonly warning: "#d97706";
        readonly danger: "#dc2626";
        readonly info: "#3b82f6";
    };
};
export type SemanticColorGroup = keyof typeof semanticColors;
export type SemanticColorKey<T extends SemanticColorGroup> = keyof typeof semanticColors[T];
