'use client';

import { useTranslations } from 'next-intl';

import type { CostOfLivingSummary } from '../../../lib/travel/cost-tier';
import { costTierLabelKey } from '../../../lib/travel/cost-tier';
import { Badge } from '../ui/badge';

type CostOfLivingBadgeProps = {
  cost: CostOfLivingSummary;
  className?: string;
};

export function CostOfLivingBadge({ cost, className = '' }: CostOfLivingBadgeProps) {
  const t = useTranslations('destination');

  return (
    <Badge
      variant="secondary"
      className={`border-0 bg-amber-100/90 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100 font-medium tabular-nums ${className}`}
      title={
        cost.index != null
          ? `${t('costIndex')}: ${cost.index} (${t('costIndexRef')})`
          : t('costEstimated')
      }
    >
      <span className="tracking-widest">{cost.symbols}</span>
      <span className="mx-1.5 opacity-40">·</span>
      <span className="text-xs font-normal">{t(costTierLabelKey(cost.tier))}</span>
    </Badge>
  );
}
