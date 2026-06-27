'use client';

import { motion } from 'framer-motion';
import { Globe, Thermometer, Languages, Banknote } from 'lucide-react';
import { staggerContainer, scaleIn } from '../constants/animations';
import type { DestinationDetailData } from '../DestinationDetailPage';

const QUICK_FACTS = (
  data: DestinationDetailData,
  t: (key: string) => string,
) => [
  { icon: Globe, label: t('continent') ?? 'Continente', value: data.continente, accent: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/20', border: 'border-blue-100 dark:border-blue-900/40' },
  { icon: Thermometer, label: t('climate') ?? 'Clima', value: data.clima, accent: 'text-orange dark:text-orange-400', bg: 'bg-orange/5 dark:bg-orange/10', border: 'border-orange/10 dark:border-orange/20' },
  { icon: Languages, label: t('type') ?? 'Tipo', value: data.tipo, accent: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50/50 dark:bg-violet-950/20', border: 'border-violet-100 dark:border-violet-900/40' },
  {
    icon: Banknote, label: t('budget') ?? 'Orçamento', value: (() => {
      const o = data.custo_de_vida?.orcamentos?.mochileiro;
      return o ? `${o.moeda} ${o.total_dia}/dia` : data.custo_de_vida?.moeda ?? '—';
    })(),
    accent: 'text-green dark:text-green-400', bg: 'bg-green/5 dark:bg-green/10', border: 'border-green/10 dark:border-green/20',
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
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {QUICK_FACTS(data, t).map((fact) => (
        <motion.div
          key={fact.label}
          variants={scaleIn}
          className={`rounded-2xl ${fact.bg} ${fact.border} border p-4 glass shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group`}
        >
          <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 w-fit mb-3 group-hover:scale-110 transition-transform`}>
            <fact.icon className={`h-5 w-5 ${fact.accent}`} />
          </div>
          <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-1">{fact.label}</p>
          <p className="text-base font-black text-gray-950 dark:text-white capitalize line-clamp-1 tracking-tighter italic">{fact.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
