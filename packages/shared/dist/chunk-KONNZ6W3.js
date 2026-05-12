import {
  THEME_TYPES
} from "./chunk-OJDR5BF2.js";

// src/types/notifications.ts
var PRIORITY_WEIGHT = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4
};
var sortNotificationsByPriority = (a, b) => {
  const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

// src/types/ai-preferences/enums.ts
var AIProvider = /* @__PURE__ */ ((AIProvider2) => {
  AIProvider2["OpenAI"] = "openai";
  AIProvider2["Anthropic"] = "anthropic";
  AIProvider2["Google"] = "google";
  AIProvider2["Weather"] = "weather";
  AIProvider2["Currency"] = "currency";
  AIProvider2["Local"] = "local";
  return AIProvider2;
})(AIProvider || {});
var AI_PROVIDERS = { ...AIProvider };
var TravelStyle = /* @__PURE__ */ ((TravelStyle2) => {
  TravelStyle2["Luxury"] = "Luxury";
  TravelStyle2["Comfort"] = "Comfort";
  TravelStyle2["Budget"] = "Budget";
  TravelStyle2["Adventure"] = "Adventure";
  TravelStyle2["Cultural"] = "Cultural";
  TravelStyle2["Relaxation"] = "Relaxation";
  return TravelStyle2;
})(TravelStyle || {});
var TRAVEL_STYLES = { ...TravelStyle };
var SustainabilityLevel = /* @__PURE__ */ ((SustainabilityLevel2) => {
  SustainabilityLevel2["Low"] = "Low";
  SustainabilityLevel2["Medium"] = "Medium";
  SustainabilityLevel2["High"] = "High";
  return SustainabilityLevel2;
})(SustainabilityLevel || {});
var SUSTAINABILITY_LEVELS = { ...SustainabilityLevel };
var PersonalityType = /* @__PURE__ */ ((PersonalityType2) => {
  PersonalityType2["Professional"] = "Professional";
  PersonalityType2["Friendly"] = "Friendly";
  PersonalityType2["Enthusiastic"] = "Enthusiastic";
  PersonalityType2["Detailed"] = "Detailed";
  PersonalityType2["Concise"] = "Concise";
  PersonalityType2["Casual"] = "Casual";
  return PersonalityType2;
})(PersonalityType || {});
var PERSONALITY_TYPES = { ...PersonalityType };
var ResponseLength = /* @__PURE__ */ ((ResponseLength2) => {
  ResponseLength2["Short"] = "Short";
  ResponseLength2["Medium"] = "Medium";
  ResponseLength2["Detailed"] = "Detailed";
  ResponseLength2["Brief"] = "Brief";
  return ResponseLength2;
})(ResponseLength || {});
var RESPONSE_LENGTHS = { ...ResponseLength };
var NotificationType = /* @__PURE__ */ ((NotificationType2) => {
  NotificationType2["Email"] = "email";
  NotificationType2["Push"] = "push";
  NotificationType2["SMS"] = "sms";
  NotificationType2["InApp"] = "in-app";
  return NotificationType2;
})(NotificationType || {});
var NOTIFICATION_TYPES = { ...NotificationType };
var NotificationFrequency = /* @__PURE__ */ ((NotificationFrequency2) => {
  NotificationFrequency2["Immediate"] = "Immediate";
  NotificationFrequency2["Daily"] = "Daily";
  NotificationFrequency2["Weekly"] = "Weekly";
  NotificationFrequency2["Monthly"] = "Monthly";
  NotificationFrequency2["Never"] = "Never";
  return NotificationFrequency2;
})(NotificationFrequency || {});
var NOTIFICATION_FREQUENCIES = { ...NotificationFrequency };
var BudgetLevel = /* @__PURE__ */ ((BudgetLevel2) => {
  BudgetLevel2["Economy"] = "Economy";
  BudgetLevel2["Moderate"] = "Moderate";
  BudgetLevel2["Comfort"] = "Comfort";
  BudgetLevel2["Premium"] = "Premium";
  BudgetLevel2["Luxury"] = "Luxury";
  return BudgetLevel2;
})(BudgetLevel || {});
var BUDGET_LEVELS = { ...BudgetLevel };

// src/types/ai-preferences/interfaces.ts
var BUDGET_LEVEL_CONFIG = {
  ["Economy" /* Economy */]: {
    level: "Economy" /* Economy */,
    minAmount: 0,
    maxAmount: 500,
    label: "Economy",
    description: "Budget-friendly options for cost-conscious travelers"
  },
  ["Moderate" /* Moderate */]: {
    level: "Moderate" /* Moderate */,
    minAmount: 300,
    maxAmount: 1e3,
    label: "Moderate",
    description: "Moderate spending with balanced value"
  },
  ["Comfort" /* Comfort */]: {
    level: "Comfort" /* Comfort */,
    minAmount: 800,
    maxAmount: 2e3,
    label: "Comfort",
    description: "Comfortable spending for a relaxing experience"
  },
  ["Premium" /* Premium */]: {
    level: "Premium" /* Premium */,
    minAmount: 1500,
    maxAmount: 5e3,
    label: "Premium",
    description: "Premium experience with high-quality services"
  },
  ["Luxury" /* Luxury */]: {
    level: "Luxury" /* Luxury */,
    minAmount: 4e3,
    maxAmount: 5e4,
    label: "Luxury",
    description: "Luxury options with exclusive experiences"
  }
};
var SUPPORTED_CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "PLN",
  "CZK",
  "BRL",
  "CNY",
  "INR"
];

