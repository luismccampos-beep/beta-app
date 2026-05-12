import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "../utils/cn";
const getAlignmentClass = (align) => {
    switch (align) {
        case 'left': return 'items-start text-left';
        case 'right': return 'items-end text-right';
        default: return 'items-center text-center';
    }
};
const getFlexAlignment = (align) => {
    switch (align) {
        case 'left': return 'justify-start';
        case 'right': return 'justify-end';
        default: return 'justify-center';
    }
};
const getHeadingSizeClass = (size) => {
    switch (size) {
        case 'sm': return 'text-2xl sm:text-3xl';
        case 'lg': return 'text-4xl sm:text-5xl';
        case 'xl': return 'text-5xl sm:text-6xl lg:text-7xl';
        default: return 'text-3xl sm:text-4xl';
    }
};
const getSubtitleSizeClass = (size) => {
    switch (size) {
        case 'sm': return 'text-sm';
        case 'lg': return 'text-lg sm:text-xl';
        case 'xl': return 'text-xl sm:text-2xl';
        default: return 'text-base sm:text-lg';
    }
};
const getAccentClass = (accentVariant) => {
    switch (accentVariant) {
        case 'underline':
            return [
                'relative inline-block text-foreground',
                'after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full',
                'after:bg-gradient-to-r after:from-blue-500 after:to-violet-500',
                'after:rounded-full',
            ].join(' ');
        case 'highlight':
            return [
                'relative inline-block px-2',
                'before:absolute before:inset-0 before:-skew-x-3',
                'before:bg-gradient-to-r before:from-blue-100 before:to-violet-100',
                'before:dark:from-blue-900/40 before:dark:to-violet-900/40',
                'before:rounded-sm before:-z-10',
                'text-blue-700 dark:text-blue-300',
            ].join(' ');
        case 'default':
            return 'text-foreground';
        default: // 'gradient'
            return [
                'bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600',
                'bg-clip-text text-transparent',
                'dark:from-blue-400 dark:via-violet-400 dark:to-fuchsia-400',
            ].join(' ');
    }
};
const SectionHeader = React.forwardRef(({ titleKey1, titleKey2, subtitleKey, namespace = "common", children, className, accentVariant = 'gradient', align = 'center', size = 'md', showRule = false, ...props }, ref) => {
    const t = useTranslations(namespace);
    const title1 = titleKey1 ? t(titleKey1) : "";
    const title2 = titleKey2 ? t(titleKey2) : "";
    const subtitle = subtitleKey ? t(subtitleKey) : "";
    const alignClass = getAlignmentClass(align);
    const flexAlignment = getFlexAlignment(align);
    const headingSizeClass = getHeadingSizeClass(size);
    const subtitleSizeClass = getSubtitleSizeClass(size);
    const accentClass = getAccentClass(accentVariant);
    return (_jsxs("div", { ref: ref, className: cn('relative flex flex-col gap-3 mb-10', alignClass, className), ...props, children: [_jsxs("div", { className: cn('flex items-center gap-2', flexAlignment), children: [_jsx("span", { className: "inline-block h-px w-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full opacity-70" }), _jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-blue-500 opacity-80" }), _jsx("span", { className: "inline-block h-px w-8 bg-gradient-to-l from-blue-500 to-violet-500 rounded-full opacity-70" })] }), _jsxs("h2", { className: cn('font-extrabold tracking-tight leading-[1.1] text-foreground', headingSizeClass), children: [title1 && _jsxs("span", { children: [title1, " "] }), title2 && _jsx("span", { className: accentClass, children: title2 })] }), showRule && (_jsx("div", { className: cn('flex', flexAlignment), children: _jsx("div", { className: "h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-violet-600" }) })), subtitle && (_jsx("p", { className: cn('text-muted-foreground leading-relaxed max-w-2xl font-normal', subtitleSizeClass, align === 'center' && 'mx-auto', align === 'right' && 'ml-auto'), children: subtitle })), children] }));
});
SectionHeader.displayName = "SectionHeader";
export { SectionHeader };
//# sourceMappingURL=SectionHeader.js.map