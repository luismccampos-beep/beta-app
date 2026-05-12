"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui';
import { cn } from '../../../utils';

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
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'compact' | 'expanded';
  categories?: string[];
  className?: string;
  onCategoryChange?: (category: string | null) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  faqs,
  title = 'Perguntas Frequentes',
  description,
  icon: Icon = HelpCircle,
  variant = 'default',
  categories,
  className,
  onCategoryChange
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredFaqs = React.useMemo(() => {
    if (!selectedCategory || !categories) return faqs;
    return faqs.filter(faq => faq.category === selectedCategory);
  }, [faqs, selectedCategory, categories]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCategoryChange = (category: string | null) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('w-full max-w-4xl mx-auto', className)}
    >
      {/* Header */}
      {(title || description) && (
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button
            onClick={() => handleCategoryChange(null)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            Todas
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* FAQ Items */}
      <div className={cn(getVariantStyles())}>
        {filteredFaqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {variant === 'compact' ? (
              // Compact variant - custom accordion
              <div className="border rounded-lg bg-card">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-center justify-between text-left p-3 hover:bg-accent transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  {openItems.includes(faq.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {openItems.includes(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-0 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              // Default/Expanded variants - use Accordion
              <Accordion type="single" collapsible className="border rounded-lg bg-card">
                <AccordionItem value={faq.id}>
                  <AccordionTrigger className={cn(
                    'hover:no-underline',
                    getItemStyles()
                  )}>
                    <span className="text-left">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className={cn(
                    'text-muted-foreground',
                    variant === 'expanded' ? 'text-base pb-6' : 'text-sm pb-4'
                  )}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredFaqs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma pergunta encontrada para esta categoria.
          </p>
        </div>
      )}
    </motion.div>
  );
};

/** @alias */
export default FAQSection;