// src/types/ai-preferences/defaults.ts
var DEFAULT_AI_PREFERENCES = {
  openaiSecret: "",
  anthropicSecret: null,
  googleSecret: null,
  weatherApiKey: null,
  currencyApiKey: null,
  notifications: { email: true, push: true },
  temperature: 0.7,
  maxTokens: 2e3,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  selectedModel: "gpt-4-turbo-preview",
  interfaceSettings: {
    fontSize: "medium",
    theme: THEME_TYPES.auto,
    language: "pt",
    compactMode: false,
    showAdvancedOptions: false,
    enableKeyboardShortcuts: true,
    autoSave: true
  },
  securitySettings: {
    twoFactorAuthEnabled: false,
    enableTwoFactor: false,
    sessionTimeout: 3600,
    requirePasswordForSensitiveActions: true,
    enableAuditLog: true,
    allowRememberDevice: true,
    encryptLocalData: false
  },
  experimentalFeatures: {
    betaFeaturesEnabled: false,
    enableBetaFeatures: false,
    enableAdvancedAI: false,
    enableVoiceInput: false,
    enableRealTimeCollaboration: false,
    enablePredictiveSearch: false,
    enableSmartSuggestions: false
  },
  modelParameters: {
    temperature: 0.7,
    maxTokens: 2e3,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  },
  travelPreferences: {
    defaultBudgetRange: { min: 0, max: 1e4, currency: "EUR" },
    preferredTravelStyle: "Comfort" /* Comfort */,
    sustainabilityLevel: "Medium" /* Medium */,
    defaultTravelers: 1,
    preferredLanguages: ["pt", "en"],
    preferredRegions: [],
    avoidCountries: [],
    preferredActivities: [],
    dietaryRestrictions: [],
    accessibilityNeeds: [],
    accommodationPreferences: ["hotel"],
    transportationPreferences: ["flight", "train"],
    enableRealTimeData: true,
    enableWeatherIntegration: true,
    enableCurrencyConversion: true
  },
  personalizationSettings: {
    personalityType: "Professional" /* Professional */,
    responseLength: "Medium" /* Medium */,
    includeLocalTips: true,
    includeBudgetBreakdown: true,
    includeAlternatives: true,
    includeWeatherInfo: true,
    includeCulturalInfo: true,
    includeHistoricalContext: true,
    preferDetailedItineraries: true,
    showPriceComparisons: true
  },
  advancedSettings: {
    enableRealTimeData: true,
    enableWeatherIntegration: true,
    enableCurrencyConversion: true,
    cacheResponses: true,
    enableOfflineMode: false,
    autoSavePreferences: true,
    enableExperimentalFeatures: false,
    maxConcurrentRequests: 5,
    requestTimeout: 3e4,
    retryAttempts: 3,
    enableAnalytics: true
  },
  privacySettings: {
    participateInResearch: false,
    searchHistory: [],
    saveSearchHistory: true,
    shareDataForImprovement: false,
    allowPersonalization: true,
    enableLocationTracking: false,
    allowCookies: true,
    shareUsageStatistics: false,
    enableDataExport: true,
    autoDeleteHistoryAfter: 30,
    requireConsentForNewFeatures: true
  },
  notificationSettings: {
    enabled: true,
    types: ["email" /* Email */, "push" /* Push */],
    frequency: "Daily" /* Daily */,
    preferences: {
      tripSuggestions: true,
      priceAlerts: true,
      weatherUpdates: true,
      systemUpdates: true,
      marketingEmails: false
    }
  },
  version: "1.0.0",
  lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
  updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
  createdAt: (/* @__PURE__ */ new Date()).toISOString()
};

