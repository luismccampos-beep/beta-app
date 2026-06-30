'use client';

import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { Counter } from '../../../ui/counter';
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
      <Card className="card-premium dark:bg-gray-900 group">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-950 dark:text-white uppercase tracking-tighter">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            {t('budgetTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">{t('budgetHint')}</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {BUDGET_PROFILES.map((perfil) => {
              const o = custo_de_vida.orcamentos?.[perfil];
              if (!o) return null;
              return (
                <motion.div
                  key={perfil}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 p-6 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-xl transition-all duration-300 group/item"
                >
                  <p className="font-black text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-300 mb-2">{t(`budget_${perfil}`)}</p>
                  <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400 tracking-tighter mb-4">
                    <Counter end={o.total_dia} prefix={o.moeda + ' '} duration={2} />
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-600 italic block mt-1 uppercase tracking-tighter">/{t('perDay')}</span>
                  </div>
                  <div className="space-y-1 pt-4 border-t border-emerald-100 dark:border-emerald-900/40">
                    {o.itens?.slice(0, 3).map((line) => (
                      <p key={line} className="text-xs font-medium text-gray-600 dark:text-gray-400 line-clamp-1 flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-emerald-300">{line}</p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
          {custo_de_vida.fonte && (
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mt-6 text-right">{custo_de_vida.fonte}</p>
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
