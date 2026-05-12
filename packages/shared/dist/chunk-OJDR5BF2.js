// src/themes/tokens.ts
var colors = {
  primary: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    // Cor base
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12"
  },
  secondary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    // Cor base
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e"
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    // Cor base
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827"
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#16a34a",
    // Cor base
    600: "#15803d",
    700: "#166534",
    800: "#14532d",
    900: "#052e16"
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#d97706",
    // Cor base
    600: "#b45309",
    700: "#92400e",
    800: "#78350f",
    900: "#451a03"
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#dc2626",
    // Cor base
    600: "#b91c1c",
    700: "#991b1b",
    800: "#7f1d1d",
    900: "#450a0a"
  },
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    // Cor base
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a"
  }
};
var spacing = {
  0: "0px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  11: "44px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
  44: "176px",
  48: "192px",
  52: "208px",
  56: "224px",
  60: "240px",
  64: "256px",
  72: "288px",
  80: "320px",
  96: "384px"
};
var radii = {
  none: "0px",
  sm: "2px",
  base: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  "3xl": "24px",
  full: "9999px"
};
var typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
    "6xl": "60px",
    "7xl": "72px",
    "8xl": "96px",
    "9xl": "128px"
  },
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  }
};
var breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px"
};
var shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
};
var zIndex = {
  base: 0,
  dropdown: 1e3,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070
};
var durations = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  slower: "500ms"
};
var easings = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out"
};
var semanticColors = {
  text: {
    primary: colors.gray[900],
    secondary: colors.gray[600],
    tertiary: colors.gray[500],
    disabled: colors.gray[400],
    inverse: "#ffffff"
  },
  background: {
    primary: "#ffffff",
    secondary: colors.gray[50],
    tertiary: colors.gray[100],
    inverse: colors.gray[900]
  },
  border: {
    default: colors.gray[200],
    hover: colors.gray[300],
    focus: colors.primary[500]
  },
  action: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    secondary: colors.secondary[500],
    secondaryHover: colors.secondary[600],
    disabled: colors.gray[300]
  },
  status: {
    success: colors.success[500],
    warning: colors.warning[500],
    danger: colors.danger[500],
    info: colors.info[500]
  }
};