// src/types/ai-preferences/utils.ts
function validateAIPreferences(preferences) {
  if (!preferences || typeof preferences !== "object" || preferences === null) return false;
  const prefs = preferences;
  const requiredFields = [
    "openaiSecret",
    "interfaceSettings",
    "travelPreferences",
    "personalizationSettings",
    "advancedSettings",
    "privacySettings",
    "notificationSettings"
  ];
  const hasAllFields = requiredFields.every((field) => field in prefs);
  if (!hasAllFields) return false;
  if (typeof prefs.openaiSecret !== "string") return false;
  return true;
}

// src/types/ai-preferences/schemas.ts
import { z } from "zod";
var SUPPORTED_CURRENCIES2 = [
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "PLN",
  "CZK",
  "BRL",
  "CNY",
  "INR"
];
var SupportedCurrencySchema = z.enum(SUPPORTED_CURRENCIES2);
var SupportedLanguageSchema = z.enum([
  "pt",
  "en",
  "es",
  "fr",
  "de",
  "it",
  "nl",
  "ru",
  "ja",
  "ko",
  "zh",
  "ar",
  "hi"
]);
var AICapabilityTypeSchema = z.enum([
  "text-generation",
  "analysis",
  "reasoning",
  "multilingual",
  "safety",
  "coding",
  "math",
  "creative-writing",
  "summarization",
  "translation",
  "question-answering",
  "classification"
]);
var ActivityTypeSchema = z.enum([
  "museums",
  "hiking",
  "beaches",
  "nightlife",
  "shopping",
  "culinary",
  "historical-sites",
  "nature",
  "adventure-sports",
  "wellness",
  "photography",
  "festivals",
  "architecture"
]);
var DietaryRestrictionSchema = z.enum([
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "nut-allergy",
  "halal",
  "kosher",
  "keto",
  "paleo"
]);
var AccessibilityNeedSchema = z.enum([
  "wheelchair-accessible",
  "visual-impairment",
  "hearing-impairment",
  "mobility-assistance",
  "cognitive-support",
  "service-animal"
]);
var AccommodationTypeSchema = z.enum([
  "hotel",
  "hostel",
  "apartment",
  "villa",
  "resort",
  "bed-breakfast",
  "guesthouse",
  "camping",
  "glamping"
]);
var TransportationTypeSchema = z.enum([
  "flight",
  "train",
  "bus",
  "car-rental",
  "rideshare",
  "bicycle",
  "walking",
  "ferry",
  "cruise"
]);
var BudgetRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: SupportedCurrencySchema
}).refine((data) => data.max >= data.min, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["max"]
});
var NotificationSettingsSchema = z.object({
  enabled: z.boolean(),
  types: z.array(z.nativeEnum(NotificationType)),
  frequency: z.nativeEnum(NotificationFrequency),
  preferences: z.object({
    tripSuggestions: z.boolean(),
    priceAlerts: z.boolean(),
    weatherUpdates: z.boolean(),
    systemUpdates: z.boolean(),
    marketingEmails: z.boolean()
  }),
  quietHours: z.object({
    start: z.string(),
    end: z.string(),
    timezone: z.string()
  }).optional()
});
var ModelParametersSchema = z.object({
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1),
  topP: z.number().min(0).max(1),
  topK: z.number().min(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2),
  presencePenalty: z.number().min(-2).max(2),
  stopSequences: z.array(z.string()).optional(),
  seed: z.number().optional()
});
var TravelPreferencesDataSchema = z.object({
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
  enableCurrencyConversion: z.boolean()
});
var PersonalizationSettingsDataSchema = z.object({
  personalityType: z.nativeEnum(PersonalityType),
  responseLength: z.nativeEnum(ResponseLength),
  includeLocalTips: z.boolean(),
  includeBudgetBreakdown: z.boolean(),
  includeAlternatives: z.boolean(),
  includeWeatherInfo: z.boolean(),
  includeCulturalInfo: z.boolean(),
  includeHistoricalContext: z.boolean(),
  preferDetailedItineraries: z.boolean(),
  showPriceComparisons: z.boolean()
});
var AdvancedSettingsDataSchema = z.object({
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
  enableAnalytics: z.boolean()
});
var PrivacySettingsDataSchema = z.object({
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
  requireConsentForNewFeatures: z.boolean()
});
var InterfaceSettingsSchema = z.object({
  fontSize: z.string(),
  theme: z.enum([THEME_TYPES.light, THEME_TYPES.dark, THEME_TYPES.auto]),
  language: SupportedLanguageSchema,
  compactMode: z.boolean(),
  showAdvancedOptions: z.boolean(),
  enableKeyboardShortcuts: z.boolean(),
  autoSave: z.boolean()
});
var SecuritySettingsSchema = z.object({
  twoFactorAuthEnabled: z.boolean(),
  enableTwoFactor: z.boolean(),
  sessionTimeout: z.number().min(0),
  requirePasswordForSensitiveActions: z.boolean(),
  enableAuditLog: z.boolean(),
  allowRememberDevice: z.boolean(),
  encryptLocalData: z.boolean()
});
var ExperimentalFeaturesSchema = z.object({
  betaFeaturesEnabled: z.boolean(),
  enableBetaFeatures: z.boolean(),
  enableAdvancedAI: z.boolean(),
  enableVoiceInput: z.boolean(),
  enableRealTimeCollaboration: z.boolean(),
  enablePredictiveSearch: z.boolean(),
  enableSmartSuggestions: z.boolean()
});
var AIPreferencesSchema = z.object({
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
    mfaEnabled: z.boolean().optional()
  }).optional(),
  version: z.string(),
  lastUpdated: z.string(),
  updatedAt: z.string(),
  createdAt: z.string()
});

