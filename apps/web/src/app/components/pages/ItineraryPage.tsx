'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, MapPin, Euro, Sun, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../ui/utils';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Activity {
  time: string;
  title: string;
  location: string;
  duration?: number;
  cost?: number;
  category?: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
}

interface Itinerary {
  destination: string;
  durationDays: number;
  budget: number;
  bestTime: string;
  days: ItineraryDay[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const DESTINATION_LOOKUP: Record<string, string> = {
  'sao-paulo': 'São Paulo',
  'porto-alegre': 'Porto Alegre',
  'sao-miguel': 'São Miguel',
  'porto-santo': 'Porto Santo',
  'rio-de-janeiro': 'Rio de Janeiro',
  'sao-francisco-do-sul': 'São Francisco do Sul',
  'sao-joao': 'São João',
  'sao-tome': 'São Tomé',
  'sao-vicente': 'São Vicente',
  'sao-luis': 'São Luís',
  'sao-pedro': 'São Pedro',
};

function decodeSlug(slug: string): string {
  const normalised = slug.toLowerCase();
  if (DESTINATION_LOOKUP[normalised]) return DESTINATION_LOOKUP[normalised];

  try {
    const decoded = decodeURIComponent(slug);
    return decoded
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch {
    return slug;
  }
}

function formatCurrency(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(value);
  } catch {
    return `€${value.toLocaleString()}`;
  }
}

// ── Mock Data (replace with API call) ─────────────────────────────────────────

function getMockItinerary(slug: string): Itinerary {
  const destination = decodeSlug(slug);
  return {
    destination,
    durationDays: 3,
    budget: 1200,
    bestTime: 'Março - Maio, Setembro - Outubro',
    days: [
      {
        day: 1,
        title: 'Chegada e Exploração',
        activities: [
          { time: '09:00', title: 'Check-in no hotel', location: 'Centro Histórico', duration: 60, category: 'accommodation' },
          { time: '11:00', title: 'Visita aos principais pontos turísticos', location: 'Centro da Cidade', duration: 120, category: 'activity' },
          { time: '14:00', title: 'Almoço em restaurante local', location: 'Zona Ribeirinha', cost: 25, duration: 60, category: 'meal' },
          { time: '16:00', title: 'Passeio livre e compras', location: 'Rua Principal', duration: 120, category: 'activity' },
          { time: '20:00', title: 'Jantar com vista panorâmica', location: 'Miradouro', cost: 40, duration: 90, category: 'meal' },
        ],
      },
      {
        day: 2,
        title: 'Cultura e Tradições',
        activities: [
          { time: '09:00', title: 'Pequeno-almoço tradicional', location: 'Hotel', cost: 15, duration: 45, category: 'meal' },
          { time: '10:00', title: 'Visita a museus e monumentos', location: 'Centro Cultural', duration: 150, cost: 12, category: 'activity' },
          { time: '13:00', title: 'Almoço com pratos típicos', location: 'Restaurante Local', cost: 30, duration: 60, category: 'meal' },
          { time: '15:00', title: 'Tour guiado pela cidade', location: 'Ponto de Encontro', duration: 120, cost: 20, category: 'activity' },
          { time: '19:00', title: 'Espetáculo cultural', location: 'Teatro Local', duration: 120, cost: 35, category: 'activity' },
        ],
      },
      {
        day: 3,
        title: 'Natureza e Regresso',
        activities: [
          { time: '08:00', title: 'Pequeno-almoço', location: 'Hotel', cost: 15, duration: 30, category: 'meal' },
          { time: '09:00', title: 'Visita a parque natural', location: 'Área Protegida', duration: 180, cost: 8, category: 'activity' },
          { time: '12:00', title: 'Almoço leve', location: 'Café Local', cost: 20, duration: 45, category: 'meal' },
          { time: '14:00', title: 'Últimas compras e souvenirs', location: 'Mercado Local', duration: 90, category: 'activity' },
          { time: '16:00', title: 'Transfer para aeroporto', location: 'Hotel', duration: 45, category: 'transport' },
        ],
      },
    ],
  };
}

// ── Motion Variants ────────────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function QuickInfoCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-base font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

function TimelineDot({ isLast }: { isLast: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-3 h-3 rounded-full bg-primary dark:bg-primary-400 ring-4 ring-primary-100 dark:ring-primary-900/40 flex-shrink-0 z-10" />
      {!isLast && <div className="w-0.5 flex-1 min-h-8 bg-gradient-to-b from-primary/40 to-transparent" />}
    </div>
  );
}

function ActivityRow({
  activity,
  isLast,
  formatCurrency: formatCurrencyFn,
}: {
  activity: Activity;
  isLast: boolean;
  formatCurrency: (v: number) => string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center pt-1">
        <div className="w-3 h-3 rounded-full bg-primary/30 ring-2 ring-white dark:ring-gray-900 flex-shrink-0 z-10" />
        {!isLast && <div className="w-0.5 flex-1 min-h-8 bg-gray-200 dark:bg-gray-700" />}
      </div>
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <time dateTime={activity.time} className="text-xs font-semibold text-primary dark:text-primary-400 tabular-nums">
              {activity.time}
            </time>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 truncate">{activity.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{activity.location}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {activity.duration && (
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                <Timer className="w-3 h-3" />
                {activity.duration}min
              </span>
            )}
            {activity.cost != null && (
              <span className="text-[10px] font-semibold text-accent-700 dark:text-accent-400">
                {formatCurrencyFn(activity.cost)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface ItineraryPageProps {
  slug: string;
}

export function ItineraryPage({ slug }: ItineraryPageProps) {
  const t = useTranslations('itinerary');
  const locale = useLocale();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const headerRef = useRef<HTMLDivElement>(null);

  const itinerary = useMemo(() => getMockItinerary(slug), [slug]);

  const formatCurr = useCallback(
    (value: number) => formatCurrency(value, locale),
    [locale],
  );

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  const animProps = useMemo(
    () => (prefersReducedMotion ? { initial: 'visible', animate: 'visible' } : undefined),
    [prefersReducedMotion],
  );

  const TotalBudgetSection = useMemo(() => {
    const breakdown = [
      { label: t('budgetAccommodation'), value: 480, color: 'bg-blue-500' },
      { label: t('budgetMeals'), value: 280, color: 'bg-green-500' },
      { label: t('budgetActivities'), value: 320, color: 'bg-purple-500' },
      { label: t('budgetTransport'), value: 80, color: 'bg-orange-400' },
      { label: t('budgetOther'), value: 40, color: 'bg-gray-400' },
    ];
    const total = breakdown.reduce((s, i) => s + i.value, 0);

    return (
      <motion.section
        variants={fadeInUp}
        {...animProps}
        className="mb-12"
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('budgetBreakdown')}</h3>
            <div className="space-y-3">
              {breakdown.map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={cn('w-3 h-3 rounded-full flex-shrink-0', item.color)} />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurr(item.value)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{t('budget')}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurr(itinerary.budget)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    );
  }, [t, formatCurr, itinerary.budget, animProps]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-8 gap-2"
          aria-label={t('back')}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Button>

        {/* Header */}
        <motion.div
          ref={headerRef}
          variants={fadeInUp}
          {...animProps}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter break-words">
            {t('title', { destination: itinerary.destination })}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Quick Info Cards */}
        <motion.div
          variants={staggerContainer}
          {...animProps}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <QuickInfoCard
            icon={Calendar}
            label={t('duration')}
            value={t('duration_days', { count: itinerary.durationDays })}
            color="bg-gradient-to-br from-primary to-primary-700"
          />
          <QuickInfoCard
            icon={Euro}
            label={t('budget')}
            value={formatCurr(itinerary.budget)}
            color="bg-gradient-to-br from-accent-600 to-accent-800"
          />
          <QuickInfoCard
            icon={MapPin}
            label={t('destination')}
            value={itinerary.destination}
            color="bg-gradient-to-br from-primary to-primary-700"
          />
          <QuickInfoCard
            icon={Sun}
            label={t('bestTime')}
            value={itinerary.bestTime}
            color="bg-gradient-to-br from-orange-500 to-orange-700"
          />
        </motion.div>

        {/* Budget Breakdown */}
        {TotalBudgetSection}

        {/* Timeline */}
        <motion.div
          variants={staggerContainer}
          {...animProps}
          className="space-y-8"
        >
          {itinerary.days.map((day, dayIndex) => (
            <motion.div
              key={day.day}
              variants={fadeInUp}
              viewport={{ once: true, margin: '-40px' }}
            >
              <Card className="overflow-hidden">
                {/* Day Header */}
                <div className="bg-gradient-to-r from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-900 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                      {day.day}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {t('day', { day: day.day, title: day.title })}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('activities', { count: day.activities.length })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <CardContent className="p-6">
                  {day.activities.map((activity, actIndex) => (
                    <ActivityRow
                      key={`${activity.time}-${actIndex}`}
                      activity={activity}
                      isLast={actIndex === day.activities.length - 1}
                      formatCurrency={formatCurr}
                    />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          {...animProps}
          className="mt-12 text-center"
        >
          <Card className="border-2 border-accent-200 dark:border-accent-700 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-accent h-2" />
            <CardContent className="p-8 space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('ctaTitle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                {t('ctaDesc')}
              </p>
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-accent text-white hover:from-primary-700 hover:to-accent-700 shadow-lg"
                onClick={() => router.push('/preferences/edit')}
              >
                {t('ctaButton')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
