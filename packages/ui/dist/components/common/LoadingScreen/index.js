import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../../utils';
const SIZE_CLASSES = {
    sm: { screen: 'h-6 w-6', spinner: 'h-4 w-4' },
    md: { screen: 'h-8 w-8', spinner: 'h-6 w-6' },
    lg: { screen: 'h-12 w-12', spinner: 'h-8 w-8' },
};
function getSizeClasses(size) {
    switch (size) {
        case 'sm':
            return SIZE_CLASSES.sm;
        case 'lg':
            return SIZE_CLASSES.lg;
        default:
            return SIZE_CLASSES.md;
    }
}
export const LoadingScreen = ({ message = 'Carregando...', className, icon: Icon = Sparkles, size = 'md', }) => {
    const { screen: iconSize } = getSizeClasses(size);
    return (_jsx("div", { className: cn('min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center', className), children: _jsxs("div", { className: "text-center", children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' }, className: "inline-block", children: _jsx(Icon, { className: cn('text-primary', iconSize) }) }), _jsx("p", { className: "mt-4 text-muted-foreground", children: message })] }) }));
};
/** @alias */
export default LoadingScreen;
export const LoadingSpinner = ({ className, size = 'md', text, }) => {
    const { spinner: spinnerSize } = getSizeClasses(size);
    return (_jsxs("div", { className: cn('flex items-center justify-center', className), children: [_jsx("div", { className: cn('animate-spin rounded-full border-2 border-gray-300 border-t-primary', spinnerSize) }), text && (_jsx("span", { className: "ml-2 text-sm text-muted-foreground", children: text }))] }));
};
//# sourceMappingURL=index.js.map