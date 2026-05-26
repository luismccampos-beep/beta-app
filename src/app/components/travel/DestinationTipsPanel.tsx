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
  seguranca: { icon: Shield, accent: 'text-amber-600 dark:text-amber-400' },
  respeite: { icon: Users, accent: 'text-violet-600 dark:text-violet-400' },
  comunique: { icon: Languages, accent: 'text-blue-600 dark:text-blue-400' },
  beba: { icon: Droplets, accent: 'text-cyan-600 dark:text-cyan-400' },
  dinheiro: { icon: Banknote, accent: 'text-emerald-600 dark:text-emerald-400' },
  saude: { icon: HeartPulse, accent: 'text-rose-600 dark:text-rose-400' },
  transporte: { icon: Train, accent: 'text-teal-600 dark:text-teal-400' },
  horarios: { icon: Clock, accent: 'text-gray-600 dark:text-gray-400' },
  compre: { icon: ShoppingBag, accent: 'text-orange-600 dark:text-orange-400' },
  clima: { icon: Sun, accent: 'text-yellow-600 dark:text-yellow-400' },
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
    <div className="space-y-3">
      <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
        <Shield className="h-5 w-5 text-teal-600" />
        {labels.panelTitle}
      </h2>
      <div className={cn('space-y-2', compact && 'space-y-1.5')}>
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
              className="rounded-xl border border-gray-200/80 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 overflow-hidden"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-colors">
                <span className="flex items-center gap-2 font-semibold text-sm dark:text-white">
                  <Icon className={cn('h-4 w-4 shrink-0', meta.accent)} />
                  {title}
                  {key === 'seguranca' && (
                    <span className="text-xs font-normal text-amber-700 dark:text-amber-300 ml-1">
                      ⚠️
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-gray-500 transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-3">
                <ul className="space-y-2">
                  {tips.map((tip) => (
                    <li
                      key={tip.slice(0, 48)}
                      className="text-sm text-gray-700 dark:text-gray-300 flex gap-2 leading-snug"
                    >
                      <span className="text-teal-500 font-bold shrink-0">•</span>
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
