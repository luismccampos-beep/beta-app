/**
 * AKMLEVA Design Tokens
 *
 * Centralized design system tokens for consistent theming across all components.
 * These tokens align with Tailwind CSS custom properties and enable:
 * - Consistent styling
 * - Dark mode support
 * - Accessibility compliance
 * - Theme customization
 */
export declare const colors: {
    readonly background: "hsl(var(--background))";
    readonly foreground: "hsl(var(--foreground))";
    readonly primary: {
        readonly DEFAULT: "hsl(var(--primary))";
        readonly foreground: "hsl(var(--primary-foreground))";
    };
    readonly secondary: {
        readonly DEFAULT: "hsl(var(--secondary))";
        readonly foreground: "hsl(var(--secondary-foreground))";
    };
    readonly destructive: {
        readonly DEFAULT: "hsl(var(--destructive))";
        readonly foreground: "hsl(var(--destructive-foreground))";
    };
    readonly muted: {
        readonly DEFAULT: "hsl(var(--muted))";
        readonly foreground: "hsl(var(--muted-foreground))";
    };
    readonly accent: {
        readonly DEFAULT: "hsl(var(--accent))";
        readonly foreground: "hsl(var(--accent-foreground))";
    };
    readonly popover: {
        readonly DEFAULT: "hsl(var(--popover))";
        readonly foreground: "hsl(var(--popover-foreground))";
    };
    readonly card: {
        readonly DEFAULT: "hsl(var(--card))";
        readonly foreground: "hsl(var(--card-foreground))";
    };
    readonly border: "hsl(var(--border))";
    readonly input: "hsl(var(--input))";
    readonly ring: "hsl(var(--ring))";
    readonly success: {
        readonly DEFAULT: "hsl(142 76% 36%)";
        readonly foreground: "hsl(0 0% 100%)";
        readonly light: "hsl(142 76% 95%)";
    };
    readonly warning: {
        readonly DEFAULT: "hsl(38 92% 50%)";
        readonly foreground: "hsl(0 0% 100%)";
        readonly light: "hsl(38 92% 95%)";
    };
    readonly info: {
        readonly DEFAULT: "hsl(217 91% 60%)";
        readonly foreground: "hsl(0 0% 100%)";
        readonly light: "hsl(217 91% 95%)";
    };
};
export declare const spacing: {
    readonly 0: "0px";
    readonly 0.5: "0.125rem";
    readonly 1: "0.25rem";
    readonly 1.5: "0.375rem";
    readonly 2: "0.5rem";
    readonly 2.5: "0.625rem";
    readonly 3: "0.75rem";
    readonly 3.5: "0.875rem";
    readonly 4: "1rem";
    readonly 5: "1.25rem";
    readonly 6: "1.5rem";
    readonly 7: "1.75rem";
    readonly 8: "2rem";
    readonly 9: "2.25rem";
    readonly 10: "2.5rem";
    readonly 11: "2.75rem";
    readonly 12: "3rem";
    readonly 14: "3.5rem";
    readonly 16: "4rem";
    readonly 20: "5rem";
    readonly 24: "6rem";
    readonly 28: "7rem";
    readonly 32: "8rem";
    readonly 36: "9rem";
    readonly 40: "10rem";
    readonly 44: "11rem";
    readonly 48: "12rem";
    readonly 52: "13rem";
    readonly 56: "14rem";
    readonly 60: "15rem";
    readonly 64: "16rem";
    readonly 72: "18rem";
    readonly 80: "20rem";
    readonly 96: "24rem";
};
export declare const typography: {
    readonly fontFamily: {
        readonly sans: readonly ["var(--font-sans)", "Inter", "system-ui", "sans-serif"];
        readonly mono: readonly ["var(--font-mono)", "monospace"];
        readonly serif: readonly ["var(--font-serif)", "Times New Roman", "serif"];
        readonly heading: readonly ["var(--font-heading)", "Playfair Display", "serif"];
    };
    readonly fontSize: {
        readonly xs: readonly ["0.75rem", {
            readonly lineHeight: "1rem";
        }];
        readonly sm: readonly ["0.875rem", {
            readonly lineHeight: "1.25rem";
        }];
        readonly base: readonly ["1rem", {
            readonly lineHeight: "1.5rem";
        }];
        readonly lg: readonly ["1.125rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly xl: readonly ["1.25rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly '2xl': readonly ["1.5rem", {
            readonly lineHeight: "2rem";
        }];
        readonly '3xl': readonly ["1.875rem", {
            readonly lineHeight: "2.25rem";
        }];
        readonly '4xl': readonly ["2.25rem", {
            readonly lineHeight: "2.5rem";
        }];
        readonly '5xl': readonly ["3rem", {
            readonly lineHeight: "1";
        }];
        readonly '6xl': readonly ["3.75rem", {
            readonly lineHeight: "1";
        }];
    };
    readonly fontWeight: {
        readonly thin: "100";
        readonly extralight: "200";
        readonly light: "300";
        readonly normal: "400";
        readonly medium: "500";
        readonly semibold: "600";
        readonly bold: "700";
        readonly extrabold: "800";
        readonly black: "900";
    };
    readonly lineHeight: {
        readonly none: "1";
        readonly tight: "1.25";
        readonly snug: "1.375";
        readonly normal: "1.5";
        readonly relaxed: "1.625";
        readonly loose: "2";
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
export declare const radius: {
    readonly none: "0px";
    readonly sm: "calc(var(--radius) - 4px)";
    readonly DEFAULT: "var(--radius)";
    readonly md: "calc(var(--radius) - 2px)";
    readonly lg: "var(--radius)";
    readonly xl: "calc(var(--radius) + 4px)";
    readonly '2xl': "calc(var(--radius) + 8px)";
    readonly '3xl': "calc(var(--radius) + 12px)";
    readonly full: "9999px";
};
export declare const shadows: {
    readonly sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
    readonly DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)";
    readonly md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
    readonly lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
    readonly xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
    readonly '2xl': "0 25px 50px -12px rgb(0 0 0 / 0.25)";
    readonly inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)";
    readonly none: "none";
};
export declare const zIndex: {
    readonly hide: -1;
    readonly base: 0;
    readonly docked: 10;
    readonly dropdown: 1000;
    readonly sticky: 1100;
    readonly banner: 1200;
    readonly overlay: 1300;
    readonly modal: 1400;
    readonly popover: 1500;
    readonly skipLink: 1600;
    readonly toast: 1700;
    readonly tooltip: 1800;
};
export declare const animation: {
    readonly duration: {
        readonly instant: "0ms";
        readonly fastest: "50ms";
        readonly faster: "100ms";
        readonly fast: "150ms";
        readonly normal: "200ms";
        readonly slow: "300ms";
        readonly slower: "400ms";
        readonly slowest: "500ms";
    };
    readonly easing: {
        readonly linear: "linear";
        readonly ease: "ease";
        readonly easeIn: "cubic-bezier(0.4, 0, 1, 1)";
        readonly easeOut: "cubic-bezier(0, 0, 0.2, 1)";
        readonly easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)";
        readonly spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    };
};
export declare const breakpoints: {
    readonly sm: "640px";
    readonly md: "768px";
    readonly lg: "1024px";
    readonly xl: "1280px";
    readonly '2xl': "1400px";
};
export declare const focusRing: {
    readonly DEFAULT: "2px solid hsl(var(--ring))";
    readonly offset: "2px";
    readonly color: "hsl(var(--ring))";
    readonly width: "2px";
    readonly style: "solid";
};
export declare const opacity: {
    readonly 0: "0";
    readonly 5: "0.05";
    readonly 10: "0.1";
    readonly 20: "0.2";
    readonly 25: "0.25";
    readonly 30: "0.3";
    readonly 40: "0.4";
    readonly 50: "0.5";
    readonly 60: "0.6";
    readonly 70: "0.7";
    readonly 75: "0.75";
    readonly 80: "0.8";
    readonly 90: "0.9";
    readonly 95: "0.95";
    readonly 100: "1";
    readonly disabled: "0.5";
    readonly hover: "0.8";
};
