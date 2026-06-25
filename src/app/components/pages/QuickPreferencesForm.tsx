'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

import {
  ArrowRight,
  Sparkles,
  MapPin,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { BUDGET_CHIPS } from '../../../lib/travel/budget-chips';

import {
  quickStartSchema,
  DEFAULT_TRAVEL_PREFERENCES,
  type QuickStartPreferences,
} from '../../../lib/travel/schemas/preferences.schema';

import { inferFromTravelStyles } from '../../../lib/travel/smart-defaults';

import { createFormTracker } from '../../../lib/travel/analytics-tracker';

import { TravelStyleSection } from '../travel/preferences-sections/TravelStyleSection';
import { BudgetSection } from '../travel/preferences-sections/BudgetSection';
import type { FilterOption } from '../../../types';
import type { TravelCatalogResponse } from '../../../lib/api-client';

// ── Constants ──────────────────────────────────────────────────────
const TOTAL_STEPS = 3;
const STEP_LABELS = ['destination', 'budget', 'review'] as const;

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', BRL: 'R$', JPY: '¥',
  CNY: '¥', AUD: '$', CAD: '$', CHF: 'Fr', INR: '₹',
  SGD: '$', MXN: '$',
};

// Map dailyBudgetProfile IDs (mochileiro/conforto/luxo) to budget chip IDs (economico/conforto/premium/luxo)
const PROFILE_TO_CHIP: Record<string, string> = {
  mochileiro: 'economico',
  conforto: 'conforto',
  luxo: 'luxo',
};

// ── Defaults ───────────────────────────────────────────────────────
const QUICK_DEFAULTS: QuickStartPreferences = {
  travelStyles: [],
  budgetRange: [2000, 5000],
  preferredDestinations: [],
};

