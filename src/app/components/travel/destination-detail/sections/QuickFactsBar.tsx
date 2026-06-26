'use client';

import { motion } from 'framer-motion';
import { Globe, Thermometer, Languages, Banknote } from 'lucide-react';
import { staggerContainer, scaleIn } from '../constants/animations';
import type { DestinationDetailData } from '../DestinationDetailPage';

const QUICK_FACTS = (
  data: DestinationDetailData,
  t: (key: string) => string,
) => [
  { icon: Globe, label: t('continent') ?? 'Continente', value: data.continente, accent: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/80 dark:bg-blue-950/30', border: 'border-blue-100 dark:border-blue-900/40' },
  { icon: Thermometer, label: t('climate') ?? 'Clima', value: data.clima, accent: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50/80 dark:bg-orange-950/30', border: 'border-orange-100 dark:border-orange-900/40' },
  { icon: Languages, label: t('type') ?? 'Tipo', value: data.tipo, accent: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50/80 dark:bg-violet-950/30', border: 'border-violet-100 dark:border-violet-900/40' },
  {
    icon: Banknote, label: t('budget') ?? 'Orçamento', value: (() => {
      const o = data.custo_de_vida?.orcamentos?.mochileiro;
      return o ? `${o.moeda} ${o.total_dia}/dia` : data.custo_de_vida?.moeda ?? '—';
    })(),
    accent: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/80 dark:bg-emerald-950/30', border: 'border-emerald-100 dark:border-emerald-900/40',
  },
];

export function QuickFactsBar({
  data,
  t,
}: {
  data: DestinationDetailData;
  t: (key: string) => string;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      {QUICK_FACTS(data, t).map((fact) => (
        <motion.div
          key={fact.label}
          variants={scaleIn}
          className={`rounded-xl ${fact.bg} ${fact.border} border p-3 backdrop-blur-sm hover:shadow-md transition-all duration-300`}
        >
          <fact.icon className={`h-4 w-4 ${fact.accent} mb-1`} />
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{fact.label}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize line-clamp-1">{fact.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
