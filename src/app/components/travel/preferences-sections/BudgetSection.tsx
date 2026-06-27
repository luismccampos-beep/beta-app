'use client';

import { Controller } from 'react-hook-form';
import { Globe } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import type { PreferencesSectionProps } from './types';
import { CURRENCY_CODES } from '../../../../lib/i18n/preferences-form-options';
import { TravelBudgetProfileSelector } from '../../travel/TravelBudgetProfileSelector';
import { PROFILE_TO_BUDGET_PRIORITY, type TravelBudgetProfileId } from '../../../../lib/travel/daily-budget-profiles';

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', BRL: 'R$', JPY: '¥',
  CNY: '¥', AUD: '$', CAD: '$', CHF: 'Fr', INR: '₹',
  SGD: '$', MXN: '$',
};

export function BudgetSection({
  form,
  preferences,
  errors,
  t,
  travelCatalog,
  travelCatalogLoading,
  filterCountries,
  filterContinents,
  locale,
}: PreferencesSectionProps) {
  const { control, setValue, watch } = form;
  const watchedPreferences = watch();

  return (
    <div className="space-y-6">
      {/* Currency */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('preferredCurrency')}
          </Label>
        </div>
        <Controller name="currency" control={control} render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder={t('preferredCurrency')} />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_CODES.map((code) => (
                <SelectItem key={code} value={code}>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{t(`options.currencyFlags.${code}`)}</span>
                    <span>{CURRENCY_SYMBOLS[code]} {code}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      - {t(`options.currencies.${code}`)}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )} />
        {errors.currency && (
          <p className="text-red-500 text-xs mt-1" role="alert">{errors.currency.message}</p>
        )}
      </div>

      {/* Daily Budget Profile */}
      <TravelBudgetProfileSelector
        value={watchedPreferences.dailyBudgetProfile}
        currency={watchedPreferences.currency}
        referenceCity={locale === 'pt' ? 'lisbon' : 'london'}
        onChange={(profile: TravelBudgetProfileId) => {
          setValue('dailyBudgetProfile', profile);
          setValue('budgetPriority', PROFILE_TO_BUDGET_PRIORITY[profile]);
        }}
      />
      {errors.dailyBudgetProfile && (
        <p className="text-red-500 text-xs mt-1" role="alert">{errors.dailyBudgetProfile.message}</p>
      )}
      {errors.budgetPriority && (
        <p className="text-red-500 text-xs mt-1" role="alert">{errors.budgetPriority.message}</p>
      )}
    </div>
  );
}
