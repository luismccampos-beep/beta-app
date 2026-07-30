import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import {
  HelpCircle, Search, Plane, CreditCard, XCircle,
  Shield, Globe, FileText, ChevronDown
} from 'lucide-react'

const useT = createTranslationsHook('faq')

interface FAQ {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  title: string
  faqs: FAQ[]
}

const categoryMeta: Record<string, { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; gradient: string }> = {
  booking: { icon: Plane, gradient: 'from-blue-600 to-blue-800' },
  payment: { icon: CreditCard, gradient: 'from-purple-600 to-purple-800' },
  cancellation: { icon: XCircle, gradient: 'from-orange-500 to-orange-700' },
  safety: { icon: Shield, gradient: 'from-green-600 to-green-800' },
  travel: { icon: Globe, gradient: 'from-cyan-600 to-cyan-800' },
  general: { icon: FileText, gradient: 'from-gray-600 to-gray-800' },
}

export const Route = createFileRoute('/faq')({
  head: () => generatePageHead({
    title: 'Perguntas Frequentes',
    description: 'Encontre respostas para perguntas frequentes sobre os serviços, reservas e funcionalidades da AKMLEVA.',
    path: '/faq',
  }),
  component: FAQPage,
})

function FAQPage() {
  const t = useT()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set())
  const faqRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Parse categories from translations (with fallback to hardcoded FAQs)
  const categories = useMemo((): FAQCategory[] => {
    try {
      const raw = t('categories')
      // createTranslationsHook returns string or the original path. For arrays,
      // it returns the path string, so check if we got actual data.
      if (raw && typeof raw !== 'string' && Array.isArray(raw)) {
        return raw as FAQCategory[]
      }
    } catch { /* fallback */ }

    // Hardcoded fallback FAQs
    return [
      {
        id: 'booking', title: t('categories') !== 'categories' ? t('categories') : 'Reservas',
        faqs: [
          { question: 'Como faço uma reserva?', answer: 'Pode fazer uma reserva através do nosso website clicando em \"Começar\", preenchendo as suas preferências de viagem e selecionando das nossas recomendações personalizadas. Também pode contactar-nos diretamente por telefone ou email.' },
          { question: 'Posso modificar a minha reserva após confirmação?', answer: 'Sim, pode modificar a sua reserva sujeito a disponibilidade e aos termos dos fornecedores de serviços. Taxas de modificação podem ser aplicadas dependendo da proximidade da data de partida.' },
        ],
      },
      {
        id: 'payment', title: 'Pagamentos',
        faqs: [
          { question: 'Que métodos de pagamento aceitam?', answer: 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), cartões de débito, transferências bancárias e MB Way.' },
          { question: 'Existem taxas ocultas?', answer: 'Não, fornecemos preços transparentes. Todas as taxas e encargos são claramente exibidas antes de confirmar a sua reserva.' },
        ],
      },
      {
        id: 'general', title: 'Perguntas Gerais',
        faqs: [
          { question: 'O que é a AKMLEVA?', answer: 'A AKMLEVA é uma plataforma de viagens potenciada por inteligência artificial que cria itinerários personalizados.' },
          { question: 'É gratuito?', answer: 'Sim, pode criar itinerários e explorar destinos gratuitamente. Funcionalidades premium estarão disponíveis em breve.' },
          { question: 'Como funcionam as recomendações?', answer: 'Utilizamos algoritmos de IA que analisam as suas preferências, orçamento e estilo de viagem para sugerir destinos e atividades.' },
          { question: 'Os meus dados estão seguros?', answer: 'Sim. Utilizamos encriptação de ponta a ponta e nunca partilhamos os seus dados com terceiros sem o seu consentimento.' },
          { question: 'Preciso de criar conta para usar?', answer: 'Pode explorar destinos sem conta, mas para guardar preferências e criar itinerários personalizados, precisa de criar uma conta gratuita.' },
          { question: 'Oferecem seguro de viagem?', answer: 'Sim, recomendamos e oferecemos opções de seguro de viagem para cobrir cancelamentos, emergências médicas e imprevistos durante a sua viagem.' },
        ],
      },
    ]
  }, [t])

  const toggleFAQ = (id: string) => {
    const next = new Set(openFAQs)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setOpenFAQs(next)
  }

  const searchTerms = searchQuery.toLowerCase().split(' ').filter(Boolean)

  const filteredCategories = useMemo(() => {
    if (!searchQuery && activeCategory === 'all') return categories
    return categories
      .map(cat => {
        if (activeCategory !== 'all' && cat.id !== activeCategory) return null
        if (!searchQuery) return cat
        const filtered = cat.faqs.filter(faq =>
          searchTerms.every(term =>
            faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term)
          )
        )
        return filtered.length > 0 ? { ...cat, faqs: filtered } : null
      })
      .filter(Boolean) as FAQCategory[]
  }, [categories, searchQuery, activeCategory, searchTerms])

  const allCategories = useMemo(() => [
    { id: 'all', title: t('allCategories'), icon: HelpCircle, gradient: 'from-blue-600 to-purple-600' },
    ...categories.map(cat => ({
      id: cat.id,
      title: cat.title,
      icon: categoryMeta[cat.id]?.icon ?? HelpCircle,
      gradient: categoryMeta[cat.id]?.gradient ?? 'from-gray-600 to-gray-800',
    }))
  ], [categories, t])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 sm:mb-14">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-950 dark:text-white mb-3">{t('pageTitle')}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('pageSubtitle')}</p>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="relative max-w-xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
          />
        </motion.div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 justify-center">
          {allCategories.map(cat => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg scale-105`
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />{cat.title}
              </button>
            )
          })}
        </div>

        {/* FAQ Content */}
        {filteredCategories.length > 0 ? (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-10">
            {filteredCategories.map(category => {
              const meta = categoryMeta[category.id] ?? { icon: HelpCircle, gradient: 'from-gray-600 to-gray-800' }
              const CatIcon = meta.icon
              return (
                <motion.section key={category.id} variants={fadeInUp}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
                      <CatIcon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{category.title}</h2>
                  </div>
                  <div className="space-y-3">
                    {category.faqs.map((faq, idx) => {
                      const faqId = `${category.id}-${idx}`
                      const isOpen = openFAQs.has(faqId)
                      return (
                        <div key={faqId} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                          <button
                            ref={el => { if (el) faqRefs.current.set(faqId, el) }}
                            onClick={() => toggleFAQ(faqId)}
                            onKeyDown={e => {
                              if (e.key === 'ArrowDown') {
                                e.preventDefault()
                                const next = faqRefs.current.get(`${category.id}-${Math.min(idx + 1, category.faqs.length - 1)}`)
                                next?.focus()
                              }
                              if (e.key === 'ArrowUp') {
                                e.preventDefault()
                                const prev = faqRefs.current.get(`${category.id}-${Math.max(idx - 1, 0)}`)
                                prev?.focus()
                              }
                            }}
                            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            aria-expanded={isOpen}
                          >
                            <span className="pr-4">{faq.question}</span>
                            <ChevronDown className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.section>
              )
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg text-gray-500 dark:text-gray-400">{t('noResults')}</p>
          </div>
        )}

        {/* Still have questions CTA */}
        <div className="text-center mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('stillHaveQuestions')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{t('ctaBody')}</p>
          <a href="/contact" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25">
            {t('contactUs')}
          </a>
        </div>
      </div>
    </div>
  )
}
