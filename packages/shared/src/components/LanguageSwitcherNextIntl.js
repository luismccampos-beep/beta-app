"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, Globe, Languages } from 'lucide-react';
import { useState } from 'react';
export var LanguageSwitcherSize;
(function (LanguageSwitcherSize) {
    LanguageSwitcherSize["SMALL"] = "small";
    LanguageSwitcherSize["MEDIUM"] = "medium";
    LanguageSwitcherSize["LARGE"] = "large";
})(LanguageSwitcherSize || (LanguageSwitcherSize = {}));
export var LanguageSwitcherVariant;
(function (LanguageSwitcherVariant) {
    LanguageSwitcherVariant["DEFAULT"] = "default";
    LanguageSwitcherVariant["GHOST"] = "ghost";
    LanguageSwitcherVariant["OUTLINE"] = "outline";
})(LanguageSwitcherVariant || (LanguageSwitcherVariant = {}));
const getSupportedLanguages = () => {
    return [
        { code: 'pt', name: 'Português', flag: '🇵🇹' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
    ];
};
const getButtonSize = (size) => {
    switch (size) {
        case LanguageSwitcherSize.SMALL:
            return 'sm';
        case LanguageSwitcherSize.LARGE:
            return 'lg';
        default:
            return 'default';
    }
};
const getIconSize = (size) => {
    switch (size) {
        case LanguageSwitcherSize.SMALL:
            return 'h-4 w-4';
        case LanguageSwitcherSize.LARGE:
            return 'h-6 w-6';
        default:
            return 'h-5 w-5';
    }
};
const LanguageSwitcher = ({ size = LanguageSwitcherSize.MEDIUM, showLabel = true, variant = LanguageSwitcherVariant.GHOST, className = '', useGlobeIcon = true, onLanguageChange, pathname: pathnameProp, navigate, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, }) => {
    const [isChanging, setIsChanging] = useState(false);
    const safePathname = pathnameProp ?? (typeof window !== 'undefined' ? window.location.pathname : '');
    const supportedLanguages = getSupportedLanguages();
    // Get current language from pathname
    const getCurrentLanguage = () => {
        const segments = safePathname.split('/').filter(Boolean);
        const langCode = segments[0];
        const currentLang = supportedLanguages.find((lang) => lang.code === langCode);
        return currentLang || supportedLanguages[0];
    };
    const currentLanguage = getCurrentLanguage();
    const handleLanguageChange = async (languageCode) => {
        if (languageCode === currentLanguage.code || isChanging)
            return;
        setIsChanging(true);
        try {
            // Store preference in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('preferred-language', languageCode);
            }
            // Navigate to new language
            const segments = safePathname.split('/').filter(Boolean);
            if (supportedLanguages.find(lang => lang.code === segments[0])) {
                // Replace existing language
                segments[0] = languageCode;
            }
            else {
                // Add language to beginning
                segments.unshift(languageCode);
            }
            const newPath = '/' + segments.join('/');
            if (navigate) {
                navigate(newPath);
            }
            else if (typeof window !== 'undefined') {
                window.location.assign(newPath);
            }
            // Call custom callback if provided
            onLanguageChange?.(languageCode);
        }
        catch (error) {
            console.error('Error changing language:', error);
        }
        finally {
            setIsChanging(false);
        }
    };
    const Icon = useGlobeIcon ? Globe : Languages;
    // If UI components are not provided, return a minimal version
    if (!Button || !DropdownMenu || !DropdownMenuContent || !DropdownMenuItem || !DropdownMenuTrigger) {
        return (_jsxs("div", { className: `flex items-center gap-2 ${className}`, children: [_jsx(Icon, { className: getIconSize(size) }), showLabel && _jsx("span", { className: "text-sm font-medium", children: currentLanguage.name })] }));
    }
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: variant, size: getButtonSize(size), className: `flex items-center gap-2 ${className}`, disabled: isChanging, children: [_jsx(Icon, { className: getIconSize(size) }), showLabel && (_jsx("span", { className: "text-sm font-medium", children: currentLanguage.name })), currentLanguage.flag && _jsx("span", { children: currentLanguage.flag })] }) }), _jsx(DropdownMenuContent, { align: "end", className: "w-48", children: supportedLanguages.map((language) => (_jsxs(DropdownMenuItem, { onClick: () => handleLanguageChange(language.code), className: "flex items-center gap-3 cursor-pointer", disabled: isChanging, children: [_jsx("span", { children: language.flag }), _jsx("span", { className: "flex-1", children: language.name }), language.code === currentLanguage.code && (_jsx(Check, { className: "h-4 w-4 text-primary" }))] }, language.code))) })] }));
};
export default LanguageSwitcher;
//# sourceMappingURL=LanguageSwitcherNextIntl.js.map