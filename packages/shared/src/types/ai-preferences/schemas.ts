// packages/shared/src/types/ai-preferences/schemas.ts
import { z } from 'zod';

import { THEME_TYPES } from '../../themes';
import {
  TravelStyle,
  SustainabilityLevel,
  PersonalityType,
  ResponseLength,
  NotificationType,
  NotificationFrequency,
} from './enums';
const SUPPORTED_CURRENCIES = [
  'EUR',
  'USD',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'CZK',
  'BRL',
  'CNY',
  'INR',
] as const;

export const SupportedCurrencySchema = z.enum(SUPPORTED_CURRENCIES);

export const SupportedLanguageSchema = z.enum([
  'pt', 'en', 'es', 'fr', 'de', 'it', 'nl', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi'
]);

export const AICapabilityTypeSchema = z.enum([
  'text-generation', 'analysis', 'reasoning', 'multilingual', 'safety', 'coding',
  'math', 'creative-writing', 'summarization', 'translation', 'question-answering', 'classification'
]);

export const ActivityTypeSchema = z.enum([
  'museums', 'hiking', 'beaches', 'nightlife', 'shopping', 'culinary', 'historical-sites',
  'nature', 'adventure-sports', 'wellness', 'photography', 'festivals', 'architecture'
]);

export const DietaryRestrictionSchema = z.enum([
  'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-allergy', 'halal', 'kosher', 'keto', 'paleo'
]);

export const AccessibilityNeedSchema = z.enum([
  'wheelchair-accessible', 'visual-impairment', 'hearing-impairment', 'mobility-assistance',
  'cognitive-support', 'service-animal'
]);

export const AccommodationTypeSchema = z.enum([
  'hotel', 'hostel', 'apartment', 'villa', 'resort', 'bed-breakfast', 'guesthouse', 'camping', 'glamping'
]);

export const TransportationTypeSchema = z.enum([
  'flight', 'train', 'bus', 'car-rental', 'rideshare', 'bicycle', 'walking', 'ferry', 'cruise'
]);

export const BudgetRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: SupportedCurrencySchema,
}).refine(data => data.max >= data.min, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ['max']
});

export const NotificationSettingsSchema = z.object({
  enabled: z.boolean(),
  types: z.array(z.nativeEnum(NotificationType)),
  frequency: z.nativeEnum(NotificationFrequency),
  preferences: z.object({
    tripSuggestions: z.boolean(),
    priceAlerts: z.boolean(),
    weatherUpdates: z.boolean(),
    systemUpdates: z.boolean(),
    marketingEmails: z.boolean(),
  }),
  quietHours: z.object({
    start: z.string(),
    end: z.string(),
    timezone: z.string(),
  }).optional(),
});

export const ModelParametersSchema = z.object({
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1),
  topP: z.number().min(0).max(1),
  topK: z.number().min(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2),
  presencePenalty: z.number().min(-2).max(2),
  stopSequences: z.array(z.string()).optional(),
  seed: z.number().optional(),
});

export const TravelPreferencesDataSchema = z.object({
  defaultBudgetRange: BudgetRangeSchema,
  preferredTravelStyle: z.nativeEnum(TravelStyle),
  sustainabilityLevel: z.nativeEnum(SustainabilityLevel),
  defaultTravelers: z.number().min(1),
  preferredLanguages: z.array(SupportedLanguageSchema),
  preferredRegions: z.array(z.string()),
  avoidCountries: z.array(z.string()),
  preferredActivities: z.array(ActivityTypeSchema),
  dietaryRestrictions: z.array(DietaryRestrictionSchema),
  accessibilityNeeds: z.array(AccessibilityNeedSchema),
  accommodationPreferences: z.array(AccommodationTypeSchema),
  transportationPreferences: z.array(TransportationTypeSchema),
  enableRealTimeData: z.boolean(),
  enableWeatherIntegration: z.boolean(),
  enableCurrencyConversion: z.boolean(),
});

