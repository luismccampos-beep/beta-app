"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui';
import { cn } from '../../../utils';
export const FAQSection = ({ faqs, title = 'Perguntas Frequentes', description, icon: Icon = HelpCircle, variant = 'default', categories, className, onCategoryChange }) => {
    const [openItems, setOpenItems] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const filteredFaqs = React.useMemo(() => {
        if (!selectedCategory || !categories)
            return faqs;
        return faqs.filter(faq => faq.category === selectedCategory);
    }, [faqs, selectedCategory, categories]);
    const toggleItem = (itemId) => {
        setOpenItems(prev => prev.includes(itemId)
            ? prev.filter(id => id !== itemId)
            : [...prev, itemId]);
    };
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setOpenItems([]);
        onCategoryChange?.(category);
    };
    const getVariantStyles = () => {
        switch (variant) {
            case 'compact':
                return 'space-y-2';
            case 'expanded':
                return 'space-y-6';
            default:
                return 'space-y-4';
        }
    };
    const getItemStyles = () => {
        switch (variant) {
            case 'compact':
                return 'p-3 text-sm';
            case 'expanded':
                return 'p-6 text-lg';
            default:
                return 'p-4 text-base';
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: cn('w-full max-w-4xl mx-auto', className), children: [(title || description) && (_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [_jsx(Icon, { className: "h-6 w-6 text-primary" }), _jsx("h2", { className: "text-2xl font-bold", children: title })] }), description && (_jsx("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: description }))] })), categories && categories.length > 0 && (_jsxs("div", { className: "flex flex-wrap gap-2 justify-center mb-6", children: [_jsx("button", { onClick: () => handleCategoryChange(null), className: cn('px-4 py-2 rounded-full text-sm font-medium transition-colors', selectedCategory === null
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'), children: "Todas" }), categories.map(category => (_jsx("button", { onClick: () => handleCategoryChange(category), className: cn('px-4 py-2 rounded-full text-sm font-medium transition-colors', selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'), children: category }, category)))] })), _jsx("div", { className: cn(getVariantStyles()), children: filteredFaqs.map((faq, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.1 }, children: variant === 'compact' ? (
                    // Compact variant - custom accordion
                    _jsxs("div", { className: "border rounded-lg bg-card", children: [_jsxs("button", { onClick: () => toggleItem(faq.id), className: "w-full flex items-center justify-between text-left p-3 hover:bg-accent transition-colors", children: [_jsx("span", { className: "font-medium", children: faq.question }), openItems.includes(faq.id) ? (_jsx(ChevronUp, { className: "h-4 w-4" })) : (_jsx(ChevronDown, { className: "h-4 w-4" }))] }), openItems.includes(faq.id) && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, transition: { duration: 0.3 }, className: "overflow-hidden", children: _jsx("div", { className: "p-3 pt-0 text-muted-foreground", children: faq.answer }) }))] })) : (
                    // Default/Expanded variants - use Accordion
                    _jsx(Accordion, { type: "single", collapsible: true, className: "border rounded-lg bg-card", children: _jsxs(AccordionItem, { value: faq.id, children: [_jsx(AccordionTrigger, { className: cn('hover:no-underline', getItemStyles()), children: _jsx("span", { className: "text-left", children: faq.question }) }), _jsx(AccordionContent, { className: cn('text-muted-foreground', variant === 'expanded' ? 'text-base pb-6' : 'text-sm pb-4'), children: faq.answer })] }) })) }, faq.id))) }), filteredFaqs.length === 0 && (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-muted-foreground", children: "Nenhuma pergunta encontrada para esta categoria." }) }))] }));
};
/** @alias */
export default FAQSection;
//# sourceMappingURL=index.js.map