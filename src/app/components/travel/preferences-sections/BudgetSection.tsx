'use client';

import { Controller } from 'react-hook-form';
import { Wallet, Globe, ChevronRight } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Slider } from '../../ui/slider';
import { Badge } from '../../ui/badge';
import { OpenMoji } from '../../ui/openmoji';
import type { PreferencesSectionProps } from './types';
import { CURRENCY_CODES, CABIN_CLASS_IDS } from '../../../../lib/i18n/preferences-form-options';
import { TravelBudgetProfileSelector } from '../../travel/TravelBudgetProfileSelector';
import { PROFILE_TO_BUDGET_PRIORITY, type TravelBudgetProfileId } from '../../../../lib/travel/daily-budget-profiles';

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  BRL: 'R$',
  JPY: '¥',
  CNY: '¥',
  AUD: '$',
  CAD: '$',
  CHF: 'Fr',
  INR: '₹',
  SGD: '$',
  MXN: '$',
};

function cabinClassEmoji(value: string): string {
  switch (value) {
    case 'economy':
      return '💺';
    case 'premium_economy':
      return '✈️';
    case 'business':
      return '🥂';
    case 'first':
      return '👑';
    default:
      return '✈️';
  }
}

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

  const getBudgetCategory = () => {
    const max = watchedPreferences.budgetRange[1];
    if (max > 30000) return t('budgetCategory.ultraLuxury');
    if (max > 20000) return t('budgetCategory.luxury');
    if (max > 10000) return t('budgetCategory.premium');
    return t('budgetCategory.standard');
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 flex flex-wrap items-center gap-2">
          <Wallet className="w-6 h-6 text-teal-700 dark:text-teal-300" /> {t('budgetFinancialPreferences')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('multiCurrencySupport')}
        </p>
      </div>

      <div className="space-y-6">
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
                      <span>
                        {CURRENCY_SYMBOLS[code]} {code}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">- {t(`options.currencies.${code}`)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />
          {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>}
        </div>

        <TravelBudgetProfileSelector
          value={watchedPreferences.dailyBudgetProfile}
          currency={watchedPreferences.currency}
          referenceCity={locale === 'pt' ? 'lisbon' : 'london'}
          onChange={(profile: TravelBudgetProfileId) => {
            setValue('dailyBudgetProfile', profile);
            setValue('budgetPriority', PROFILE_TO_BUDGET_PRIORITY[profile]);
          }}
        />
        {errors.dailyBudgetProfile && <p className="text-red-500 text-xs mt-1">{errors.dailyBudgetProfile.message}</p>}
        {errors.budgetPriority && <p className="text-red-500 text-xs mt-1">{errors.budgetPriority.message}</p>}

        <div className="space-y-4">
          <Label className="text-base font-semibold">{t('budgetRangePerTrip')}</Label>
          <div className="bg-gradient-to-br from-green-50 dark:from-gray-800 to-blue-50 dark:to-gray-800 rounded-xl p-4 sm:p-6 space-y-4">
            <Controller name="budgetRange" control={control} render={({ field }) => (
              <Slider
                min={1000}
                max={50000}
                step={500}
                value={field.value}
                onValueChange={field.onChange}
                className="w-full touch-none py-2"
              />
            )} />
            {errors.budgetRange && <p className="text-red-500 text-xs mt-1">{errors.budgetRange.message}</p>}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex-1 text-center bg-white dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-3 shadow-sm">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('minimum')}</p>
                <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 break-all">
                  {CURRENCY_SYMBOLS[watchedPreferences.currency] ?? '$'}
                  {watchedPreferences.budgetRange[0].toLocaleString()}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 hidden sm:block shrink-0" />
              <div className="flex-1 text-center bg-white dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-3 shadow-sm">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('maximum')}</p>
                <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 break-all">
                  {CURRENCY_SYMBOLS[watchedPreferences.currency] ?? '$'}
                  {watchedPreferences.budgetRange[1].toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-center pt-2">
              <Badge variant="secondary" className="text-sm px-4 py-1">
                {t('category')}: {getBudgetCategory()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="cabinClass" className="text-base font-semibold">{t('preferredFlightCabin')}</Label>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('cabinDuffelNote')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {(travelCatalog?.duffelCabinClasses?.length
              ? travelCatalog.duffelCabinClasses
              : CABIN_CLASS_IDS.map((value) => ({ value, label: '' }))
            ).map((cabin) => {
              const isSelected = watchedPreferences.cabinClass === cabin.value;
              return (
                <button
                  key={cabin.value}
                  type="button"
                  onClick={() => setValue('cabinClass', cabin.value)}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-center
                    ${isSelected
                      ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/30 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                    }
                  `}
                >
                  <OpenMoji emoji={cabinClassEmoji(cabin.value)} size={28} className="mx-auto mb-2" />
                  <div className="text-sm font-semibold">{(CABIN_CLASS_IDS as readonly string[]).includes(cabin.value)
                      ? t(`options.cabinClass.${cabin.value}`)
                      : cabin.label}</div>
                </button>
              );
            })}
          </div>
          {errors.cabinClass && <p className="text-red-500 text-xs mt-1">{errors.cabinClass.message}</p>}
        </div>
      </div>
    </div>
  );
}