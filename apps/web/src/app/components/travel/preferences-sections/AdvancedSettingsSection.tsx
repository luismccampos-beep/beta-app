'use client';

import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { Check, Zap, Brain, Sparkles, Bell, Lock, Shield, Award } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { PreferencesSectionProps } from './types';
import {
  NOTIFICATION_IDS,
  PRIVACY_LEVEL_IDS,
} from '../../../../lib/i18n/preferences-form-options';

export function AdvancedSettingsSection({
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
          <Zap className="w-6 h-6 text-yellow-700 dark:text-yellow-400" /> {t('advancedSettingsAI')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('customizeAIExperience')}
        </p>
      </div>

      <Card className="border-2 border-primary-200 dark:border-primary-700 bg-gradient-to-br from-primary-50 dark:from-gray-800 via-cyan-50 dark:via-gray-800 to-accent-50 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary-700 dark:text-primary-200" />
            {t('aiPoweredFeatures')}
          </CardTitle>
          <CardDescription>
            {t('leverageEnterpriseAI')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="space-y-1 flex-1">
              <Label htmlFor="aiRecommendations" className="font-semibold text-base">
                {t('enableAIRecommendations')}
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('aiRecommendationsDesc')}
              </p>
              <div className="flex gap-2 pt-2">
                <Badge variant="secondary" className="text-xs">{t('options.aiBadges.predictiveAnalytics')}</Badge>
                <Badge variant="secondary" className="text-xs">{t('options.aiBadges.machineLearning')}</Badge>
                <Badge variant="secondary" className="text-xs">{t('options.aiBadges.realTimeOptimization')}</Badge>
              </div>
            </div>
            <Controller name="aiRecommendations" control={control} render={({ field }) => (
              <Checkbox
                id="aiRecommendations"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="ml-4"
              />
            )} />
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="space-y-1 flex-1">
              <Label htmlFor="dataSharing" className="font-semibold text-base">
                {t('enhancedDataAnalysis')}
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('enhancedDataDesc')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                {t('dataAnonymized')}
              </p>
            </div>
            <Controller name="dataSharing" control={control} render={({ field }) => (
              <Checkbox
                id="dataSharing"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="ml-4"
              />
            )} />
          </div>

          {watchedPreferences.aiRecommendations && (
            <div className="bg-gradient-to-r from-primary-100 dark:from-primary-900/50 to-accent-100 dark:to-accent-700/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-accent-700 dark:text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary-900 dark:text-primary-200">{t('aiIntelligenceActivated')}</p>
                  <p className="text-sm text-primary-700 dark:text-primary-200 mt-1">
                    {t('profileAnalyzed')}
                  </p>
                  <ul className="text-sm text-primary-700 dark:text-primary-200 mt-2 space-y-1 ml-4">
                    <li>• {t('personalizedDestinations')}</li>
                    <li>• {t('dynamicPricing')}</li>
                    <li>• {t('predictivePlanning')}</li>
                    <li>• {t('realtimeAdjustments')}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-accent-200 dark:border-accent-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent dark:text-accent-500" />
            {t('notificationPreferences')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {NOTIFICATION_IDS.map((id) => (
            <div key={id} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 touch-manipulation">
              <Controller name="notifications" control={control} render={({ field }) => (
                <Checkbox
                  id={`notif-${id}`}
                  checked={field.value.includes(id)}
                  onCheckedChange={(checked) => toggleArrayValue('notifications', id)}
                />
              )} />
              <div className="flex-1">
                <Label htmlFor={`notif-${id}`} className="cursor-pointer font-medium">
                  {t(`options.notifications.${id}`)}
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t(`options.notificationDesc.${id}`)}</p>
              </div>
            </div>
          ))}
          {errors.notifications && <p className="text-red-500 text-xs mt-1" role="alert">{errors.notifications.message}</p>}
        </CardContent>
      </Card>

      <Card className="border-gray-300 dark:border-gray-600 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {t('privacySecurity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="privacyLevel" className="text-base font-semibold">{t('privacyLevel')}</Label>
            <Controller name="privacyLevel" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t('privacyLevel')} />
                </SelectTrigger>
                <SelectContent>
                  {PRIVACY_LEVEL_IDS.map((id) => (
                    <SelectItem key={id} value={id}>
                      {t(`options.privacyLevel.${id}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
            {errors.privacyLevel && <p className="text-red-500 text-xs mt-1" role="alert">{errors.privacyLevel.message}</p>}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              {t('securityCertifications')}
            </div>
            <div className="flex flex-wrap gap-2">
              {(['soc2', 'iso27001', 'gdpr', 'ccpa', 'pci'] as const).map((key) => (
                <Badge key={key} variant="outline">{t(`options.securityBadges.${key}`)}</Badge>
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 pt-2">
              {t('allDataEncrypted')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}