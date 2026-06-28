'use client';

import { useMemo, useState } from 'react';
import {
  Banknote,
  ChevronDown,
  Clock,
  Droplets,
  HeartPulse,
  Languages,
  Shield,
  ShoppingBag,
  Sun,
  Train,
  Users,
} from 'lucide-react';

import type { DestinationTipsMap, TipSectionKey } from '../../../lib/travel/destination-tips';
import { orderTipSectionsForProfile } from '../../../lib/travel/destination-tips';
import type { CompactTravelPreferences } from '../../../lib/travel/preference-match';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '../ui/utils';

const SECTION_META: Record<
  TipSectionKey,
  { icon: React.ComponentType<{ className?: string }>; accent: string }
> = {
  seguranca: { icon: Shield, accent: 'text-amber-700 dark:text-amber-400' },
  respeite: { icon: Users, accent: 'text-violet-700 dark:text-violet-400' },
  comunique: { icon: Languages, accent: 'text-blue-700 dark:text-blue-400' },
  beba: { icon: Droplets, accent: 'text-cyan-700 dark:text-cyan-400' },
  dinheiro: { icon: Banknote, accent: 'text-emerald-700 dark:text-emerald-400' },
  saude: { icon: HeartPulse, accent: 'text-rose-700 dark:text-rose-400' },
  transporte: { icon: Train, accent: 'text-primary dark:text-primary-300' },
  horarios: { icon: Clock, accent: 'text-gray-600 dark:text-gray-400' },
  compre: { icon: ShoppingBag, accent: 'text-accent dark:text-accent-500' },
  clima: { icon: Sun, accent: 'text-yellow-700 dark:text-yellow-400' },
};

export type DestinationTipsPanelProps = {
  dicas: DestinationTipsMap;
  labels: Record<TipSectionKey, string> & { panelTitle: string };
  preferences?: CompactTravelPreferences | null;
  /** Secções abertas por defeito (ex.: 2 primeiras do perfil). */
  defaultOpenCount?: number;
  compact?: boolean;
};

export function DestinationTipsPanel({
  dicas,
  labels,
  preferences,
  defaultOpenCount = 2,
  compact = false,
}: DestinationTipsPanelProps) {
  const ordered = useMemo(
    () => orderTipSectionsForProfile(dicas, preferences),
    [dicas, preferences],
  );

  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    ordered.slice(0, defaultOpenCount).forEach((k) => initial.add(k));
    return initial;
  });

  if (!ordered.length) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-primary-300">
          <Shield className="h-6 w-6" />
        </div>
        {labels.panelTitle}
      </h2>
      <div className={cn('grid sm:grid-cols-2 gap-4', compact && 'space-y-1.5')}>
        {ordered.map((key) => {
          const tips = dicas[key];
          if (!tips?.length) return null;
          const meta = SECTION_META[key];
          const Icon = meta.icon;
          const isOpen = openKeys.has(key);
          const title = labels[key] ?? key;

          return (
            <Collapsible
              key={key}
              open={isOpen}
              onOpenChange={(open) => {
                setOpenKeys((prev) => {
                  const next = new Set(prev);
                  if (open) next.add(key);
                  else next.delete(key);
                  return next;
                });
              }}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                <span className="flex items-center gap-3 font-black text-base uppercase tracking-tighter text-gray-950 dark:text-white italic">
                  <div className={cn('p-2 rounded-lg bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform', meta.accent)}>
                    <Icon className="h-5 w-5 shrink-0" />
                  </div>
                  {title}
                  {key === 'seguranca' && (
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 ml-1">
                      ⚠️
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-gray-400 transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <ul className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  {tips.map((tip) => (
                    <li
                      key={tip.slice(0, 48)}
                      className="text-base font-medium text-gray-700 dark:text-gray-300 flex gap-3 leading-relaxed"
                    >
                      <span className="text-orange font-black shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
