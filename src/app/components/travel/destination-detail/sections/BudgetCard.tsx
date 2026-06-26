'use client';

import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { AnimatedSection } from '../components/AnimatedSection';
import type { DestinationDetailData } from '../DestinationDetailPage';

const BUDGET_PROFILES = ['mochileiro', 'conforto', 'luxo'] as const;

export function BudgetCard({
  custo_de_vida,
  t,
}: {
  custo_de_vida: NonNullable<DestinationDetailData['custo_de_vida']>;
  t: (key: string) => string;
}) {
  if (!custo_de_vida.orcamentos) return null;
  return (
    <AnimatedSection>
      <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-emerald-200/40 dark:border-emerald-900/40 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {t('budgetTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('budgetHint')}</p>
          {custo_de_vida.fonte && <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{custo_de_vida.fonte}</p>}
          <div className="grid sm:grid-cols-3 gap-3">
            {BUDGET_PROFILES.map((perfil) => {
              const o = custo_de_vida.orcamentos?.[perfil];
              if (!o) return null;
              return (
                <motion.div
                  key={perfil}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 p-4 border border-emerald-100 dark:border-emerald-900/50 hover:shadow-md transition-all duration-200"
                >
                  <p className="font-semibold text-sm dark:text-white">{t(`budget_${perfil}`)}</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                    {o.moeda} {o.total_dia}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/{t('perDay')}</span>
                  </p>
                  {o.itens?.slice(0, 2).map((line) => (
                    <p key={line} className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-1">{line}</p>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