export const PersonalizationSettingsDataSchema = z.object({
  personalityType: z.nativeEnum(PersonalityType),
  responseLength: z.nativeEnum(ResponseLength),
  includeLocalTips: z.boolean(),
  includeBudgetBreakdown: z.boolean(),
  includeAlternatives: z.boolean(),
  includeWeatherInfo: z.boolean(),
  includeCulturalInfo: z.boolean(),
  includeHistoricalContext: z.boolean(),
  preferDetailedItineraries: z.boolean(),
  showPriceComparisons: z.boolean(),
});

export const AdvancedSettingsDataSchema = z.object({
  enableRealTimeData: z.boolean(),
  enableWeatherIntegration: z.boolean(),
  enableCurrencyConversion: z.boolean(),
  cacheResponses: z.boolean(),
  enableOfflineMode: z.boolean(),
  autoSavePreferences: z.boolean(),
  enableExperimentalFeatures: z.boolean(),
  maxConcurrentRequests: z.number().min(1),
  requestTimeout: z.number().min(0),
  retryAttempts: z.number().min(0),
  enableAnalytics: z.boolean(),
});

export const PrivacySettingsDataSchema = z.object({
  participateInResearch: z.boolean(),
  searchHistory: z.array(z.string()),
  saveSearchHistory: z.boolean(),
  shareDataForImprovement: z.boolean(),
  allowPersonalization: z.boolean(),
  enableLocationTracking: z.boolean(),
  allowCookies: z.boolean(),
  shareUsageStatistics: z.boolean(),
  enableDataExport: z.boolean(),
  autoDeleteHistoryAfter: z.number().min(0),
  requireConsentForNewFeatures: z.boolean(),
});

export const InterfaceSettingsSchema = z.object({
  fontSize: z.string(),
  theme: z.enum([THEME_TYPES.light, THEME_TYPES.dark, THEME_TYPES.auto]),
  language: SupportedLanguageSchema,
  compactMode: z.boolean(),
  showAdvancedOptions: z.boolean(),
  enableKeyboardShortcuts: z.boolean(),
  autoSave: z.boolean(),
});

export const SecuritySettingsSchema = z.object({
  twoFactorAuthEnabled: z.boolean(),
  enableTwoFactor: z.boolean(),
  sessionTimeout: z.number().min(0),
  requirePasswordForSensitiveActions: z.boolean(),
  enableAuditLog: z.boolean(),
  allowRememberDevice: z.boolean(),
  encryptLocalData: z.boolean(),
});

export const ExperimentalFeaturesSchema = z.object({
  betaFeaturesEnabled: z.boolean(),
  enableBetaFeatures: z.boolean(),
  enableAdvancedAI: z.boolean(),
  enableVoiceInput: z.boolean(),
  enableRealTimeCollaboration: z.boolean(),
  enablePredictiveSearch: z.boolean(),
  enableSmartSuggestions: z.boolean(),
});

export const AIPreferencesSchema = z.object({
  openaiSecret: z.string(),
  anthropicSecret: z.string().nullable(),
  googleSecret: z.string().nullable(),
  weatherApiKey: z.string().nullable(),
  currencyApiKey: z.string().nullable(),
  notifications: z.object({ email: z.boolean(), push: z.boolean() }).optional(),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1),
  topP: z.number().min(0).max(1),
  frequencyPenalty: z.number().min(-2).max(2),
  presencePenalty: z.number().min(-2).max(2),
  interfaceSettings: InterfaceSettingsSchema,
  securitySettings: SecuritySettingsSchema,
  experimentalFeatures: ExperimentalFeaturesSchema,
  selectedModel: z.string(),
  modelParameters: ModelParametersSchema,
  travelPreferences: TravelPreferencesDataSchema,
  personalizationSettings: PersonalizationSettingsDataSchema,
  advancedSettings: AdvancedSettingsDataSchema,
  privacySettings: PrivacySettingsDataSchema,
  notificationSettings: NotificationSettingsSchema,
  security: z.object({
    encryptionKey: z.string().optional(),
    allowedIPs: z.array(z.string()).optional(),
    blockedIPs: z.array(z.string()).optional(),
    requireVPN: z.boolean().optional(),
    sessionDuration: z.number().optional(),
    mfaEnabled: z.boolean().optional(),
  }).optional(),
  version: z.string(),
  lastUpdated: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
});
