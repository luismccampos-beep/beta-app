'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { BUDGET_CHIPS } from '../../../lib/travel/budget-chips';

import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  MapPin,
  Wallet,
  ChevronDown,
  Heart,
  Palmtree,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  applyAccountToTravelPreferences,
  mergeSavedTravelPreferences,
  type MeUserProfile,
} from '../../../lib/user/account-profile';
import {
  normalizePreferenceOptionIds,
} from '../../../lib/i18n/preferences-form-options';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import type { FilterOption } from '../../../types';

import type { TravelCatalogResponse } from '../../../lib/api-client';
import {
  TravelStyleSection,
  BudgetSection,
  FlightAccommodationSection,
  ActivitiesSection,
  SpecialRequirementsSection,
  AdvancedSettingsSection,
} from '../travel/preferences-sections';

import {
  quickStartSchema,
  travelPreferencesSchema,
  DEFAULT_TRAVEL_PREFERENCES,
  STEP_FIELDS,
  type TravelPreferences,
} from '../../../lib/travel/schemas/preferences.schema';

import {
  getSmartDefaults,
  inferFromTravelStyles,
} from '../../../lib/travel/smart-defaults';

// ── Constants ────────────────────────────────────────────────────────
const TOTAL_STEPS = 3;
const STEP_LABELS = ['destination', 'budget', 'review'] as const;

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', BRL: 'R$', JPY: '¥',
  CNY: '¥', AUD: '$', CAD: '$', CHF: 'Fr', INR: '₹',
  SGD: '$', MXN: '$',
};

// ── Interface ────────────────────────────────────────────────────────
interface EnhancedTravelPreferencesFormProps {
  onComplete?: (preferences: TravelPreferences) => void;
  onBack?: () => void;
}

