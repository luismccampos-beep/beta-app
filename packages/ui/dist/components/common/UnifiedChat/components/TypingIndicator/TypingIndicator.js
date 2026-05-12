import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useTranslations } from 'next-intl'; // 1. Migrated to next-intl
import { cn } from '../../../../../utils/cn';
export const TypingIndicator = React.memo(() => {
    // 1. Initialized useTranslations with the 'chat' namespace
    const t = useTranslations('chat');
    return (_jsxs("div", { className: "flex items-end gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500", role: "status", "aria-live": "polite", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex-shrink-0 animate-subtle-pulse" }), _jsxs("div", { className: cn("relative flex items-center gap-1.5 px-4 py-3.5", 
                // 3. Adjusted background for better visual hierarchy
                "bg-gray-100 dark:bg-gray-800", "border border-gray-200 dark:border-gray-700/60", "rounded-2xl rounded-bl-none shadow-sm"), children: [_jsxs("div", { className: "flex gap-1.5", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-typing-wave [animation-delay:0ms]" }), _jsx("span", { className: "w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-typing-wave [animation-delay:200ms]" }), _jsx("span", { className: "w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-typing-wave [animation-delay:400ms]" })] }), _jsx("div", { className: "absolute inset-0 rounded-2xl rounded-bl-none bg-gradient-to-b from-white/30 to-transparent dark:from-white/5 pointer-events-none" }), _jsx("span", { className: "sr-only", children: t('typing') })] })] }));
});
TypingIndicator.displayName = 'TypingIndicator';
//# sourceMappingURL=TypingIndicator.js.map