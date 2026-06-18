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
import { Check, ArrowLeft, Brain, Award, Leaf, Sparkles, TrendingUp, Shield, Zap, Globe, Bell, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  applyAccountToTravelPreferences,
  mergeSavedTravelPreferences,
  type MeUserProfile,
} from '../../../lib/user/account-profile';
import {
  normalizePreferenceOptionIds,
} from '../../../lib/i18n/preferences-form-options';
import { TravelBudgetProfileSelector } from '../travel/TravelBudgetProfileSelector';
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

// Define Zod schemas for nested objects if any, e.g., languages
const languageSchema = z.object({
  language: z.string().min(1, 'Language is required'),
  proficiency: z.string().min(1, 'Proficiency is required'),
});

// Main schema for TravelPreferences
const travelPreferencesSchema = z.object({
  // Travel Style (Step 0)
  travelStyles: z.array(z.string()).min(1, { message: 'Please select at least one travel style' }),
  travelFrequency: z.string().min(1, { message: 'Travel frequency is required' }),
  preferredDestinations: z.array(z.string()),
  travelPurpose: z.array(z.string()),
  nationality: z.string().min(1, { message: 'Nationality is required' }),
  preferredCountries: z.array(z.string()),
  preferredContinents: z.array(z.string()),

  // Budget (Step 1)
  budgetRange: z.array(z.number()).length(2, { message: 'Budget range must have a min and max value' }),
  currency: z.string().min(1, { message: 'Currency is required' }),
  budgetPriority: z.string().min(1, { message: 'Budget priority is required' }),
  dailyBudgetProfile: z.enum(['mochileiro', 'conforto', 'luxo'], { message: 'Daily budget profile is required' }),

  // Flight & Accommodation (Step 2)
  accommodationType: z.array(z.string()),
  cabinClass: z.string().min(1, { message: 'Cabin class is required' }),
  seatPreference: z.string().min(1, { message: 'Seat preference is required' }),
  mealPreference: z.string().min(1, { message: 'Meal preference is required' }),
  loyaltyPrograms: z.array(z.string()),
  hotelChain: z.array(z.string()),
  roomType: z.string(),
  amenities: z.array(z.string()),

  // Cruise (Siloah) - part of Step 2, conditionally validated
  cruiseEnabled: z.boolean(),
  cruiseDestinations: z.array(z.string()),
  cruiseBrandNames: z.array(z.string()),
  cruiseTier: z.string(),
  cruiseShipType: z.string(),
  cruiseDuration: z.string(),

  // Activities (Step 3)
  activityTypes: z.array(z.string()).min(1, { message: 'Please select at least one activity' }),
  pacePreference: z.string().min(1, { message: 'Travel pace is required' }),
  experienceTypes: z.array(z.string()),
  languages: z.array(languageSchema),

  // Special Requirements (Step 4)
  sustainabilityLevel: z.string().min(1, { message: 'Sustainability level is required' }),
  ecoPreferences: z.array(z.string()),
  carbonOffset: z.boolean(),
  dietaryRestrictions: z.array(z.string()),
  accessibility: z.array(z.string()),
  medicalConditions: z.string(),

  // Advanced Settings (Step 5)
  aiRecommendations: z.boolean(),
  dataSharing: z.boolean(),
  notifications: z.array(z.string()),
  privacyLevel: z.string().min(1, { message: 'Privacy level is required' }),
});

export type TravelPreferences = z.infer<typeof travelPreferencesSchema>;

export const DEFAULT_TRAVEL_PREFERENCES: TravelPreferences = {
  travelStyles: [],
  travelFrequency: '',
  preferredDestinations: [],
  travelPurpose: [],
  nationality: '',
  preferredCountries: [],
  preferredContinents: [],
  budgetRange: [5000, 15000],
  currency: 'USD',
  budgetPriority: 'balanced',
  dailyBudgetProfile: 'conforto',
  accommodationType: [],
  cabinClass: '',
  seatPreference: '',
  mealPreference: '',
  loyaltyPrograms: [],
  hotelChain: [],
  roomType: '',
  amenities: [],
  cruiseEnabled: false,
  cruiseDestinations: [],
  cruiseBrandNames: [],
  cruiseTier: '',
  cruiseShipType: '',
  cruiseDuration: '',
  activityTypes: [],
  pacePreference: 'moderate',
  experienceTypes: [],
  languages: [],
  sustainabilityLevel: 'medium',
  ecoPreferences: [],
  carbonOffset: false,
  dietaryRestrictions: [],
  accessibility: [],
  medicalConditions: '',
  aiRecommendations: true,
  dataSharing: false,
  notifications: ['email'],
  privacyLevel: 'standard',
};

