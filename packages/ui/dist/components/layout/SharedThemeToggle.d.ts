type ThemeToggleState = 'light' | 'dark' | 'system';
interface SharedThemeToggleProps {
    theme?: ThemeToggleState;
    isDark?: boolean;
    onToggleTheme?: () => void;
    onChangeTheme?: (theme: ThemeToggleState) => void;
    t?: (key: string, defaultValue?: string) => string;
}
export default function SharedThemeToggle({ theme, isDark, onToggleTheme, onChangeTheme, t, }: SharedThemeToggleProps): import("react/jsx-runtime").JSX.Element;
export {};
