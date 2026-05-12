export declare enum LanguageSwitcherSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}
export declare enum LanguageSwitcherVariant {
    GHOST = "ghost"
}
export interface Language {
    code: string;
    name: string;
    flag: string;
}
export interface LanguageSwitcherProps {
    size?: LanguageSwitcherSize;
    showLabel?: boolean;
    variant?: LanguageSwitcherVariant;
    className?: string;
    useGlobeIcon?: boolean;
    onLanguageChange?: (languageCode: string) => void;
    Button?: React.ComponentType<Record<string, unknown>>;
    DropdownMenu?: React.ComponentType<Record<string, unknown>>;
    DropdownMenuContent?: React.ComponentType<Record<string, unknown>>;
    DropdownMenuItem?: React.ComponentType<Record<string, unknown>>;
    DropdownMenuTrigger?: React.ComponentType<Record<string, unknown>>;
}
declare const LanguageSwitcher: React.FC<LanguageSwitcherProps>;
export default LanguageSwitcher;
