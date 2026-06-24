'use client';

import { Controller } from 'react-hook-form';
import { Check, Palmtree, Globe } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { OpenMoji } from '../../ui/openmoji';
import type { PreferencesSectionProps } from './types';
import {
  ACTIVITY_TYPE_IDS,
  PACE_PREFERENCE_IDS,
  EXPERIENCE_TYPE_IDS,
  LANGUAGE_IDS,
} from '../../../../lib/i18n/preferences-form-options';

const ACTIVITY_TYPE_EMOJIS: Record<string, string> = {
  adventure: '🎒',
  cultural: '🏛️',
  beach: '🏖️',
  city: '🏙️',
  hiking: '⛰️',
  wildlife: '🦁',
  food: '🍽️',
  shopping: '🛍️',
  historical: '🏛️',
  photography: '📸',
  water: '🌊',
  nightlife: '🌙',
};

const getActivityTypesData = (t: (key: string) => string) =>
  ACTIVITY_TYPE_IDS.map((activityId: string) => ({
    id: activityId,
    label: t(`options.activityTypes.${activityId}`),
    emoji: ACTIVITY_TYPE_EMOJIS[activityId] ?? '📍',
  }));

export function ActivitiesSection({
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
          <Palmtree className="w-6 h-6 text-green-600 dark:text-green-400" /> {t('activitiesExperiences')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('aiCurateExperiences')}
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">{t('preferredActivities')}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {getActivityTypesData(t).map((activity) => {
            const isSelected = watchedPreferences.activityTypes.includes(activity.id);
            
            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => {
                  toggleArrayValue('activityTypes', activity.id);
                }}
                className={`
                  p-3 sm:p-4 rounded-lg border-2 transition-all sm:hover:scale-105 touch-manipulation
                  ${isSelected 
                    ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                  }
                `}
              >
                <OpenMoji emoji={activity.emoji} size={28} className="block mb-2 mx-auto" />
                <span className={`text-xs font-semibold block ${isSelected ? 'text-green-900 dark:text-green-200' : 'text-gray-900 dark:text-white'}`}>
                  {activity.label}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>
        {errors.activityTypes && <p className="text-red-500 text-xs mt-1">{errors.activityTypes.message}</p>}
      </div>

      <div className="space-y-3">
        <Label htmlFor="pacePreference" className="text-base font-semibold">{t('travelPace')}</Label>
        <Controller name="pacePreference" control={control} render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={t('selectPreferredPace')} />
            </SelectTrigger>
            <SelectContent>
              {PACE_PREFERENCE_IDS.map((id) => (
                <SelectItem key={id} value={id}>
                  {t('options.pacePreference.' + id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )} />
        {errors.pacePreference && <p className="text-red-500 text-xs mt-1">{errors.pacePreference.message}</p>}
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">{t('experienceTypes')}</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXPERIENCE_TYPE_IDS.map((id) => (
            <div key={id} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Controller name="experienceTypes" control={control} render={({ field }) => (
                <Checkbox
                  id={`experience-${id}`}
                  checked={field.value.includes(id)}
                  onCheckedChange={(checked) => toggleArrayValue('experienceTypes', id)}
                />
              )} />
              <Label htmlFor={`experience-${id}`} className="cursor-pointer text-sm font-medium">
                {t(`options.experienceTypes.${id}`)}
              </Label>
            </div>
          ))}
        </div>
      </div>
      {errors.experienceTypes && <p className="text-red-500 text-xs mt-1">{errors.experienceTypes.message}</p>}

      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {t('languagesYouSpeak')}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {LANGUAGE_IDS.map((langId) => {
            const isSelected = watchedPreferences.languages.some((l: { language: string }) => l.language === langId);

            return (
              <button
                key={langId}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setValue(
                      'languages',
                      watchedPreferences.languages.filter((l: { language: string }) => l.language !== langId),
                    );
                  } else {
                    setValue('languages', [
                      ...watchedPreferences.languages,
                      { language: langId, proficiency: 'intermediate' },
                    ]);
                  }
                }}
                className={`
                  p-3 rounded-lg border-2 transition-all text-sm font-medium
                  ${isSelected
                    ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                  }
                `}
              >
                {t(`options.languages.${langId}`)}
              </button>
            );
          })}
        </div>
        {errors.travelPurpose && <p className="text-red-500 text-xs mt-1">{errors.travelPurpose.message}</p>}
      </div>
    </div>
  );
}