import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { cn } from '../../utils/index';
// Animation variants for staggered children
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }
    },
};
export default function SharedPageHeader({ title, subtitle, icon, meta, actions, align = 'center', className, }) {
    const isLeft = align === 'left';
    return (_jsxs(motion.header, { variants: containerVariants, initial: "hidden", animate: "visible", className: cn('relative flex flex-col py-8 md:py-12 border-b border-gray-100 dark:border-gray-800/50 mb-8', isLeft ? 'items-start text-left' : 'items-center text-center', className), children: [_jsx("div", { className: "absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 blur-[120px] pointer-events-none rounded-full" }), icon && (_jsx(motion.div, { variants: itemVariants, className: "mb-6 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-primary shadow-sm ring-1 ring-gray-200 dark:ring-gray-700", children: icon })), _jsxs("div", { className: cn("relative z-10 w-full", isLeft ? "max-w-5xl" : "max-w-3xl"), children: [_jsx(motion.h1, { variants: itemVariants, className: "display-2 text-gray-900 dark:text-white", children: title }), subtitle && (_jsx(motion.p, { variants: itemVariants, className: cn("mt-4 text-xl md:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium opacity-90", !isLeft && "mx-auto"), children: subtitle }))] }), (meta || actions) && (_jsxs(motion.div, { variants: itemVariants, className: cn("mt-8 flex flex-wrap gap-4 items-center w-full", isLeft ? "justify-start" : "justify-center"), children: [meta && _jsx("div", { className: "flex items-center gap-4 text-sm text-gray-500", children: meta }), actions && _jsx("div", { className: "flex flex-wrap items-center gap-3", children: actions })] }))] }));
}
//# sourceMappingURL=SharedPageHeader.js.map