interface EnhancedTravelPreferencesFormProps {
  onComplete?: (preferences: TravelPreferences) => void;
  onBack?: () => void;
}

export function EnhancedTravelPreferencesForm({ onComplete, onBack }: EnhancedTravelPreferencesFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('enhancedTravelPreferencesForm');
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiScore, setAiScore] = useState(0);
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
    resolver: zodResolver(travelPreferencesSchema),
    defaultValues: DEFAULT_TRAVEL_PREFERENCES,
  });

  const preferences = watch();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/dashboard');
  }, [onBack, router]);

  // Calculate AI Score based on completeness
  useEffect(() => {
    const requiredFields: (keyof TravelPreferences)[] = [
      'nationality',
      'travelStyles',
      'currency',
      'cabinClass',
      'seatPreference',
      'mealPreference',
      'activityTypes',
      'pacePreference',
      'sustainabilityLevel'
    ];
    let filledCount = 0;
    for (const field of requiredFields) {
      const value = preferences[field];
      if (Array.isArray(value)) {
        if (value.length > 0) filledCount++;
      } else if (typeof value === 'string') {
        if (value.trim() !== '') filledCount++;
      } else if (value !== undefined && value !== null) {
        filledCount++;
      }
    }
    setAiScore(Math.round((filledCount / requiredFields.length) * 100));
  }, [preferences]);

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
          me &&
          typeof me === 'object' &&
          (me as { authenticated?: boolean }).authenticated === true &&
          (me as { user?: unknown }).user &&
          typeof (me as { user: unknown }).user === 'object'
            ? ((me as { user: MeUserProfile }).user)
            : null;
        const merged = mergeSavedTravelPreferences(DEFAULT_TRAVEL_PREFERENCES, aiSettings);
        reset(normalizePreferenceOptionIds(applyAccountToTravelPreferences(merged, user)));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [reset]);

  const [travelCatalog, setTravelCatalog] = useState<TravelCatalogResponse | null>(null);
  const [travelCatalogLoading, setTravelCatalogLoading] = useState(true);
  const [travelCatalogError, setTravelCatalogError] = useState<string | null>(null);

  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [aiInsightsError, setAiInsightsError] = useState<string | null>(null);
  const [aiInsightsText, setAiInsightsText] = useState<string | null>(null);

  const [filterCountries, setFilterCountries] = useState<FilterOption[]>([]);
  const [filterContinents, setFilterContinents] = useState<FilterOption[]>([]);

  const aiInsightsEnabled = useMemo(() => preferences.aiRecommendations && aiScore > 50, [preferences.aiRecommendations, aiScore]);

  // Fetch countries & continents for filter dropdowns
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

  // Auto-save draft to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('travel_prefs_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          reset(parsed as TravelPreferences);
          lastSavedDraftRef.current = saved;
        }
      } catch { /* ignore corrupt drafts */ }
    }
  }, [reset]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = JSON.stringify(getValues());
      if (current !== lastSavedDraftRef.current) {
        localStorage.setItem('travel_prefs_draft', current);
        lastSavedDraftRef.current = current;
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [preferences, getValues]);

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof TravelPreferences)[] = [];
    switch (step) {
      case 0:
        fieldsToValidate = ['nationality', 'travelStyles', 'travelFrequency', 'travelPurpose', 'preferredCountries', 'preferredContinents', 'preferredDestinations'];
        break;
      case 1:
        fieldsToValidate = ['currency', 'dailyBudgetProfile', 'budgetRange', 'budgetPriority', 'cabinClass'];
        break;
      case 2:
        fieldsToValidate = ['seatPreference', 'mealPreference', 'accommodationType', 'roomType', 'amenities', 'hotelChain'];
        if (preferences.cruiseEnabled) {
          fieldsToValidate.push('cruiseDestinations', 'cruiseTier', 'cruiseShipType', 'cruiseDuration');
        }
        break;
      case 3:
        fieldsToValidate = ['activityTypes', 'pacePreference', 'experienceTypes', 'languages'];
        break;
      case 4:
        fieldsToValidate = ['sustainabilityLevel', 'ecoPreferences', 'carbonOffset', 'dietaryRestrictions', 'accessibility', 'medicalConditions'];
        break;
      case 5:
        fieldsToValidate = ['aiRecommendations', 'dataSharing', 'notifications', 'privacyLevel'];
        break;
      default:
        return true;
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (!isValid) {
      const firstErrorField = fieldsToValidate.find(field => errors[field]);
      if (firstErrorField) {
        toast.error(errors[firstErrorField]?.message || t('validationError'));
      }
    }
    return isValid;
  };

  const validateAll = async (): Promise<boolean> => {
    const allFields = Object.keys(travelPreferencesSchema.shape) as (keyof TravelPreferences)[];
    const isValid = await trigger(allFields as any);
    if (!isValid) {
      const firstErrorField = allFields.find(field => errors[field]);
      if (firstErrorField) {
        toast.error(errors[firstErrorField]?.message || t('validationError'));
      }
    }
    return isValid;
  };

  // Fetch travel catalog
  useEffect(() => {
    let cancelled = false;
    setTravelCatalogLoading(true);
    setTravelCatalogError(null);
    fetch(`/api/travel/catalog?locale=${encodeURIComponent(locale)}`)
      .then(async (res) => {
        const raw: unknown = await res.json().catch(() => null);
        if (!res.ok) {
          const msg =
            raw &&
            typeof raw === 'object' &&
            'message' in raw &&
            typeof (raw as { message: unknown }).message === 'string'
              ? (raw as { message: string }).message
              : `HTTP ${res.status}`;
          throw new Error(msg);
        }
        if (!raw || typeof raw !== 'object') throw new Error('Failed to load travel catalogue');
        return raw as TravelCatalogResponse;
      })
      .then((data) => {
        if (!cancelled) {
          setTravelCatalog(data);
          if (data.errors?.length) {
            setTravelCatalogError(data.errors.map((e) => `${e.source}: ${e.message}`).join(' · '));
          }
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setTravelCatalog(null);
          setTravelCatalogError(e instanceof Error ? e.message : 'Failed to load travel catalogue');
        }
      })
      .finally(() => {
        if (!cancelled) setTravelCatalogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    if (!aiInsightsEnabled) {
      setAiInsightsText(null);
      setAiInsightsError(null);
      return;
    }

    let cancelled = false;
    setAiInsightsLoading(true);
    setAiInsightsError(null);
    fetch('/api/ai/preferences-insights', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ preferences, locale }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; answer?: string; message?: string };
        if (!res.ok || data.ok === false) throw new Error(data.message || 'Failed to generate AI insights');
        return data.answer ?? '';
      })
      .then((answer) => {
        if (!cancelled) setAiInsightsText(answer || null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setAiInsightsError(e instanceof Error ? e.message : 'Failed to generate AI insights');
      })
      .finally(() => {
        if (!cancelled) setAiInsightsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [aiInsightsEnabled, locale, preferences]);

  const onSubmit = async (formData: TravelPreferences) => {
    setIsProcessing(true);

    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ preferences: formData }),
      });
      const result = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || result.success === false) {
        throw new Error(result.message || 'Failed to save preferences');
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      setAiScore(100);
      toast.success(t('preferenceSavedSuccess'), {
        description: t('preferenceSavedDesc'),
      });

      if (onComplete) {
        setTimeout(() => {
          onComplete(preferences);
        }, 900);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 'style', label: t('travelStyle'), icon: Sparkles },
    { id: 'budget', label: t('budget'), icon: () => null },
    { id: 'preferences', label: t('preferences'), icon: () => null },
    { id: 'activities', label: t('activities'), icon: () => null },
    { id: 'special', label: t('specialNeeds'), icon: () => null },
    { id: 'settings', label: t('settings'), icon: () => null },
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Calculate traveler insights
  const getTravelerType = () => {
    const key = preferences.travelStyles.includes('luxury')
      ? 'luxury'
      : preferences.travelStyles.includes('business')
        ? 'business'
        : preferences.travelStyles.includes('adventure')
          ? 'adventure'
          : preferences.travelStyles.includes('family')
            ? 'family'
            : 'default';
    return t(`travelerType.${key}`);
  };

  const getBudgetCategory = () => {
    const max = preferences.budgetRange[1];
    if (max > 30000) return t('budgetCategory.ultraLuxury');
    if (max > 20000) return t('budgetCategory.luxury');
    if (max > 10000) return t('budgetCategory.premium');
    return t('budgetCategory.standard');
  };

  const getSustainabilityScore = () => {
    let score = 0;
    if (preferences.sustainabilityLevel === 'high') score += 40;
    if (preferences.sustainabilityLevel === 'medium') score += 20;
    if (preferences.carbonOffset) score += 30;
    score += preferences.ecoPreferences.length * 10;
    return Math.min(100, score);
  };

  const sectionProps = {
    form: { control, watch, setValue, trigger, getValues, reset } as any,
    preferences,
    errors: errors as any,
    t,
    travelCatalog,
    travelCatalogLoading,
    filterCountries,
    filterContinents,
    locale,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-32 md:pb-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      {travelCatalogError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          <p className="font-medium">{t('catalogPartialBanner')}</p>
          <p className="mt-1 text-xs opacity-90">{travelCatalogError}</p>
        </div>
      ) : null}

      {/* Header */}
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
        <p className="text-base sm:text-xl text-gray-700 px-1">
          {t('appSubtitle')}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto px-1">
          {t('appFeatures')}
        </p>

        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap px-1">
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-teal-300 text-teal-700">
            <Sparkles className="w-3.5 h-3.5" /> {t('aiEnhanced')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-teal-300 text-teal-700">
            <Globe className="w-3.5 h-3.5" /> {t('multiCurrency')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-orange-300 text-orange-700">
            <TrendingUp className="w-3.5 h-3.5" /> {t('predictiveAnalytics')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-orange-300 text-orange-700">
            <Shield className="w-3.5 h-3.5" /> {t('enterpriseSecurity')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-teal-300 text-teal-700">
            <Zap className="w-3.5 h-3.5" /> {t('realTimeProcessing')}
          </Badge>
        </div>
      </div>

      {/* AI Intelligence Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-700" />
                <span className="text-base font-semibold">{t('aiIntelligenceScore')}</span>
              </div>
              <span className="text-2xl font-bold text-teal-700">{Math.round(aiScore)}%</span>
            </div>
            <Progress value={aiScore} className="h-2 mt-2" />
            <p className="text-xs text-gray-600 mt-2">{t('profileCompletion')}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              <span className="text-base font-semibold">{t('travelerProfile')}</span>
            </div>
            <p className="text-lg font-semibold text-orange-900 mt-2">{getTravelerType()}</p>
            <p className="text-xs text-gray-600 mt-1">{t('aiGeneratedClassification')}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="text-base font-semibold">{t('sustainabilityScore')}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={getSustainabilityScore()} className="h-2 flex-1" />
              <span className="text-sm font-semibold text-green-600">{getSustainabilityScore()}%</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">{t('ecoImpactRating')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Steps */}
      <Card className="bg-white shadow-sm overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="-mx-1 overflow-x-auto overscroll-x-contain pb-1 sm:overflow-visible sm:mx-0">
            <div className="flex justify-between items-start relative mb-2 min-w-[min(100%,22rem)] sm:min-w-0 px-2 sm:px-0 gap-0.5">
              <div className="absolute top-4 sm:top-5 left-6 right-6 sm:left-0 sm:right-0 h-0.5 sm:h-1 bg-gray-200 -z-10 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-teal-600 to-orange-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={async () => {
                      if (index <= currentStep || await validateStep(currentStep)) setCurrentStep(index);
                    }}
                    className="flex flex-col items-center gap-1 sm:gap-2 group cursor-pointer min-w-[2.75rem] sm:min-w-0 flex-1 sm:flex-none touch-manipulation"
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={step.label}
                  >
                    <div
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 relative shrink-0
                        ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg' :
                          isActive ? 'bg-gradient-to-br from-teal-600 to-orange-500 text-white sm:scale-110 shadow-xl' :
                          'bg-gray-200 text-gray-400 group-hover:bg-gray-300 group-active:bg-gray-300'}
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <span className="text-xs sm:text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs leading-tight text-center max-w-[4.5rem] sm:max-w-none sm:whitespace-nowrap hidden sm:block ${
                        isActive
                          ? 'font-semibold text-teal-700'
                          : isCompleted
                            ? 'font-medium text-green-600'
                            : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-center mt-3 sm:mt-4 px-1">
            <p className="text-sm text-gray-600">
              {t('stepLabel')} {currentStep + 1} {t('of')} {totalSteps}:{' '}
              <span className="font-semibold text-gray-900 block sm:inline mt-0.5 sm:mt-0">
                {steps[currentStep].label}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Content - Render the appropriate section */}
      <Card className="shadow-lg">
        <CardContent className="p-4 sm:p-6 md:p-8">
          {currentStep === 0 && <TravelStyleSection {...sectionProps} />}
          {currentStep === 1 && <BudgetSection {...sectionProps} />}
          {currentStep === 2 && <FlightAccommodationSection {...sectionProps} />}
          {currentStep === 3 && <ActivitiesSection {...sectionProps} />}
          {currentStep === 4 && <SpecialRequirementsSection {...sectionProps} />}
          {currentStep === 5 && <AdvancedSettingsSection {...sectionProps} />}
        </CardContent>
      </Card>

      {/* Navigation - sticky no telemóvel */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t md:border-t">
        <div className="hidden md:flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            size="lg"
            className="gap-2 min-h-11"
          >
            ← {t('previous')}
          </Button>
          {currentStep < totalSteps - 1 ? (
            <Button
              type="button"
              onClick={async () => { if (await validateStep(currentStep)) setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1)); }}
              size="lg"
              className="gap-2 min-h-11 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600"
            >
              {t('nextStep')} →
            </Button>
          ) : (
            <Button
              type="button"
              onClick={async () => { if (await validateAll()) handleSubmit(onSubmit)(); }}
              disabled={isProcessing}
              size="lg"
              className="gap-2 min-h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isProcessing ? (
                <>
                  <Brain className="w-5 h-5 animate-pulse" />
                  {t('processingWithAI')}
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {t('completeProfile')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden"
        role="navigation"
        aria-label={t('stepLabel')}
      >
        <div className="flex flex-col-reverse gap-2 max-w-7xl mx-auto">
          {currentStep < totalSteps - 1 ? (
            <Button
              onClick={async () => { if (await validateStep(currentStep)) setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1)); }}
              size="lg"
              type="button"
              className="w-full min-h-12 gap-2 bg-gradient-to-r from-teal-600 to-orange-500 touch-manipulation"
            >
              {t('nextStep')} →
            </Button>
          ) : (
            <Button
              type="button"
              onClick={async () => { if (await validateAll()) handleSubmit(onSubmit)(); }}
              disabled={isProcessing}
              size="lg"
              className="w-full min-h-12 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 touch-manipulation"
            >
              {isProcessing ? (
                <>
                  <Brain className="w-5 h-5 animate-pulse" />
                  {t('processingWithAI')}
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {t('completeProfile')}
                </>
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            size="lg"
            className="w-full min-h-11 gap-2"
          >
            ← {t('previous')}
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      <Card className="border-2 border-teal-300 bg-gradient-to-br from-teal-50 via-cyan-50 to-orange-50 shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-xl mb-4">
            <Sparkles className="w-6 h-6 text-orange-600" />
            <span className="font-bold">{t('aiGeneratedInsights')}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{t('travelerType.label')}</p>
              <p className="font-bold text-lg text-teal-900">{getTravelerType()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{t('budgetCategory.label')}</p>
              <p className="font-bold text-lg text-orange-900">{getBudgetCategory()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{t('travelStyle')}</p>
              <p className="font-bold text-lg text-teal-900">
                {preferences.travelStyles.length > 0
                  ? getTravelerType()
                  : 'Not Set'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{t('ecoScore')}</p>
              <p className="font-bold text-lg text-emerald-900">{getSustainabilityScore()}%</p>
            </div>
          </div>

          {aiInsightsEnabled && (
            <div className="mt-4 bg-gradient-to-r from-teal-100 via-cyan-100 to-orange-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-teal-700 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-teal-900 mb-2">{t('aiRecommendationsReady')}</p>
                  {aiInsightsLoading ? (
                    <p className="text-sm text-teal-800">{t('processingWithAI')}</p>
                  ) : aiInsightsError ? (
                    <p className="text-sm text-red-700">{aiInsightsError}</p>
                  ) : aiInsightsText ? (
                    <p className="text-sm text-teal-800 whitespace-pre-line">{aiInsightsText}</p>
                  ) : (
                    <p className="text-sm text-teal-800">
                      {t('basedOnProfile')} {preferences.preferredDestinations[0] || 'Europe'}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap text-xs sm:text-sm text-gray-600 px-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span>SOC 2 Certified</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-700" />
          <span>256-bit Encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-700" />
          <span>GDPR Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-600" />
          <span>ISO 27001</span>
        </div>
      </div>
    </form>
  );
}