'use client';

import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { Check, Shield, Leaf } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { PreferencesSectionProps } from './types';
import {
  DIETARY_IDS,
  ACCESSIBILITY_IDS,
  SUSTAINABILITY_LEVEL_IDS,
  ECO_PREFERENCE_IDS,
} from '../../../../lib/i18n/preferences-form-options';

export function SpecialRequirementsSection({
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

  const toggleArrayValue = (key: keyof typeof preferences, value: string) => {
    const currentArray = watchedPreferences[key] as string[];
    if (currentArray.includes(value)) {
      setValue(key, currentArray.filter((item: string) => item !== value));
    } else {
      setValue(key, [...currentArray, value]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 flex flex-wrap items-center gap-2">
          <Shield className="w-6 h-6 text-red-600 dark:text-red-400" /> {t('specialRequirementsNeeds')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('ensureSafeComfortable')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold">{t('dietaryRestrictions')}</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {DIETARY_IDS.map((id) => (
              <div key={id} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation">
                <Checkbox
                  id={`diet-${id}`}
                  checked={watchedPreferences.dietaryRestrictions.includes(id)}
                  onCheckedChange={() => toggleArrayValue('dietaryRestrictions', id)}
                />
                <Label htmlFor={`diet-${id}`} className="cursor-pointer text-sm font-medium">
                  {t(`options.dietary.${id}`)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">{t('accessibilityRequirements')}</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACCESSIBILITY_IDS.map((id) => (
              <div key={id} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation">
                <Checkbox
                  id={`access-${id}`}
                  checked={watchedPreferences.accessibility.includes(id)}
                  onCheckedChange={() => toggleArrayValue('accessibility', id)}
                />
                <Label htmlFor={`access-${id}`} className="cursor-pointer text-sm font-medium">
                  {t(`options.accessibility.${id}`)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="medicalConditions" className="text-base font-semibold">
            {t('medicalConditionsNotes')}
          </Label>
          <Textarea
            id="medicalConditions"
            placeholder={t('medicalPlaceholder')}
            value={watchedPreferences.medicalConditions}
            onChange={(e) => setValue('medicalConditions', e.target.value)}
            rows={5}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('confidentialEncrypted')}</p>
        </div>

        <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 dark:from-gray-800 to-emerald-50 dark:to-gray-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
              {t('sustainabilityPreferences')}
            </CardTitle>
            <CardDescription>{t('helpEnvironmentallyResponsible')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="sustainabilityLevel" className="text-base font-semibold">{t('sustainabilityPriority')}</Label>
              <Select value={watchedPreferences.sustainabilityLevel} onValueChange={(value: string) => setValue('sustainabilityLevel', value)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUSTAINABILITY_LEVEL_IDS.map((id) => (
                    <SelectItem key={id} value={id}>
                      {t(`options.sustainabilityLevel.${id}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('ecoPreferences')}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ECO_PREFERENCE_IDS.map((id) => (
                  <div key={id} className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-3 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors touch-manipulation">
                    <Checkbox
                      id={`eco-${id}`}
                      checked={watchedPreferences.ecoPreferences.includes(id)}
                      onCheckedChange={() => toggleArrayValue('ecoPreferences', id)}
                    />
                    <Label htmlFor={`eco-${id}`} className="cursor-pointer text-sm font-medium">
                      {t(`options.ecoPreferences.${id}`)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-lg p-4 touch-manipulation">
            <div className="space-y-0.5 flex-1 min-w-0">
              <Label htmlFor="carbonOffset" className="font-semibold">{t('automaticCarbonOffset')}</Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('offsetCO2Flights')}</p>
              </div>
              <Checkbox
                id="carbonOffset"
                checked={watchedPreferences.carbonOffset}
                onCheckedChange={(checked: boolean) => setValue('carbonOffset', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}