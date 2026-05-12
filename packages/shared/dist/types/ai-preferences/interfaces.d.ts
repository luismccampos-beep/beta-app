import { AIProvider, TravelStyle, SustainabilityLevel, PersonalityType, ResponseLength, NotificationType, NotificationFrequency, BudgetLevel } from './enums';
/**
 * Budget range configuration for each budget level
 * Maps BudgetLevel to recommended min/max values in EUR
 */
export interface BudgetRangeConfig {
    readonly level: BudgetLevel;
    readonly minAmount: number;
    readonly maxAmount: number;
    readonly label: string;
    readonly description: string;
}
/**
 * Default budget range configurations for the 5 money choices
 */
export declare const BUDGET_LEVEL_CONFIG: Record<BudgetLevel, BudgetRangeConfig>;
export declare const SUPPORTED_CURRENCIES: readonly ["EUR", "USD", "GBP", "JPY", "CAD", "AUD", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK", "BRL", "CNY", "INR"];
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
export type SupportedLanguage = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'nl' | 'ru' | 'ja' | 'ko' | 'zh' | 'ar' | 'hi';
export type AICapabilityType = 'text-generation' | 'analysis' | 'reasoning' | 'multilingual' | 'safety' | 'coding' | 'math' | 'creative-writing' | 'summarization' | 'translation' | 'question-answering' | 'classification';
export type ActivityType = 'museums' | 'hiking' | 'beaches' | 'nightlife' | 'shopping' | 'culinary' | 'historical-sites' | 'nature' | 'adventure-sports' | 'wellness' | 'photography' | 'festivals' | 'architecture';
export type DietaryRestriction = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-allergy' | 'halal' | 'kosher' | 'keto' | 'paleo';
export type AccessibilityNeed = 'wheelchair-accessible' | 'visual-impairment' | 'hearing-impairment' | 'mobility-assistance' | 'cognitive-support' | 'service-animal';
export type AccommodationType = 'hotel' | 'hostel' | 'apartment' | 'villa' | 'resort' | 'bed-breakfast' | 'guesthouse' | 'camping' | 'glamping';
export type TransportationType = 'flight' | 'train' | 'bus' | 'car-rental' | 'rideshare' | 'bicycle' | 'walking' | 'ferry' | 'cruise';
export interface AIModelData {
    readonly id: string;
    readonly name: string;
    readonly provider: AIProvider;
    readonly description: string;
    readonly capabilities: readonly AICapabilityType[];
    readonly maxTokens: number;
    readonly costPerToken: number;
    readonly costPerRequest?: number;
    readonly isAvailable: boolean;
    readonly isDeprecated?: boolean;
    readonly deprecatedAt?: string;
    readonly replacementModel?: string;
    readonly contextWindow: number;
    readonly supportedLanguages: readonly string[];
    readonly releaseDate?: string;
    readonly version?: string;
}
export interface BudgetRange {
    readonly min: number;
    readonly max: number;
    readonly currency: SupportedCurrency;
}
export interface NotificationSettings {
    readonly enabled: boolean;
    readonly types: readonly NotificationType[];
    readonly frequency: NotificationFrequency;
    readonly preferences: {
        readonly tripSuggestions: boolean;
        readonly priceAlerts: boolean;
        readonly weatherUpdates: boolean;
        readonly systemUpdates: boolean;
        readonly marketingEmails: boolean;
    };
    readonly quietHours?: {
        readonly start: string;
        readonly end: string;
        readonly timezone: string;
    };
}
export interface ModelParameters {
    readonly temperature: number;
    readonly maxTokens: number;
    readonly topP: number;
    readonly topK?: number;
    readonly frequencyPenalty: number;
    readonly presencePenalty: number;
    readonly stopSequences?: readonly string[];
    readonly seed?: number;
}
export interface TravelPreferencesData {
    readonly defaultBudgetRange: BudgetRange;
    readonly preferredTravelStyle: TravelStyle;
    readonly sustainabilityLevel: SustainabilityLevel;
    readonly defaultTravelers: number;
    readonly preferredLanguages: readonly SupportedLanguage[];
    readonly preferredRegions: readonly string[];
    readonly avoidCountries: readonly string[];
    readonly preferredActivities: readonly ActivityType[];
    readonly dietaryRestrictions: readonly DietaryRestriction[];
    readonly accessibilityNeeds: readonly AccessibilityNeed[];
    readonly accommodationPreferences: readonly AccommodationType[];
    readonly transportationPreferences: readonly TransportationType[];
    readonly enableRealTimeData: boolean;
    readonly enableWeatherIntegration: boolean;
    readonly enableCurrencyConversion: boolean;
}
export interface PersonalizationSettingsData {
    readonly personalityType: PersonalityType;
    readonly responseLength: ResponseLength;
    readonly includeLocalTips: boolean;
    readonly includeBudgetBreakdown: boolean;
    readonly includeAlternatives: boolean;
    readonly includeWeatherInfo: boolean;
    readonly includeCulturalInfo: boolean;
    readonly includeHistoricalContext: boolean;
    readonly preferDetailedItineraries: boolean;
    readonly showPriceComparisons: boolean;
}
export interface AdvancedSettingsData {
    readonly enableRealTimeData: boolean;
    readonly enableWeatherIntegration: boolean;
    readonly enableCurrencyConversion: boolean;
    readonly cacheResponses: boolean;
    readonly enableOfflineMode: boolean;
    readonly autoSavePreferences: boolean;
    readonly enableExperimentalFeatures: boolean;
    readonly maxConcurrentRequests: number;
    readonly requestTimeout: number;
    readonly retryAttempts: number;
    readonly enableAnalytics: boolean;
}
export interface PrivacySettingsData {
    readonly participateInResearch: boolean;
    readonly searchHistory: readonly string[];
    readonly saveSearchHistory: boolean;
    readonly shareDataForImprovement: boolean;
    readonly allowPersonalization: boolean;
    readonly enableLocationTracking: boolean;
    readonly allowCookies: boolean;
    readonly shareUsageStatistics: boolean;
    readonly enableDataExport: boolean;
    readonly autoDeleteHistoryAfter: number;
    readonly requireConsentForNewFeatures: boolean;
}
export interface InterfaceSettings {
    fontSize: string;
    readonly theme: 'light' | 'dark' | 'auto';
    readonly language: SupportedLanguage;
    readonly compactMode: boolean;
    readonly showAdvancedOptions: boolean;
    readonly enableKeyboardShortcuts: boolean;
    readonly autoSave: boolean;
}
export interface AISecuritySettings {
    twoFactorAuthEnabled: boolean;
    readonly enableTwoFactor: boolean;
    readonly sessionTimeout: number;
    readonly requirePasswordForSensitiveActions: boolean;
    readonly enableAuditLog: boolean;
    readonly allowRememberDevice: boolean;
    readonly encryptLocalData: boolean;
}
export interface ExperimentalFeatures {
    readonly betaFeaturesEnabled: boolean;
    readonly enableBetaFeatures: boolean;
    readonly enableAdvancedAI: boolean;
    readonly enableVoiceInput: boolean;
    readonly enableRealTimeCollaboration: boolean;
    readonly enablePredictiveSearch: boolean;
    readonly enableSmartSuggestions: boolean;
}
export interface AIPreferences {
    openaiSecret: string;
    anthropicSecret: string | null;
    googleSecret: string | null;
    weatherApiKey: string | null;
    currencyApiKey: string | null;
    notifications: {
        email: boolean;
        push: boolean;
    } | undefined;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    readonly interfaceSettings: InterfaceSettings;
    readonly securitySettings: AISecuritySettings;
    readonly experimentalFeatures: ExperimentalFeatures;
    readonly selectedModel: string;
    readonly modelParameters: ModelParameters;
    readonly travelPreferences: TravelPreferencesData;
    readonly personalizationSettings: PersonalizationSettingsData;
    readonly advancedSettings: AdvancedSettingsData;
    readonly privacySettings: PrivacySettingsData;
    readonly notificationSettings: NotificationSettings;
    readonly security?: {
        readonly encryptionKey?: string;
        readonly allowedIPs?: readonly string[];
        readonly blockedIPs?: readonly string[];
        readonly requireVPN?: boolean;
        readonly sessionDuration?: number;
        readonly mfaEnabled?: boolean;
    };
    readonly version: string;
    readonly lastUpdated: string;
    updatedAt: string;
    readonly createdAt: string;
}
export interface MonthlyUsage {
    month: string;
    tokens: number;
    requests: number;
    cost: number;
}
export interface DailyUsage {
    date: string;
    tokens: number;
    requests: number;
}
export interface FeatureUsage {
    feature: string;
    count: number;
}
export interface PerformanceMetricsData {
    readonly p50?: number;
    readonly p90?: number;
    readonly p95?: number;
    readonly p99?: number;
    readonly p50ResponseTime?: number;
    readonly p95ResponseTime?: number;
    readonly p99ResponseTime?: number;
    readonly errorsByType?: Record<string, number>;
    readonly cacheHitRate?: number;
}
export interface APIStatusData {
    readonly name: string;
    readonly status: 'connected' | 'error' | 'disconnected';
    readonly responseTime: number;
    readonly uptime: number;
}
export interface APIPerformanceData {
    readonly averageResponseTime: number;
    readonly cacheHitRate: number;
    readonly successRate: number;
    readonly totalRequests: number;
}
export interface AIUsageStats {
    readonly totalRequests: number;
    readonly tokensUsed: number;
    readonly averageResponseTime: number;
    readonly successRate: number;
    readonly errorRate: number;
    readonly favoriteFeatures: readonly string[];
    readonly mostUsedModel: string;
    readonly totalCost: number;
    readonly costSavings: number;
    readonly monthlyUsage: readonly MonthlyUsage[];
    readonly dailyUsage: readonly DailyUsage[];
    readonly featureUsage: readonly FeatureUsage[];
    readonly performanceMetrics: PerformanceMetricsData;
}