// src/types/traveler-profile.ts
var DOCUMENT_TYPE_LABELS = {
  passport: "Passport",
  national_id: "National ID",
  visa: "Visa",
  drivers_license: "Driver's License",
  travel_pass: "Travel Pass"
};
var BADGE_CONFIGS = {
  first_trip: {
    name: "First Trip",
    description: "Completed your first trip",
    icon: "Plane",
    threshold: 1
  },
  explorer: {
    name: "Explorer",
    description: "Visited 5 different countries",
    icon: "Globe",
    threshold: 5
  },
  world_traveler: {
    name: "World Traveler",
    description: "Visited 10 different countries",
    icon: "World",
    threshold: 10
  },
  early_booker: {
    name: "Early Booker",
    description: "Booked 3 trips more than 60 days in advance",
    icon: "Calendar",
    threshold: 3
  },
  sustainable_traveler: {
    name: "Sustainable Traveler",
    description: "Chose eco-friendly options 5 times",
    icon: "Leaf",
    threshold: 5
  },
  reviewer: {
    name: "Reviewer",
    description: "Left 5 reviews for your trips",
    icon: "Star",
    threshold: 5
  },
  loyal_customer: {
    name: "Loyal Customer",
    description: "Completed 10 trips with us",
    icon: "Heart",
    threshold: 10
  },
  adventure_seeker: {
    name: "Adventure Seeker",
    description: "Booked 3 adventure activities",
    icon: "Mountain",
    threshold: 3
  },
  culture_enthusiast: {
    name: "Culture Enthusiast",
    description: "Visited 5 museums or historical sites",
    icon: "Landmark",
    threshold: 5
  },
  beach_lover: {
    name: "Beach Lover",
    description: "Booked 3 beach destinations",
    icon: "Umbrella",
    threshold: 3
  },
  mountain_explorer: {
    name: "Mountain Explorer",
    description: "Completed 3 mountain trips",
    icon: "Tent",
    threshold: 3
  },
  city_hopper: {
    name: "City Hopper",
    description: "Visited 5 different cities",
    icon: "Building",
    threshold: 5
  },
  foodie_traveler: {
    name: "Foodie Traveler",
    description: "Booked 3 culinary experiences",
    icon: "Utensils",
    threshold: 3
  },
  budget_savvy: {
    name: "Budget Savvy",
    description: "Saved money using our deals 5 times",
    icon: "PiggyBank",
    threshold: 5
  },
  luxury_traveler: {
    name: "Luxury Traveler",
    description: "Booked 3 premium packages",
    icon: "Crown",
    threshold: 3
  }
};
var LOYALTY_STATUS_LABELS = {
  basic: "Basic",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  diamond: "Diamond",
  elite: "Elite",
  super_elite: "Super Elite",
  concierge: "Concierge"
};
var LOYALTY_CATEGORY_LABELS = {
  airline: "Airline",
  hotel: "Hotel",
  car_rental: "Car Rental",
  credit_card: "Credit Card",
  other: "Other"
};
var MEAL_PREFERENCE_LABELS = {
  standard: "Standard Meal",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  kosher: "Kosher",
  halal: "Halal",
  gluten_free: "Gluten Free",
  diabetic: "Diabetic Meal",
  low_sodium: "Low Sodium",
  hindu: "Hindu Meal",
  asian_veg: "Asian Vegetarian",
  other: "Other"
};
var SEAT_PREFERENCE_LABELS = {
  aisle: "Aisle Seat",
  window: "Window Seat",
  middle: "Middle Seat",
  no_preference: "No Preference"
};
var ASSISTANCE_NEED_LABELS = {
  wheelchair: "Wheelchair Assistance",
  visual_impairment: "Visual Impairment Support",
  hearing_impairment: "Hearing Impairment Support",
  mobility_assistance: "Mobility Assistance",
  oxygen_required: "Oxygen Required",
  service_animal: "Service Animal",
  stretcher: "Stretcher Required",
  medical_equipment: "Medical Equipment",
  cognitive_support: "Cognitive Support",
  other: "Other Assistance"
};
var TRAVELER_TYPE_LABELS = {
  adult: "Adult (12+ years)",
  child: "Child (2-11 years)",
  infant: "Infant (under 2 years)"
};
var DEFAULT_FLIGHT_PREFERENCES = {
  seatPreference: "no_preference",
  cabinClass: "economy",
  baggageDefaults: {
    checkedBags: 0,
    carryOnBags: 1
  },
  preferredAirlines: [],
  preferDirectFlights: true
};
var DEFAULT_HOTEL_PREFERENCES = {
  bedType: "no_preference",
  smokingPolicy: "no_preference",
  lateCheckoutPreference: false,
  preferredAmenities: []
};
var DEFAULT_BUDGET_GUARDRAILS = {
  currency: "EUR",
  alertThreshold: 80,
  budgetPeriod: "per_trip",
  includeFlights: true,
  includeHotels: true,
  includeActivities: true,
  includeMeals: true,
  includeTransport: true
};
var CABIN_CLASS_LABELS = {
  economy: "Economy",
  premium_economy: "Premium Economy",
  business: "Business",
  first: "First Class"
};
var BED_TYPE_LABELS = {
  single: "Single Bed",
  double: "Double Bed",
  queen: "Queen Bed",
  king: "King Bed",
  twin: "Twin Beds",
  no_preference: "No Preference"
};
var SMOKING_PREFERENCE_LABELS = {
  smoking: "Smoking Room",
  non_smoking: "Non-Smoking Room",
  no_preference: "No Preference"
};