// ── Component ────────────────────────────────────────────────────────
export function EnhancedTravelPreferencesForm({
  onComplete,
  onBack,
}: EnhancedTravelPreferencesFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('enhancedTravelPreferencesForm');
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRefinePanel, setShowRefinePanel] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    flight: false,
    activities: false,
    special: false,
    advanced: false,
  });

  const toggleSection = useCallback((key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const lastSavedDraftRef = useRef<string>('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
    getValues,
    reset,
  } = useForm<TravelPreferences>({
    resolver: zodResolver(travelPreferencesSchema) as any,
    defaultValues: DEFAULT_TRAVEL_PREFERENCES,
  });

  const preferences = watch();

  // ── Navigation helpers ──────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (onBack) { onBack(); return; }
    if (window.history.length > 1) { router.back(); return; }
    router.push('/dashboard');
  }, [onBack, router]);

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(TOTAL_STEPS - 1, prev + 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  // ── Smart defaults on mount ─────────────────────────────────────
  useEffect(() => {
    getSmartDefaults().then((defaults) => {
      const vals = getValues();
      if (!vals.nationality) setValue('nationality', defaults.nationality);
      if (!vals.currency || vals.currency === 'USD') {
        setValue('currency', defaults.currency);
      }
      if (!vals.languages?.length) {
        setValue('languages', defaults.languages);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Infer cabin/budget from travel styles ───────────────────────
  useEffect(() => {
    if (preferences.travelStyles.length > 0) {
      const inferred = inferFromTravelStyles(preferences.travelStyles);
      // Only set if user hasn't manually changed it
      if (!preferences.dailyBudgetProfile || preferences.dailyBudgetProfile === 'conforto') {
        setValue('dailyBudgetProfile', inferred.dailyBudgetProfile);
      }
      if (!preferences.cabinClass || preferences.cabinClass === 'economy') {
        setValue('cabinClass', inferred.cabinClass);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences.travelStyles]);

  // ── Load saved preferences ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/auth/me', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/user/preferences', { credentials: 'include' }).then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          authenticated?: boolean;
          preference?: { aiSettings?: unknown };
        };
        if (!res.ok || data.authenticated === false) return null;
        return data.preference?.aiSettings ?? null;
      }),
    ])
      .then(([me, aiSettings]) => {
        if (cancelled) return;
        const user =
          me && typeof me === 'object' &&
          (me as { authenticated?: boolean }).authenticated === true &&
          (me as { user?: unknown }).user &&
          typeof (me as { user: unknown }).user === 'object'
            ? ((me as { user: MeUserProfile }).user)
            : null;
        const merged = mergeSavedTravelPreferences(DEFAULT_TRAVEL_PREFERENCES, aiSettings);
        reset(normalizePreferenceOptionIds(applyAccountToTravelPreferences(merged, user)));
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [reset]);

  // ── Load draft from server + localStorage (fallback chain) ─────
  useEffect(() => {
    let cancelled = false;
    // 1. Try server draft first
    fetch('/api/user/preferences/draft', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok || cancelled) return null;
        const data = await res.json().catch(() => null);
        return data?.draft as TravelPreferences | null;
      })
      .then((serverDraft) => {
        if (cancelled) return;
        if (serverDraft && typeof serverDraft === 'object') {
          reset(serverDraft as TravelPreferences);
          lastSavedDraftRef.current = JSON.stringify(serverDraft);
          return;
        }
        // 2. Fallback to localStorage
        const saved = localStorage.getItem('travel_prefs_draft');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
              reset(parsed as TravelPreferences);
              lastSavedDraftRef.current = saved;
            }
          } catch { /* corrupt */ }
        }
      })
      .catch(() => {
        // 3. Last resort: localStorage
        if (cancelled) return;
        const saved = localStorage.getItem('travel_prefs_draft');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
              reset(parsed as TravelPreferences);
              lastSavedDraftRef.current = saved;
            }
          } catch { /* corrupt */ }
        }
      });
    return () => { cancelled = true; };
  }, [reset]);

  // ── Server draft auto-save ──────────────────────────────────────
  const saveDraftServerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const current = JSON.stringify(getValues());
    if (current === lastSavedDraftRef.current) return;

    // localStorage (immediate)
    localStorage.setItem('travel_prefs_draft', current);
    lastSavedDraftRef.current = current;

    // Server (debounced 2s)
    if (saveDraftServerRef.current) clearTimeout(saveDraftServerRef.current);
    saveDraftServerRef.current = setTimeout(() => {
      fetch('/api/user/preferences/draft', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ preferences: getValues(), step: currentStep }),
      }).catch(() => {});
    }, 2000);

    return () => {
      if (saveDraftServerRef.current) clearTimeout(saveDraftServerRef.current);
    };
  }, [preferences, getValues, currentStep]);

  // ── Catalog data ────────────────────────────────────────────────
  const [travelCatalog, setTravelCatalog] = useState<TravelCatalogResponse | null>(null);
  const [travelCatalogLoading, setTravelCatalogLoading] = useState(true);
  const [travelCatalogError, setTravelCatalogError] = useState<string | null>(null);

  const [filterCountries, setFilterCountries] = useState<FilterOption[]>([]);
  const [filterContinents, setFilterContinents] = useState<FilterOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    setTravelCatalogLoading(true);
    setTravelCatalogError(null);
    fetch(`/api/travel/catalog?locale=${encodeURIComponent(locale)}`)
      .then(async (res) => {
        const raw: unknown = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = raw && typeof raw === 'object' && 'message' in raw &&
            typeof (raw as { message: unknown }).message === 'string'
            ? (raw as { message: string }).message : `HTTP ${res.status}`;
          throw new Error(msg);
        }
        if (!raw || typeof raw !== 'object') throw new Error('Failed to load catalogue');
        return raw as TravelCatalogResponse;
      })
      .then((data) => {
        if (!cancelled) {
          setTravelCatalog(data);
          if (data.errors?.length) {
            setTravelCatalogError(
              data.errors.map((e) => `${e.source}: ${e.message}`).join(' · ')
            );
          }
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setTravelCatalog(null);
          setTravelCatalogError(
            e instanceof Error ? e.message : 'Failed to load catalogue'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setTravelCatalogLoading(false);
      });
    return () => { cancelled = true; };
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/travel/v1/destinations/countries')
      .then((r) => r.json())
      .then((data: { countries?: FilterOption[]; continents?: FilterOption[] }) => {
        if (cancelled) return;
        if (data.countries?.length) setFilterCountries(data.countries);
        if (data.continents?.length) setFilterContinents(data.continents);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // ── AI Insights (on-demand) ─────────────────────────────────────
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [aiInsightsError, setAiInsightsError] = useState<string | null>(null);
  const [aiInsightsText, setAiInsightsText] = useState<string | null>(null);
  const [aiInsightsGenerated, setAiInsightsGenerated] = useState(false);
  const aiInsightsLoadingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    aiInsightsLoadingRef.current = aiInsightsLoading;
  }, [aiInsightsLoading]);

  const generateInsights = useCallback(async () => {
    if (aiInsightsLoadingRef.current) return;
    aiInsightsLoadingRef.current = true;
    setAiInsightsLoading(true);
    setAiInsightsError(null);
    try {
      const res = await fetch('/api/ai/preferences-insights', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ preferences, locale }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean; answer?: string; message?: string;
      };
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to generate AI insights');
      }
      setAiInsightsText(data.answer ?? null);
      setAiInsightsGenerated(true);
    } catch (e: unknown) {
      setAiInsightsError(
        e instanceof Error ? e.message : 'Failed to generate AI insights'
      );
    } finally {
      aiInsightsLoadingRef.current = false;
      setAiInsightsLoading(false);
    }
  }, [preferences, locale]);

  // ── Submit ──────────────────────────────────────────────────────
  const onSubmit = async (formData: TravelPreferences) => {
    setIsProcessing(true);
    try {
      // Only validate the 3 quick-start fields
      const quickResult = quickStartSchema.safeParse(formData);
      if (!quickResult.success) {
        const firstError = Object.keys(
          quickResult.error.flatten().fieldErrors
        )[0];
        const el = document.querySelector(`[name="${firstError}"]`) as HTMLElement;
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus();
        el?.classList.add('animate-shake');
        setTimeout(() => el?.classList.remove('animate-shake'), 500);
        toast.error(
          firstError === 'travelStyles'
            ? t('selectAtLeastOneStyle')
            : firstError === 'budgetRange'
              ? t('selectBudget')
              : t('selectAtLeastOneDestination')
        );
        setIsProcessing(false);
        return;
      }

      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ preferences: formData }),
      });
      const result = (await res.json().catch(() => ({}))) as {
        success?: boolean; message?: string;
      };
      if (!res.ok || result.success === false) {
        throw new Error(result.message || 'Failed to save preferences');
      }

      // Clear draft on success
      localStorage.removeItem('travel_prefs_draft');

      if (onComplete) {
        onComplete(formData);
      } else {
        toast.success(t('preferenceSavedSuccess'), {
          description: t('preferenceSavedDesc'),
        });
        router.push('/results?from=quickstart');
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save preferences'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Derived values ──────────────────────────────────────────────
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const filledRequired = useMemo(() => {
    const reqFields = STEP_FIELDS[currentStep] ?? [];
    let count = 0;
    for (const f of reqFields) {
      const v = preferences[f];
      if (Array.isArray(v) && v.length > 0) count++;
      else if (typeof v === 'string' && v.trim() !== '') count++;
    }
    return count;
  }, [preferences, currentStep]);

  const remainingMinutes = Math.max(
    0,
    Math.round((TOTAL_STEPS - currentStep - 1) * 0.5)
  );

  // Build section form object
  const sectionForm = useMemo(() => ({
    control, watch, setValue, trigger, getValues, reset,
  }), [control, watch, setValue, trigger, getValues, reset]);

  const sectionProps = useMemo(() => ({
    form: sectionForm as any,
    preferences,
    errors: errors as any,
    t,
    travelCatalog,
    travelCatalogLoading,
    filterCountries,
    filterContinents,
    locale,
  }), [sectionForm, preferences, errors, t, travelCatalog, travelCatalogLoading, filterCountries, filterContinents, locale]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-32 md:pb-6 space-y-4 sm:space-y-6 overflow-x-hidden"
      noValidate
    >
      {/* ── Catalog error banner ──────────────────────────────── */}
      {travelCatalogError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          <p className="font-medium">{t('catalogPartialBanner')}</p>
          <p className="mt-1 text-xs opacity-90">{travelCatalogError}</p>
        </div>
      ) : null}

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8">
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="gap-2 shrink-0 min-h-11 touch-manipulation"
            aria-label={t('back')}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('back')}</span>
          </Button>
          <LanguageSwitcher />
        </div>
        <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300 px-1">
          {t('appSubtitle')}
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap px-1">
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-teal-300 dark:border-teal-600 text-teal-700 dark:text-teal-300">
            <Sparkles className="w-3.5 h-3.5" /> {t('aiEnhanced')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-teal-300 dark:border-teal-600 text-teal-700 dark:text-teal-300">
            <Globe className="w-3.5 h-3.5" /> {t('multiCurrency')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300">
            <TrendingUp className="w-3.5 h-3.5" /> {t('predictiveAnalytics')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300">
            <Shield className="w-3.5 h-3.5" /> {t('enterpriseSecurity')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-teal-300 dark:border-teal-600 text-teal-700 dark:text-teal-300">
            <Zap className="w-3.5 h-3.5" /> {t('realTimeProcessing')}
          </Badge>
        </div>
      </div>

      {/* ── Step Indicator ─────────────────────────────────────── */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          {/* Mobile: text + progress bar */}
          <div className="md:hidden text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('stepLabel')} {currentStep + 1} {t('of')} {TOTAL_STEPS}:{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {t(STEP_LABELS[currentStep])}
              </span>
            </p>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Desktop: circles */}
          <div className="hidden md:block">
            <div className="flex justify-between items-start relative mb-2 px-2 sm:px-0">
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
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                          : isActive
                            ? 'bg-gradient-to-br from-teal-600 to-orange-500 text-white scale-110'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        '✓'
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        isActive
                          ? 'font-semibold text-teal-700 dark:text-teal-300'
                          : isCompleted
                            ? 'font-medium text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {t(STEP_LABELS[index])}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skip / time estimate */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-3 px-1">
            <span>
              {filledRequired}/{STEP_FIELDS[currentStep]?.length ?? 0} {t('fieldsFilled')}
              {remainingMinutes > 0 ? ` · ~${remainingMinutes} min` : ''}
            </span>
            {currentStep < TOTAL_STEPS - 1 && (
              <button
                type="button"
                onClick={goNext}
                className="text-teal-600 hover:underline"
              >
                {t('skipThisStep')} →
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Step Content ────────────────────────────────────────── */}
      <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 sm:p-6 md:p-8">
          {/* Step 0: Destination */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
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

          {/* Step 1: Budget */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-teal-600" />
                  {t('whatsYourBudget')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('chooseBudgetProfile')}
                </p>
              </div>
              <BudgetSection {...sectionProps} />

              {/* ── Budget Chips (F4) ─────────────────────────── */}
              <div className="space-y-3 mt-4">
                <label className="text-base font-semibold">
                  {t('budgetRangePerTrip')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {BUDGET_CHIPS.map((chip) => {
                    const selected =
                      preferences.budgetRange[0] === chip.range[0] &&
                      preferences.budgetRange[1] === chip.range[1];
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => setValue('budgetRange', chip.range)}
                        className={`p-4 rounded-xl border-2 text-center transition-all touch-manipulation ${
                          selected
                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/30 shadow-md'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-teal-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">{chip.emoji}</div>
                        <div className="font-semibold text-sm">
                          {t(`budgetChips.${chip.id}`)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {CURRENCY_SYMBOLS[preferences.currency] ?? '€'}
                          {chip.range[0].toLocaleString()} –{' '}
                          {CURRENCY_SYMBOLS[preferences.currency] ?? '€'}
                          {chip.range[1].toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review & Submit */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                  {t('readyToSeeResults')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('reviewYourChoices')}
                </p>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/20">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-500 mb-1">{t('travelStyle')}</p>
                    <p className="font-semibold">
                      {preferences.travelStyles.length > 0
                        ? preferences.travelStyles.map((s) =>
                            t(`options.travelStyles.${s}`)
                          ).join(', ')
                        : t('notSet')}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/20">
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
                <Card className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/20">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-500 mb-1">{t('budget')}</p>
                    <p className="font-semibold">
                      {CURRENCY_SYMBOLS[preferences.currency] ?? '€'}
                      {preferences.budgetRange[0].toLocaleString()} –{' '}
                      {CURRENCY_SYMBOLS[preferences.currency] ?? '€'}
                      {preferences.budgetRange[1].toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights button */}
              <div className="bg-gradient-to-r from-teal-50 to-orange-50 dark:from-teal-900/20 dark:to-orange-900/20 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-orange-600 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-teal-900 dark:text-teal-200 mb-2">
                      {t('aiInsightsTitle')}
                    </p>
                    {aiInsightsLoading ? (
                      <p className="text-sm text-teal-700 dark:text-teal-300 animate-pulse">
                        {t('generatingInsights')}…
                      </p>
                    ) : aiInsightsError ? (
                      <p className="text-sm text-red-600">{aiInsightsError}</p>
                    ) : aiInsightsText ? (
                      <p className="text-sm text-teal-800 dark:text-teal-200 whitespace-pre-line">
                        {aiInsightsText}
                      </p>
                    ) : (
                      <p className="text-sm text-teal-700 dark:text-teal-300">
                        {t('aiInsightsHint')}
                      </p>
                    )}
                    {!aiInsightsGenerated && !aiInsightsLoading && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateInsights}
                        className="mt-3 gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        {t('generateInsights')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Refine button */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowRefinePanel(!showRefinePanel)}
                  className="text-sm text-gray-600 dark:text-gray-400 gap-2"
                >
                  {showRefinePanel ? t('hideAdvanced') : t('refinePreferences')}
                </Button>
              </div>

              {/* Advanced panel — accordion sections */}
              {showRefinePanel && (
                <div className="space-y-2 mt-4 border-t pt-6">
                  {/* Flight & Accommodation */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection('flight')}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                          openSections.flight ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                      <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
                      <span className="font-semibold text-sm">{t('flightAccommodationPreferences')}</span>
                    </button>
                    {openSections.flight && (
                      <div className="px-4 pb-4 pt-2">
                        <FlightAccommodationSection {...sectionProps} />
                      </div>
                    )}
                  </div>

                  {/* Activities & Experiences */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection('activities')}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                          openSections.activities ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                      <Palmtree className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                      <span className="font-semibold text-sm">{t('activitiesExperiences')}</span>
                    </button>
                    {openSections.activities && (
                      <div className="px-4 pb-4 pt-2">
                        <ActivitiesSection {...sectionProps} />
                      </div>
                    )}
                  </div>

                  {/* Special Requirements */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection('special')}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                          openSections.special ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                      <Shield className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                      <span className="font-semibold text-sm">{t('specialRequirementsNeeds')}</span>
                    </button>
                    {openSections.special && (
                      <div className="px-4 pb-4 pt-2">
                        <SpecialRequirementsSection {...sectionProps} />
                      </div>
                    )}
                  </div>

                  {/* Advanced Settings */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection('advanced')}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                          openSections.advanced ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                      <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0" />
                      <span className="font-semibold text-sm">{t('advancedSettingsAI')}</span>
                    </button>
                    {openSections.advanced && (
                      <div className="px-4 pb-4 pt-2">
                        <AdvancedSettingsSection {...sectionProps} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Navigation ──────────────────────────────────────────── */}
      {/* Desktop */}
      <div className="hidden md:flex justify-between gap-4 mt-6 pt-4 border-t dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={goPrev}
          disabled={currentStep === 0}
          size="lg"
          className="gap-2 min-h-11"
        >
          ← {t('previous')}
        </Button>

        {currentStep < TOTAL_STEPS - 1 ? (
          <Button
            type="button"
            onClick={goNext}
            size="lg"
            className="gap-2 min-h-11 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600"
          >
            {t('nextStep')} →
          </Button>
        ) : (
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
        )}
      </div>

      {/* Mobile navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden"
        role="navigation"
        aria-label={t('stepNavigation')}
      >
        <div className="flex flex-col-reverse gap-2 max-w-7xl mx-auto">
          {currentStep < TOTAL_STEPS - 1 ? (
            <Button
              onClick={goNext}
              size="lg"
              type="button"
              className="w-full min-h-12 gap-2 bg-gradient-to-r from-teal-600 to-orange-500 touch-manipulation"
            >
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
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={currentStep === 0}
            size="lg"
            className="w-full min-h-11 gap-2"
          >
            ← {t('previous')}
          </Button>
        </div>
      </div>

      {/* ── Trust indicators ────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-2 pb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span>SOC 2 Certified</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-700 dark:text-teal-300" />
          <span>GDPR Compliant</span>
        </div>
      </div>
    </form>
  );
}

// Types re-exported from the shared schema for backward compatibility
export { DEFAULT_TRAVEL_PREFERENCES } from '../../../lib/travel/schemas/preferences.schema';
export type { TravelPreferences } from '../../../lib/travel/schemas/preferences.schema';