// ── Component ──────────────────────────────────────────────────────
export function QuickPreferencesForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('enhancedTravelPreferencesForm');
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const trackerRef = useRef(createFormTracker());
  const hasTrackedStart = useRef(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
    reset,
  } = useForm<QuickStartPreferences>({
    resolver: zodResolver(quickStartSchema) as any,
    defaultValues: QUICK_DEFAULTS,
  });

  const preferences = watch();

  // Keep a ref snapshot for stable callbacks
  const prefsRef = useRef(preferences);
  prefsRef.current = preferences;

  // ── Analytics: track form start ──────────────────────────────────
  useEffect(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackerRef.current.trackStart(TOTAL_STEPS);
    }
  }, []);

  // ── Load draft from localStorage ────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('travel_prefs_quick_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') reset(parsed);
      } catch { /* corrupt */ }
    }
  }, [reset]);



  // ── Infer budget from travel styles ─────────────────────────────
  useEffect(() => {
    if (preferences.travelStyles.length > 0) {
      const inferred = inferFromTravelStyles(preferences.travelStyles);
      const currentRange = getValues('budgetRange');
      if (currentRange[0] === 2000 && currentRange[1] === 5000) {
        // Only auto-set if still on default
        const chipId = PROFILE_TO_CHIP[inferred.dailyBudgetProfile] ?? 'conforto';
        const chip = BUDGET_CHIPS.find((c) => c.id === chipId);
        if (chip) setValue('budgetRange', chip.range as [number, number]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences.travelStyles, setValue, getValues]);

  // ── Save draft to localStorage ──────────────────────────────────
  useEffect(() => {
    localStorage.setItem('travel_prefs_quick_draft', JSON.stringify(preferences));
  }, [preferences]);

  // ── Catalog data (for destinations) ────────────────────────────
  const [travelCatalog, setTravelCatalog] = useState<TravelCatalogResponse | null>(null);
  const [travelCatalogLoading, setTravelCatalogLoading] = useState(true);
  const [filterCountries, setFilterCountries] = useState<FilterOption[]>([]);
  const [filterContinents, setFilterContinents] = useState<FilterOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/travel/catalog?locale=${encodeURIComponent(locale)}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setTravelCatalog(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setTravelCatalogLoading(false); });
    return () => { cancelled = true; };
  }, [locale]);

  useEffect(() => {
    fetch('/api/travel/v1/destinations/countries')
      .then((r) => r.json())
      .then((data: { countries?: FilterOption[]; continents?: FilterOption[] }) => {
        if (data.countries?.length) setFilterCountries(data.countries);
        if (data.continents?.length) setFilterContinents(data.continents);
      })
      .catch(() => {});
  }, []);

  // ── Navigation ──────────────────────────────────────────────────
  const goNext = useCallback(() => {
    trackerRef.current.trackStepCompletion(
      currentStep,
      STEP_LABELS[currentStep],
      currentStep === 0 ? prefsRef.current.travelStyles.length + prefsRef.current.preferredDestinations.length : 2,
    );
    setCurrentStep((prev) => Math.min(TOTAL_STEPS - 1, prev + 1));
  }, [currentStep]);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  // ── Submit ──────────────────────────────────────────────────────
  const onSubmit = async (data: QuickStartPreferences) => {
    setIsProcessing(true);
    try {
      const result = quickStartSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const firstKey = Object.keys(fieldErrors)[0];
        const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement;
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus();
        toast.error(
          firstKey === 'travelStyles'
            ? t('selectAtLeastOneStyle')
            : firstKey === 'budgetRange'
              ? t('selectBudget')
              : t('selectAtLeastOneDestination'),
        );
        setIsProcessing(false);
        return;
      }

      // Send quick-start fields to the API
      const fullPrefs = {
        travelStyles: data.travelStyles,
        budgetRange: data.budgetRange,
        preferredDestinations: data.preferredDestinations,
      };

      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ preferences: fullPrefs }),
      });

      const result2 = await res.json().catch(() => ({}));
      if (!res.ok || result2.success === false) {
        throw new Error(result2.message || 'Failed to save');
      }

      trackerRef.current.trackSubmission(
        data.travelStyles,
        data.budgetRange as [number, number],
        data.preferredDestinations.length,
      );

      localStorage.removeItem('travel_prefs_quick_draft');
      router.push('/results?from=quickstart');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao guardar');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Derived values ──────────────────────────────────────────────
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const remainingMinutes = Math.max(0, Math.round((TOTAL_STEPS - currentStep - 1) * 0.5));

  const filledRequired = useMemo(() => {
    if (currentStep === 0) {
      let count = 0;
      if (preferences.travelStyles.length > 0) count++;
      if (preferences.preferredDestinations.length > 0) count++;
      return count;
    }
    return currentStep === 1 ? 2 : 3; // budget always has default
  }, [preferences, currentStep]);

  // ── Section props ───────────────────────────────────────────────
  const sectionForm = useMemo(
    () => ({ control, watch, setValue, trigger: () => Promise.resolve(true), getValues, reset }),
    [control, watch, setValue, getValues, reset],
  );

  // Merge quick-start data with full defaults so section components don't crash
  // when accessing fields like preferredCountries, currency, etc.
  const fullPreferences = useMemo(() => ({
    ...DEFAULT_TRAVEL_PREFERENCES,
    travelStyles: preferences.travelStyles,
    budgetRange: preferences.budgetRange,
    preferredDestinations: preferences.preferredDestinations,
  }), [preferences]);

  const sectionProps = useMemo(
    () => ({
      form: sectionForm as any,
      preferences: fullPreferences as any,
      errors: errors as any,
      t: t as any,
      travelCatalog,
      travelCatalogLoading,
      filterCountries,
      filterContinents,
      locale,
    }),
    [sectionForm, fullPreferences, errors, t, travelCatalog, travelCatalogLoading, filterCountries, filterContinents, locale],
  );

  // ── Render ──────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-3xl mx-auto px-3 sm:px-4 pt-4 pb-32 md:pb-6 space-y-4"
      noValidate
    >
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t('appSubtitle')}
        </p>
      </div>

      {/* Step indicator */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-4">
          <div className="md:hidden text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('stepLabel')} {currentStep + 1} {t('of')} {TOTAL_STEPS}:{' '}
              <span className="font-semibold">{t(STEP_LABELS[currentStep])}</span>
            </p>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="hidden md:block">
            <div className="flex justify-between items-start relative mb-2">
              <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 dark:bg-gray-600 -z-10 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-teal-600 to-orange-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {[0, 1, 2].map((index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                          : isActive
                            ? 'bg-gradient-to-br from-teal-600 to-orange-500 text-white scale-110'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
                      }`}
                    >
                      {isCompleted ? '✓' : <span className="text-sm font-bold">{index + 1}</span>}
                    </div>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        isActive ? 'font-semibold text-teal-700 dark:text-teal-300' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {t(STEP_LABELS[index])}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
            <span>
              {filledRequired}/2 {t('fieldsFilled')}
              {remainingMinutes > 0 ? ` · ~${remainingMinutes} min` : ''}
            </span>
            {currentStep < TOTAL_STEPS - 1 && (
              <button type="button" onClick={goNext} className="text-teal-600 hover:underline touch-manipulation">
                {t('skipThisStep')} →
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step content */}
      <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 sm:p-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-teal-600" />
                  {t('whereDoYouWantToGo')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('chooseStyleAndDestinations')}
                </p>
              </div>
              <TravelStyleSection {...sectionProps} />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-teal-600" />
                  {t('whatsYourBudget')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('chooseBudgetProfile')}
                </p>
              </div>
              <BudgetSection {...sectionProps} />
              <div className="space-y-3 mt-4">
                <label className="text-base font-semibold">{t('budgetRangePerTrip')}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {BUDGET_CHIPS.map((chip) => {
                    const selected =
                      preferences.budgetRange[0] === chip.range[0] &&
                      preferences.budgetRange[1] === chip.range[1];
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => setValue('budgetRange', [...chip.range] as [number, number])}
                        className={`p-4 rounded-xl border-2 text-center transition-all touch-manipulation ${
                          selected
                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/30 shadow-md'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-teal-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">{chip.emoji}</div>
                        <div className="font-semibold text-sm">{t(`budgetChips.${chip.id}`)}</div>
                        <div className="text-xs text-gray-500">
                          €{chip.range[0].toLocaleString()} – €{chip.range[1].toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 text-center">
              <div className="border-b pb-4">
                <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                  {t('readyToSeeResults')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <Card className="border-teal-200 bg-teal-50/50 dark:bg-teal-900/20">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-500 mb-1">{t('travelStyle')}</p>
                    <p className="font-semibold">
                      {preferences.travelStyles.length > 0
                        ? preferences.travelStyles.map((s) => t(`options.travelStyles.${s}`)).join(', ')
                        : t('notSet')}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-teal-200 bg-teal-50/50 dark:bg-teal-900/20">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-500 mb-1">{t('destinations')}</p>
                    <p className="font-semibold">
                      {preferences.preferredDestinations.length > 0
                        ? preferences.preferredDestinations.slice(0, 3).join(', ') +
                          (preferences.preferredDestinations.length > 3
                            ? ` +${preferences.preferredDestinations.length - 3}`
                            : '')
                        : t('notSet')}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-teal-200 bg-teal-50/50 dark:bg-teal-900/20">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-500 mb-1">{t('budget')}</p>
                    <p className="font-semibold">
                      €{preferences.budgetRange[0].toLocaleString()} – €{preferences.budgetRange[1].toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isProcessing}
                  size="lg"
                  className="gap-2 min-h-12 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin">✨</span>
                      {t('preparingYourTrips')}
                    </>
                  ) : (
                    <>
                      {t('seeMyTrips')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2">{t('preferenceSavedDesc')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="hidden md:flex justify-between gap-4 mt-4 pt-4 border-t dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={goPrev}
          disabled={currentStep === 0}
          size="lg"
        >
          ← {t('previous')}
        </Button>
        {currentStep < TOTAL_STEPS - 1 ? (
          <Button type="button" onClick={goNext} size="lg" className="gap-2 bg-gradient-to-r from-teal-600 to-orange-500">
            {t('nextStep')} →
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isProcessing}
            size="lg"
            className="gap-2 min-h-12 bg-gradient-to-r from-teal-600 to-orange-500"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin">✨</span>
                {t('preparingYourTrips')}
              </>
            ) : (
              <>
                {t('seeMyTrips')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Mobile nav */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden"
        role="navigation"
        aria-label={t('stepNavigation')}
      >
        <div className="flex flex-col-reverse gap-2 max-w-7xl mx-auto">
          {currentStep < TOTAL_STEPS - 1 ? (
            <Button type="button" onClick={goNext} size="lg" className="w-full min-h-12 gap-2 bg-gradient-to-r from-teal-600 to-orange-500 touch-manipulation">
              {t('nextStep')} →
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isProcessing}
              size="lg"
              className="w-full min-h-12 gap-2 bg-gradient-to-r from-teal-600 to-orange-500 touch-manipulation"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">✨</span>
                  {t('preparingYourTrips')}
                </>
              ) : (
                <>
                  {t('seeMyTrips')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={goPrev} disabled={currentStep === 0} size="lg" className="w-full min-h-11 gap-2 touch-manipulation">
            ← {t('previous')}
          </Button>
        </div>
      </div>
    </form>
  );
}
