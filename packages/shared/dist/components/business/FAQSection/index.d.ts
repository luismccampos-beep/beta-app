import React from 'react';
export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category?: string;
}
export interface FAQSectionProps {
    faqs: FAQItem[];
    title?: string;
    description?: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    variant?: 'default' | 'compact' | 'expanded';
    categories?: string[];
    className?: string;
    onCategoryChange?: (category: string | null) => void;
}
export declare const FAQSection: React.FC<FAQSectionProps>;
/** @alias */
export default FAQSection;
