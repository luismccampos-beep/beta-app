'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Bus, Coffee, Hotel, ShoppingBag, Utensils, UtensilsCrossed } from 'lucide-react';

import {
  REFERENCE_LISBON,
  REFERENCE_LONDON,
  TRAVEL_BUDGET_PROFILE_IDS,
  estimateForProfile,
  type TravelBudgetProfileId,
} from '../../../lib/travel/daily-budget-profiles';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const PROFILE_ICONS: Record<TravelBudgetProfileId, typeof Utensils> = {
  mochileiro: ShoppingBag,
  conforto: Coffee,
  luxo: Hotel,
};

type TravelBudgetProfileSelectorProps = {
  value: TravelBudgetProfileId;
  onChange: (profile: TravelBudgetProfileId) => void;
  currency?: string;
  referenceCity?: 'london' | 'lisbon';
};

export function TravelBudgetProfileSelector({
  value,
  onChange,
  currency = 'USD',
  referenceCity = 'london',
}: TravelBudgetProfileSelectorProps) {
  const t = useTranslations('enhancedTravelPreferencesForm.dailyBudget');

  const reference = referenceCity === 'lisbon' ? REFERENCE_LISBON : REFERENCE_LONDON;

  const estimate = useMemo(
    () => estimateForProfile(value, currency, reference),
    [value, currency, reference],
  );

  const currencySymbol =
    currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'BRL' ? 'R$' : '$';

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-semibold text-gray-900 dark:text-white">{t('title')}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TRAVEL_BUDGET_PROFILE_IDS.map((id) => {
          const Icon = PROFILE_ICONS[id];
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`text-left rounded-xl border-2 p-4 transition-all touch-manipulation ${
                selected
                  ? 'border-primary bg-primary-50 dark:bg-primary-900/40 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 ${selected ? 'text-primary' : 'text-gray-500'}`} />
                <span className="font-semibold text-sm dark:text-white">{t(`profiles.${id}.title`)}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {t(`profiles.${id}.meals`)}
              </p>
            </button>
          );
        })}
      </div>

      <Card className="border-primary-100 dark:border-primary-900/50 bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-gray-900 dark:to-primary-900/20">
        <CardContent className="pt-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">{t('formulaTitle')}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{t('formula')}</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {t('exampleCity', { city: estimate.referenceCity })}
            </Badge>
          </div>

          {/* Mobile: stacked card rows */}
          <div className="sm:hidden space-y-1">
            {estimate.lines.map((line) => (
              <div
                key={line.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className="text-sm text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  {line.id.includes('transport') ? (
                    <Bus className="h-3.5 w-3.5 text-primary shrink-0" />
                  ) : line.id.includes('attractions') ? (
                    <UtensilsCrossed className="h-3.5 w-3.5 text-accent shrink-0" />
                  ) : (
                    <Utensils className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  )}
                  {t(`lines.${line.id}`)}
                  <span className="text-xs text-gray-400 ml-1">×{line.quantity}</span>
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {currencySymbol}
                  {line.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{t('dailyTotal')}</span>
              <span className="text-lg font-bold text-primary dark:text-primary-300 tabular-nums">
                {currencySymbol}
                {estimate.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                <span className="text-xs font-normal text-gray-500">/{t('perDay')}</span>
              </span>
            </div>
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 pr-2 font-medium">{t('tableItem')}</th>
                  <th className="pb-2 px-2 font-medium text-center">{t('tableQty')}</th>
                  <th className="pb-2 px-2 font-medium text-right">{t('tableUnit')}</th>
                  <th className="pb-2 pl-2 font-medium text-right">{t('tableSubtotal')}</th>
                </tr>
              </thead>
              <tbody>
                {estimate.lines.map((line) => (
                  <tr
                    key={line.id}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="py-2 pr-2 text-gray-800 dark:text-gray-200">
                      <span className="inline-flex items-center gap-1.5">
                        {line.id.includes('transport') ? (
                          <Bus className="h-3.5 w-3.5 text-primary shrink-0" />
                        ) : line.id.includes('attractions') ? (
                          <UtensilsCrossed className="h-3.5 w-3.5 text-accent shrink-0" />
                        ) : (
                          <Utensils className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        )}
                        {t(`lines.${line.id}`)}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center tabular-nums">{line.quantity}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-gray-600 dark:text-gray-400">
                      {currencySymbol}
                      {line.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 pl-2 text-right tabular-nums font-medium">
                      {currencySymbol}
                      {line.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                    {t('dailyTotal')}
                  </td>
                  <td className="pt-3 pl-2 text-right text-lg font-bold text-primary dark:text-primary-300 tabular-nums">
                    {currencySymbol}
                    {estimate.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    <span className="text-xs font-normal text-gray-500">/{t('perDay')}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">{t('disclaimer')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