// src/themes/createTheme.ts
function generateSemanticPalette(palette) {
  return {
    text: {
      primary: palette.foreground,
      secondary: palette.mutedForeground,
      tertiary: colors.gray[500],
      disabled: colors.gray[400],
      inverse: palette.background
    },
    background: {
      primary: palette.background,
      secondary: palette.muted,
      tertiary: colors.gray[100],
      inverse: palette.foreground
    },
    border: {
      default: palette.border,
      hover: colors.gray[300],
      focus: typeof palette.primary === "string" ? palette.primary : colors.primary[500]
    },
    action: {
      primary: typeof palette.primary === "string" ? palette.primary : colors.primary[500],
      primaryHover: typeof palette.primary === "string" ? palette.primary : colors.primary[600],
      secondary: typeof palette.secondary === "string" ? palette.secondary : colors.secondary?.[500] || colors.gray[500],
      secondaryHover: typeof palette.secondary === "string" ? palette.secondary : colors.secondary?.[600] || colors.gray[600],
      disabled: colors.gray[300]
    },
    status: {
      success: typeof palette.success === "string" ? palette.success : colors.success[500],
      warning: typeof palette.warning === "string" ? palette.warning : colors.warning[500],
      danger: typeof palette.danger === "string" ? palette.danger : colors.danger[500],
      info: typeof palette.info === "string" ? palette.info : colors.info?.[500] || colors.secondary[500]
    }
  };
}
var defaultLightPalette = {
  background: "#ffffff",
  foreground: "#0f172a",
  muted: "#f1f5f9",
  mutedForeground: "#64748b",
  border: "#e2e8f0",
  primary: colors.primary[600],
  primaryForeground: "#ffffff",
  secondary: colors.secondary[500],
  secondaryForeground: "#ffffff",
  success: colors.success[500],
  successForeground: "#ffffff",
  warning: colors.warning[500],
  warningForeground: "#ffffff",
  danger: colors.danger[500],
  dangerForeground: "#ffffff",
  info: colors.info[500],
  infoForeground: "#ffffff",
  accent: colors.primary[500],
  accentForeground: "#ffffff",
  gray: colors.gray
};
var defaultDarkPalette = {
  background: "#0f172a",
  foreground: "#f8fafc",
  muted: "#1e293b",
  mutedForeground: "#94a3b8",
  border: "#334155",
  primary: colors.primary[500],
  primaryForeground: "#ffffff",
  secondary: colors.secondary[400],
  secondaryForeground: "#ffffff",
  success: colors.success[400],
  successForeground: "#ffffff",
  warning: colors.warning[400],
  warningForeground: "#ffffff",
  danger: colors.danger[400],
  dangerForeground: "#ffffff",
  info: colors.info[400],
  infoForeground: "#ffffff",
  accent: colors.primary[400],
  accentForeground: "#ffffff",
  gray: colors.gray
};
function createTheme(options) {
  const {
    name,
    palette: customPalette,
    mode = "light",
    spacing: customSpacing,
    radii: customRadii,
    typography: customTypography,
    breakpoints: customBreakpoints,
    shadows: customShadows,
    zIndex: customZIndex,
    durations: customDurations,
    easings: customEasings,
    generateSemantic = true
  } = options;
  const basePalette = mode === "dark" ? defaultDarkPalette : defaultLightPalette;
  const palette = {
    ...basePalette,
    ...customPalette
  };
  const theme2 = {
    name,
    mode,
    palette,
    spacing: customSpacing ? { ...spacing, ...customSpacing } : spacing,
    radii: customRadii ? { ...radii, ...customRadii } : radii,
    typography: customTypography ? { ...typography, ...customTypography } : typography,
    breakpoints: customBreakpoints ? { ...breakpoints, ...customBreakpoints } : breakpoints,
    shadows: customShadows ? { ...shadows, ...customShadows } : shadows,
    zIndex: customZIndex ? { ...zIndex, ...customZIndex } : zIndex,
    durations: customDurations ? { ...durations, ...customDurations } : durations,
    easings: customEasings ? { ...easings, ...customEasings } : easings,
    colors
  };
  if (generateSemantic) {
    theme2.semantic = generateSemanticPalette(palette);
  }
  return theme2;
}
function createLightTheme(options) {
  return createTheme({ ...options, mode: "light" });
}
function createDarkTheme(options) {
  return createTheme({ ...options, mode: "dark" });
}
function createThemePair(options) {
  const { baseName, ...themeOptions } = options;
  return {
    light: createLightTheme({
      ...themeOptions,
      name: `${baseName}-light`
    }),
    dark: createDarkTheme({
      ...themeOptions,
      name: `${baseName}-dark`
    })
  };
}
function extendTheme(baseTheme, overrides) {
  return createTheme({
    name: overrides.name || `${baseTheme.name}-extended`,
    mode: overrides.mode || baseTheme.mode,
    palette: {
      ...baseTheme.palette,
      ...overrides.palette
    },
    spacing: overrides.spacing ? { ...baseTheme.spacing, ...overrides.spacing } : baseTheme.spacing,
    radii: overrides.radii ? { ...baseTheme.radii, ...overrides.radii } : baseTheme.radii,
    typography: overrides.typography ? { ...baseTheme.typography, ...overrides.typography } : baseTheme.typography,
    breakpoints: overrides.breakpoints,
    shadows: overrides.shadows,
    zIndex: overrides.zIndex,
    durations: overrides.durations,
    easings: overrides.easings,
    generateSemantic: overrides.generateSemantic
  });
}
function validateTheme(theme2) {
  const errors = [];
  if (!theme2.name) {
    errors.push("Theme must have a name");
  }
  const requiredPaletteKeys = [
    "background",
    "foreground",
    "primary",
    "primaryForeground"
  ];
  requiredPaletteKeys.forEach((key) => {
    if (!theme2.palette[key]) {
      errors.push(`Palette missing required key: ${String(key)}`);
    }
  });
  if (!theme2.spacing || Object.keys(theme2.spacing).length === 0) {
    errors.push("Theme must have spacing defined");
  }
  if (!theme2.typography) {
    errors.push("Theme must have typography defined");
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

// src/themes/presets.ts
var lightTheme = createTheme({
  name: "light",
  palette: {
    background: "#ffffff",
    foreground: "#0f172a",
    muted: "#f1f5f9",
    mutedForeground: "#475569",
    border: "#e2e8f0",
    primary: colors.primary[600],
    primaryForeground: "#ffffff",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626"
  }
});
var darkTheme = createTheme({
  name: "dark",
  palette: {
    background: "#0b1020",
    foreground: "#e2e8f0",
    muted: "#111827",
    mutedForeground: "#94a3b8",
    border: "#1f2937",
    primary: colors.primary[500],
    primaryForeground: "#ffffff",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444"
  }
});

// src/themes/cssVars.ts
function toKebabCase(input) {
  return input.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
}
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function processNested(obj, baseKey, prefix) {
  const vars = {};
  Object.entries(obj).forEach(([key, value]) => {
    const varKey = `--${prefix}${baseKey}-${toKebabCase(key)}`;
    if (isPlainObject(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        const nestedVarKey = `${varKey}-${toKebabCase(nestedKey)}`;
        vars[nestedVarKey] = String(nestedValue);
      });
    } else {
      vars[varKey] = String(value);
    }
  });
  return vars;
}
function themeToCssVars(theme2, options = {}) {
  const prefix = options.prefix ? `${options.prefix}-` : "";
  const vars = {};
  if (theme2.palette) {
    Object.assign(vars, processNested(theme2.palette, "color", prefix));
  }
  if (theme2.spacing) {
    Object.entries(theme2.spacing).forEach(([key, value]) => {
      vars[`--${prefix}space-${key}`] = String(value);
    });
  }
  if (theme2.radii) {
    Object.entries(theme2.radii).forEach(([key, value]) => {
      vars[`--${prefix}radius-${toKebabCase(key)}`] = String(value);
    });
  }
  if (theme2.typography) {
    const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } = theme2.typography;
    if (fontFamily) {
      if (isPlainObject(fontFamily)) {
        Object.entries(fontFamily).forEach(([key, value]) => {
          vars[`--${prefix}font-family-${toKebabCase(key)}`] = String(value);
        });
      } else {
        vars[`--${prefix}font-family`] = String(fontFamily);
      }
    }
    if (fontSize) {
      Object.entries(fontSize).forEach(([key, value]) => {
        vars[`--${prefix}font-size-${toKebabCase(key)}`] = String(value);
      });
    }
    if (fontWeight) {
      Object.entries(fontWeight).forEach(([key, value]) => {
        vars[`--${prefix}font-weight-${toKebabCase(key)}`] = String(value);
      });
    }
    if (lineHeight) {
      Object.entries(lineHeight).forEach(([key, value]) => {
        vars[`--${prefix}line-height-${toKebabCase(key)}`] = String(value);
      });
    }
    if (letterSpacing) {
      Object.entries(letterSpacing).forEach(([key, value]) => {
        vars[`--${prefix}letter-spacing-${toKebabCase(key)}`] = String(value);
      });
    }
  }
  if (theme2.breakpoints) {
    Object.entries(theme2.breakpoints).forEach(([key, value]) => {
      vars[`--${prefix}breakpoint-${toKebabCase(key)}`] = String(value);
    });
  }
  if (theme2.shadows) {
    Object.entries(theme2.shadows).forEach(([key, value]) => {
      vars[`--${prefix}shadow-${toKebabCase(key)}`] = String(value);
    });
  }
  if (theme2.zIndex) {
    Object.entries(theme2.zIndex).forEach(([key, value]) => {
      vars[`--${prefix}z-index-${toKebabCase(key)}`] = String(value);
    });
  }
  if (theme2.durations) {
    Object.entries(theme2.durations).forEach(([key, value]) => {
      vars[`--${prefix}duration-${toKebabCase(key)}`] = String(value);
    });
  }
  if (theme2.easings) {
    Object.entries(theme2.easings).forEach(([key, value]) => {
      vars[`--${prefix}easing-${toKebabCase(key)}`] = String(value);
    });
  }
  return vars;
}
function cssVarsString(vars, options = {}) {
  const { indent = "  ", includeComments = false } = options;
  let result = Object.entries(vars).map(([key, value]) => `${indent}${key}: ${value};`).join("\n");
  if (includeComments) {
    result = `${indent}/* Auto-generated CSS variables from theme */
${result}`;
  }
  return result;
}
function generateThemeCss(theme2, options = {}) {
  const vars = themeToCssVars(theme2, options);
  const cssVars = cssVarsString(vars, { includeComments: options.includeComments });
  return `:root {
${cssVars}
}`;
}
function cssVar(name, fallback, prefix = "akm") {
  const varName = name.startsWith("--") ? name : `--${prefix}-${name}`;
  return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`;
}
function extractCssVars(element = document.documentElement) {
  const styles = getComputedStyle(element);
  const vars = {};
  Array.from(styles).forEach((property) => {
    if (property.startsWith("--")) {
      vars[property] = styles.getPropertyValue(property).trim();
    }
  });
  return vars;
}

// src/themes/adapter.ts
function adaptLegacyTheme(name, legacy) {
  const palette = {
    primary: legacy.primaryColor,
    primaryForeground: "#ffffff",
    background: "#ffffff",
    foreground: legacy.secondaryColor ?? "#0f172a",
    muted: "#f1f5f9",
    mutedForeground: "#475569",
    border: "#e2e8f0",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626"
  };
  return createTheme({ name, palette });
}

// src/themes/themeTypes.ts
var THEME_TYPES = {
  dark: "dark",
  light: "light",
  auto: "auto"
};

// src/themes/theme.ts
var theme = {
  primaryColor: "#0070f3",
  secondaryColor: "#1c1c1c"
};

export {
  colors,
  spacing,
  radii,
  typography,
  breakpoints,
  shadows,
  zIndex,
  durations,
  easings,
  semanticColors,
  createTheme,
  createLightTheme,
  createDarkTheme,
  createThemePair,
  extendTheme,
  validateTheme,
  lightTheme,
  darkTheme,
  themeToCssVars,
  cssVarsString,
  generateThemeCss,
  cssVar,
  extractCssVars,
  adaptLegacyTheme,
  THEME_TYPES,
  theme
};
//# sourceMappingURL=chunk-OJDR5BF2.js.map