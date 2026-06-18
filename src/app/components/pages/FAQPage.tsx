import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useTranslations } from 'next-intl';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Plane,
  CreditCard,
  XCircle,
  Shield,
  Globe,
  FileText
} from 'lucide-react';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';

interface FAQPageProps {
  onBack: () => void;
}

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  faqs: FAQ[];
}

export function FAQPage({ onBack }: FAQPageProps) {
  const t = useTranslations('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());

  const toggleFAQ = (id: string) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(id)) {
      newOpenFAQs.delete(id);
    } else {
      newOpenFAQs.add(id);
    }
    setOpenFAQs(newOpenFAQs);
  };

  const categories = useMemo(() => {
    const raw = t.raw('categories') as unknown;
    return (Array.isArray(raw) ? raw : []) as FAQCategory[];
  }, [t]);

  const categoryMeta = useMemo(() => {
    return {
      booking: { icon: Plane, bgClass: 'from-teal-600 to-teal-500' },
      payment: { icon: CreditCard, bgClass: 'from-blue-600 to-blue-500' },
      cancellation: { icon: XCircle, bgClass: 'from-orange-600 to-orange-500' },
      safety: { icon: Shield, bgClass: 'from-green-600 to-green-500' },
      travel: { icon: Globe, bgClass: 'from-purple-600 to-purple-500' },
      general: { icon: FileText, bgClass: 'from-gray-700 to-gray-600' }
    } as const;
  }, []);

  const searchTerms = searchQuery.toLowerCase().split(' ').filter(Boolean);

  const filteredCategories = useMemo(() => {
    if (!searchQuery && activeCategory === 'all') return categories;
    return categories
      .map(cat => {
        if (activeCategory !== 'all' && cat.id !== activeCategory) return null;
        if (!searchQuery) return cat;
        const filteredFAQs = cat.faqs.filter(faq =>
          searchTerms.every(term =>
            faq.question.toLowerCase().includes(term) ||
            faq.answer.toLowerCase().includes(term)
          )
        );
        return filteredFAQs.length > 0 ? { ...cat, faqs: filteredFAQs } : null;
      })
      .filter(Boolean) as FAQCategory[];
  }, [categories, searchQuery, activeCategory, searchTerms]);

  const allCategories = useMemo(() => [
    { id: 'all', title: t('allCategories'), icon: HelpCircle, bgClass: 'from-teal-600 to-orange-500' },
    ...categories.map(cat => ({
      id: cat.id,
      title: cat.title,
      icon: categoryMeta[cat.id as keyof typeof categoryMeta]?.icon ?? HelpCircle,
      bgClass: categoryMeta[cat.id as keyof typeof categoryMeta]?.bgClass ?? 'from-gray-600 to-gray-500'
    }))
  ], [categories, categoryMeta, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <AppHeader showBack onBack={onBack} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero Section */}
        <div className="relative mb-8 sm:mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 dark:from-teal-500/5 dark:to-orange-500/5 rounded-2xl sm:rounded-3xl"></div>
          <div className="relative p-6 sm:p-8 md:p-12 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('pageTitle')}
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('pageSubtitle')}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-8 sm:mb-12">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base shadow-lg"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12 justify-center">
          {allCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? `bg-gradient-to-r ${cat.bgClass} text-white shadow-lg scale-105`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Content */}
        {filteredCategories.length > 0 ? (
          <div className="space-y-8 sm:space-y-12">
            {filteredCategories.map(category => {
              const catIcon = categoryMeta[category.id as keyof typeof categoryMeta]?.icon ?? HelpCircle;
              const catColor = categoryMeta[category.id as keyof typeof categoryMeta]?.bgClass ?? 'from-gray-600 to-gray-500';
              const CatIcon = catIcon;
              return (
                <section key={category.id}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${catColor} flex items-center justify-center`}>
                      <CatIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {category.faqs.map((faq, index) => {
                      const faqId = `${category.id}-${index}`;
                      const isOpen = openFAQs.has(faqId);
                      return (
                        <Card
                          key={faqId}
                          className={`border-2 transition-all cursor-pointer ${
                            isOpen
                              ? 'border-teal-400 dark:border-teal-500 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600'
                          } dark:bg-gray-800`}
                          onClick={() => toggleFAQ(faqId)}
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start justify-between gap-3 sm:gap-4">
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex-1">
                                {faq.question}
                              </h3>
                              <ChevronDown
                                className={`w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5 transition-transform ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                            {isOpen && (
                              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">{t('noResults')}</p>
          </div>
        )}

        {/* Still have questions? */}
        <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-2xl dark:bg-gray-800 overflow-hidden mt-8 sm:mt-16">
          <div className="bg-gradient-to-r from-teal-600 to-orange-500 h-2"></div>
          <CardContent className="p-6 sm:p-8 md:p-12 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('stillHaveQuestions')}</h2>
            <Button className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 active:scale-[0.98] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg w-full sm:w-auto transition-transform">
              {t('contactUs')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AppFooter />
    </div>
  );
}