export {
  PRIORITY_WEIGHT,
  sortNotificationsByPriority,
  AIProvider,
  AI_PROVIDERS,
  TravelStyle,
  TRAVEL_STYLES,
  SustainabilityLevel,
  SUSTAINABILITY_LEVELS,
  PersonalityType,
  PERSONALITY_TYPES,
  ResponseLength,
  RESPONSE_LENGTHS,
  NotificationType,
  NOTIFICATION_TYPES,
  NotificationFrequency,
  NOTIFICATION_FREQUENCIES,
  BudgetLevel,
  BUDGET_LEVELS,
  BUDGET_LEVEL_CONFIG,
  SUPPORTED_CURRENCIES,
  DEFAULT_AI_PREFERENCES,
  validateAIPreferences,
  SupportedCurrencySchema,
  SupportedLanguageSchema,
  AICapabilityTypeSchema,
  ActivityTypeSchema,
  DietaryRestrictionSchema,
  AccessibilityNeedSchema,
  AccommodationTypeSchema,
  TransportationTypeSchema,
  BudgetRangeSchema,
  NotificationSettingsSchema,
  ModelParametersSchema,
  TravelPreferencesDataSchema,
  PersonalizationSettingsDataSchema,
  AdvancedSettingsDataSchema,
  PrivacySettingsDataSchema,
  InterfaceSettingsSchema,
  SecuritySettingsSchema,
  ExperimentalFeaturesSchema,
  AIPreferencesSchema,
  DOCUMENT_TYPE_LABELS,
  BADGE_CONFIGS,
  LOYALTY_STATUS_LABELS,
  LOYALTY_CATEGORY_LABELS,
  MEAL_PREFERENCE_LABELS,
  SEAT_PREFERENCE_LABELS,
  ASSISTANCE_NEED_LABELS,
  TRAVELER_TYPE_LABELS,
  DEFAULT_FLIGHT_PREFERENCES,
  DEFAULT_HOTEL_PREFERENCES,
  DEFAULT_BUDGET_GUARDRAILS,
  CABIN_CLASS_LABELS,
  BED_TYPE_LABELS,
  SMOKING_PREFERENCE_LABELS
};
//# sourceMappingURL=chunk-KONNZ6W3.js.map