"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Check, Globe, Languages } from 'lucide-react';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
export var LanguageSwitcherSize;
(function (LanguageSwitcherSize) {
    LanguageSwitcherSize["SMALL"] = "small";
    LanguageSwitcherSize["MEDIUM"] = "medium";
    LanguageSwitcherSize["LARGE"] = "large";
})(LanguageSwitcherSize || (LanguageSwitcherSize = {}));
export var LanguageSwitcherVariant;
(function (LanguageSwitcherVariant) {
    LanguageSwitcherVariant["GHOST"] = "ghost";
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
const LanguageSwitcher = ({ size = LanguageSwitcherSize.MEDIUM, showLabel = true, variant = LanguageSwitcherVariant.GHOST, className = '', useGlobeIcon = true, onLanguageChange, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, }) => {
    const t = useTranslations('language');
    const locale = useLocale();
    const [isChanging, setIsChanging] = useState(false);
    const supportedLanguages = getSupportedLanguages();
    const currentLanguage = supportedLanguages.find((lang) => lang.code === locale) || supportedLanguages[0];
    const handleLanguageChange = async (languageCode) => {
        if (languageCode === locale || isChanging)
            return;
        setIsChanging(true);
        try {
            document.cookie = `NEXT_LOCALE=${languageCode}; path=/; max-age=${60 * 60 * 24 * 365}`;
            // Store preference in localStorage
            const globalObj = globalThis;
            globalObj.localStorage?.setItem?.('preferred-language', languageCode);
            // Call custom callback if provided
            onLanguageChange?.(languageCode);
            globalThis.location?.reload?.();
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
        return (_jsxs("div", { className: `flex items-center gap-2 ${className}`, children: [_jsx(Icon, { className: getIconSize(size) }), showLabel && (_jsxs("span", { className: 'flex items-center gap-1 text-sm font-medium', children: [_jsx("span", { children: currentLanguage.flag }), _jsx("span", { className: 'hidden sm:inline', children: currentLanguage.code.toUpperCase() })] }))] }));
    }
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: variant, size: getButtonSize(size), className: `flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-primary/40 rounded-lg bg-gradient-to-br from-white/30 via-white/10 to-white/5 backdrop-blur-sm ${className}`, disabled: isChanging, "aria-label": t('select') || 'Select language', children: [_jsx(Icon, { className: getIconSize(size) }), showLabel && (_jsxs("span", { className: 'flex items-center gap-1 text-sm font-medium', children: [_jsx("span", { children: currentLanguage.flag }), _jsx("span", { className: 'hidden sm:inline', children: currentLanguage.code.toUpperCase() })] }))] }) }), _jsx(DropdownMenuContent, { align: 'end', sideOffset: 6, children: _jsx(motion.div, { initial: { opacity: 0, y: -12, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -12, scale: 0.95 }, transition: { duration: 0.25, ease: 'easeOut' }, className: 'bg-gradient-to-tr from-white/30 via-white/10 to-white/5 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden', children: supportedLanguages.map((language) => {
                        const isActive = currentLanguage.code === language.code;
                        return (_jsx(DropdownMenuItem, { onClick: () => handleLanguageChange(language.code), disabled: isChanging, "aria-checked": isActive, className: 'p-0', children: _jsxs(motion.div, { whileHover: { scale: 1.03, background: 'rgba(255,255,255,0.05)' }, whileTap: { scale: 0.97 }, className: `flex items-center justify-between gap-3 px-4 py-2 cursor-pointer transition-all rounded-lg ${isActive
                                    ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 shadow-md font-semibold text-primary'
                                    : 'hover:bg-white/10 text-foreground/90'}`, children: [_jsxs("div", { className: 'flex items-center gap-2', children: [_jsx("span", { className: 'text-xl', children: language.flag }), _jsx("span", { children: language.name })] }), isActive && _jsx(Check, { className: 'h-5 w-5 text-primary' })] }) }, language.code));
                    }) }) })] }));
};
export default LanguageSwitcher;
//# sourceMappingURL=LanguageSwitcher.js.map