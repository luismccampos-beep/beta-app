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
// ============================================================================
// Color Tokens
// ============================================================================
export const colors = {
    // Semantic Colors
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    // Primary Brand Colors
    primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
    },
    // Secondary Colors
    secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
    },
    // Destructive/Error Colors
    destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
    },
    // Muted/Disabled States
    muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
    },
    // Accent Colors
    accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
    },
    // Popover/Overlay Colors
    popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
    },
    // Card Colors
    card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
    },
    // Border and Ring Colors
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    // Status Colors
    success: {
        DEFAULT: 'hsl(142 76% 36%)',
        foreground: 'hsl(0 0% 100%)',
        light: 'hsl(142 76% 95%)',
    },
    warning: {
        DEFAULT: 'hsl(38 92% 50%)',
        foreground: 'hsl(0 0% 100%)',
        light: 'hsl(38 92% 95%)',
    },
    info: {
        DEFAULT: 'hsl(217 91% 60%)',
        foreground: 'hsl(0 0% 100%)',
        light: 'hsl(217 91% 95%)',
    },
};
// ============================================================================
// Spacing Tokens
// ============================================================================
export const spacing = {
    0: '0px',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
};
// ============================================================================
// Typography Tokens
// ============================================================================
export const typography = {
    fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        serif: ['var(--font-serif)', 'Times New Roman', 'serif'],
        heading: ['var(--font-heading)', 'Playfair Display', 'serif'],
    },
    fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
    },
    fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
    },
    lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
    },
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },
};
// ============================================================================
// Border Radius Tokens
// ============================================================================
export const radius = {
    none: '0px',
    sm: 'calc(var(--radius) - 4px)',
    DEFAULT: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    xl: 'calc(var(--radius) + 4px)',
    '2xl': 'calc(var(--radius) + 8px)',
    '3xl': 'calc(var(--radius) + 12px)',
    full: '9999px',
};
// ============================================================================
// Shadow Tokens
// ============================================================================
export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
};
// ============================================================================
// Z-Index Tokens
// ============================================================================
export const zIndex = {
    hide: -1,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
};
// ============================================================================
// Animation Tokens
// ============================================================================
export const animation = {
    duration: {
        instant: '0ms',
        fastest: '50ms',
        faster: '100ms',
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
        slower: '400ms',
        slowest: '500ms',
    },
    easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
};
// ============================================================================
// Breakpoint Tokens
// ============================================================================
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
};
// ============================================================================
// Focus Ring Tokens (Accessibility)
// ============================================================================
export const focusRing = {
    DEFAULT: '2px solid hsl(var(--ring))',
    offset: '2px',
    color: 'hsl(var(--ring))',
    width: '2px',
    style: 'solid',
};
// ============================================================================
// Opacity Tokens
// ============================================================================
export const opacity = {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1',
    disabled: '0.5',
    hover: '0.8',
};
//# sourceMappingURL=index.js.map