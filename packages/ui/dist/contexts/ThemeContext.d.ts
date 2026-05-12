import React from 'react';
export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
    destructive: string;
    destructiveForeground: string;
}
export interface AgencyTheme {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
    cssVariables: Record<string, string>;
}
export interface ThemeContextType {
    theme: ThemeColors;
    agencyTheme: AgencyTheme | null;
    setAgencyTheme: (theme: AgencyTheme) => void;
    applyTheme: (colors: Partial<ThemeColors>) => void;
    resetTheme: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}
export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultAgencyTheme?: AgencyTheme | null;
    enableDarkMode?: boolean;
}
export declare function ThemeProvider({ children, defaultAgencyTheme, enableDarkMode }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useTheme(): ThemeContextType;
export declare function useAgencyColors(): {
    primary: string;
    secondary: string;
    accent: string;
    logo: null;
} | {
    primary: string;
    secondary: string;
    accent: string;
    logo: string | undefined;
};
export declare function useThemeClasses(): {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
    destructive: string;
    destructiveForeground: string;
};
