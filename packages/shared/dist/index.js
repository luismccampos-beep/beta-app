import {
  AuthProvider,
  useAuth,
  useAuthSafe,
  useAuthState,
  useIsAuthenticated,
  useUser
} from "./chunk-PWIFC2AT.js";
import {
  AuthService,
  authService
} from "./chunk-Z36D22FI.js";
import {
  ApiClientError,
  api_client_default
} from "./chunk-7UFFMIFN.js";
import {
  i18n_default
} from "./chunk-OIVCGGHD.js";
import {
  AICapabilityTypeSchema,
  AIPreferencesSchema,
  AIProvider,
  AI_PROVIDERS,
  ASSISTANCE_NEED_LABELS,
  AccessibilityNeedSchema,
  AccommodationTypeSchema,
  ActivityTypeSchema,
  AdvancedSettingsDataSchema,
  BADGE_CONFIGS,
  BED_TYPE_LABELS,
  BUDGET_LEVELS,
  BUDGET_LEVEL_CONFIG,
  BudgetLevel,
  BudgetRangeSchema,
  CABIN_CLASS_LABELS,
  DEFAULT_AI_PREFERENCES,
  DEFAULT_BUDGET_GUARDRAILS,
  DEFAULT_FLIGHT_PREFERENCES,
  DEFAULT_HOTEL_PREFERENCES,
  DOCUMENT_TYPE_LABELS,
  DietaryRestrictionSchema,
  ExperimentalFeaturesSchema,
  InterfaceSettingsSchema,
  LOYALTY_CATEGORY_LABELS,
  LOYALTY_STATUS_LABELS,
  MEAL_PREFERENCE_LABELS,
  ModelParametersSchema,
  NOTIFICATION_FREQUENCIES,
  NOTIFICATION_TYPES,
  NotificationFrequency,
  NotificationSettingsSchema,
  NotificationType,
  PERSONALITY_TYPES,
  PRIORITY_WEIGHT,
  PersonalityType,
  PersonalizationSettingsDataSchema,
  PrivacySettingsDataSchema,
  RESPONSE_LENGTHS,
  ResponseLength,
  SEAT_PREFERENCE_LABELS,
  SMOKING_PREFERENCE_LABELS,
  SUPPORTED_CURRENCIES,
  SUSTAINABILITY_LEVELS,
  SecuritySettingsSchema,
  SupportedCurrencySchema,
  SupportedLanguageSchema,
  SustainabilityLevel,
  TRAVELER_TYPE_LABELS,
  TRAVEL_STYLES,
  TransportationTypeSchema,
  TravelPreferencesDataSchema,
  TravelStyle,
  sortNotificationsByPriority,
  validateAIPreferences
} from "./chunk-KONNZ6W3.js";
import "./chunk-ZVTZN5YK.js";
import {
  DemoButtons
} from "./chunk-EJSVGHKB.js";
import {
  API_BASE_URL,
  APP_NAME,
  APP_ROUTES,
  HTTP_STATUS,
  LOCALE_KEYS,
  SUPPORTED_LANGUAGES,
  USER_ROLES
} from "./chunk-RAXPT32B.js";
import {
  createAddOnService,
  createAuthor,
  createBlogPost,
  createCategory,
  createFAQ,
  createManyAuthors,
  createManyBlogPosts,
  createManyCategories,
  createManyFAQs,
  createManyPackageServices,
  createManyReviews,
  createManySupportAgents,
  createManySupportArticles,
  createManyTestimonials,
  createPackageService,
  createReview,
  createServiceAvailability,
  createServiceProvider,
  createSupportAgent,
  createSupportArticle,
  createTestimonial
} from "./chunk-PVR633CW.js";
import {
  createManySystemPaymentMethods,
  createSystemPaymentMethod
} from "./chunk-VVQO3KJX.js";
import "./chunk-QUALQIBR.js";
import {
  computeExtrasBreakdown,
  computeTotals,
  sumExtrasTotal
} from "./chunk-3IQVQXON.js";
import {
  resources
} from "./chunk-SFNFDB4Q.js";
import {
  es_default
} from "./chunk-M7FNTMPM.js";
import {
  fr_default
} from "./chunk-4ONF4IE7.js";
import {
  pt_default
} from "./chunk-JRH5WCKB.js";
import {
  en_default
} from "./chunk-I6NFRQEG.js";
import "./chunk-DFFWZKPR.js";
import {
  ComponentError,
  NavigationError,
  logger,
  normalizeError,
  reportError
} from "./chunk-WQRUFWRD.js";
import {
  THEME_TYPES,
  adaptLegacyTheme,
  breakpoints,
  colors,
  createDarkTheme,
  createLightTheme,
  createTheme,
  createThemePair,
  cssVar,
  cssVarsString,
  darkTheme,
  durations,
  easings,
  extendTheme,
  extractCssVars,
  generateThemeCss,
  lightTheme,
  radii,
  semanticColors,
  shadows,
  spacing,
  theme,
  themeToCssVars,
  typography,
  validateTheme,
  zIndex
} from "./chunk-OJDR5BF2.js";
import {
  BlogCard_default,
  BookingDialog,
  FAQSection,
  PriceSummary
} from "./chunk-WQXMXCBG.js";
import {
  AdminBreadcrumbs
} from "./chunk-2GRZZY7C.js";
import {
  DashboardCard
} from "./chunk-4UBIL3SS.js";
import {
  DateRangePicker
} from "./chunk-TSAXZHV3.js";
import {
  Sidebar
} from "./chunk-BLBDBE6C.js";
import "./chunk-7MUGDIVR.js";
import "./chunk-VC7FNLKH.js";
import "./chunk-F3UNIGPC.js";
import {
  EventManager,
  addDays,
  batchDOMUpdates,
  camelToTitle,
  cancelAnimationFrameWrapper,
  capitalize,
  createLazyImageLoader,
  createOptimizedResizeHandler,
  createOptimizedScrollHandler,
  debounce,
  diffDays,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDuration,
  formatFileSize,
  formatNumber,
  formatPercentage,
  formatPhoneNumber,
  formatStatNumber,
  formatStatusBadge,
  formatTime,
  formatters,
  getFeatureConfig,
  isFeatureEnabled,
  isInViewport,
  optimizeAnimation,
  optimizedDebounce,
  prefersReducedMotion,
  preloadResource,
  requestAnimationFrameWrapper,
  sanitizeHref,
  sanitizeText,
  smoothScrollTo,
  throttle,
  toDateString,
  trackGtagEvent,
  truncateText
} from "./chunk-3TW2EZWB.js";
import {
  dateSchema,
  emailSchema,
  nonEmptyString,
  optionalDate,
  optionalString,
  passwordSchema,
  phoneSchema,
  positiveNumber,
  requiredString,
  urlSchema,
  uuidSchema,
  validateWithSchema
} from "./chunk-RP6JGCEK.js";
import {
  cn
} from "./chunk-CDRKFMWH.js";
import {
  ContactInfo_default
} from "./chunk-O5M3IBBN.js";
import {
  FeaturedDestinations_default
} from "./chunk-CGTNB4FH.js";
import {
  LanguageSwitcherSize,
  LanguageSwitcherVariant,
  LanguageSwitcher_default
} from "./chunk-IMWOEUS6.js";
import {
  LanguageSwitcherNextIntl_default
} from "./chunk-TS44AWE4.js";
import {
  ChatMetric,
  SUCCESS_METRICS,
  initializeMonitoring,
  trackChatEvent,
  trackChatMetric,
  trackError,
  trackEvent,
  trackMonitoringEvent
} from "./chunk-OIADZH25.js";
import {
  FEATURES
} from "./chunk-TP5M5ICF.js";
import {
  getEnv,
  isBrowser,
  isEnvEnabled,
  isNext
} from "./chunk-QYGYBXGO.js";
import {
  Config,
  config,
  validateEnv
} from "./chunk-5NOVLBOW.js";
import {
  __require
} from "./chunk-FQY4JAKU.js";

// src/hooks/useAIPreferences.ts
import { useCallback, useEffect, useState, useMemo } from "react";
var STORAGE_KEY = "akmleva-ai-preferences";
var BACKUP_KEY = "akmleva-ai-preferences-backup";
var CACHE_DURATION = 5 * 60 * 1e3;
function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("[useAIPreferences] Failed to load from localStorage:", error);
  }
  return null;
}
function saveToStorage(preferences) {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error("[useAIPreferences] Failed to save to localStorage:", error);
    return false;
  }
}
function saveBackup(preferences) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify({
      preferences,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn("[useAIPreferences] Failed to save backup:", error);
  }
}
function loadBackup() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(BACKUP_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        preferences: parsed.preferences,
        timestamp: parsed.timestamp
      };
    }
  } catch (error) {
    console.warn("[useAIPreferences] Failed to load backup:", error);
  }
  return null;
}
function createDefaultPreferences() {
  return {
    ...DEFAULT_AI_PREFERENCES,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function validatePreferences(data) {
  if (!data || typeof data !== "object") return false;
  const prefs = data;
  return prefs.travelPreferences !== void 0 && prefs.personalizationSettings !== void 0 && prefs.advancedSettings !== void 0;
}
function useAIPreferences() {
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useEffect(() => {
    const initializePreferences = () => {
      setIsLoading(true);
      setError(null);
      try {
        let storedPrefs = loadFromStorage();
        if (!storedPrefs || !validatePreferences(storedPrefs)) {
          const backup = loadBackup();
          if (backup && validatePreferences(backup.preferences)) {
            storedPrefs = backup.preferences;
            saveToStorage(storedPrefs);
          }
        }
        if (!storedPrefs || !validatePreferences(storedPrefs)) {
          storedPrefs = createDefaultPreferences();
          saveToStorage(storedPrefs);
        }
        setPreferences(storedPrefs);
      } catch (err) {
        console.error("[useAIPreferences] Initialization error:", err);
        setError("Failed to load preferences");
        const defaultPrefs = createDefaultPreferences();
        setPreferences(defaultPrefs);
      } finally {
        setIsLoading(false);
      }
    };
    initializePreferences();
  }, []);
  useEffect(() => {
    if (!preferences || isLoading) return;
    const timer = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveToStorage(preferences);
        saveBackup(preferences);
        setHasUnsavedChanges(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [preferences, isLoading, hasUnsavedChanges]);
  const updatePreferences = useCallback(async (updates) => {
    if (!preferences) return;
    setError(null);
    try {
      const updatedPrefs = {
        ...preferences,
        ...updates,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
      setPreferences(updatedPrefs);
      setHasUnsavedChanges(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update preferences";
      setError(message);
      throw err;
    }
  }, [preferences]);
  const savePreferences = useCallback(async () => {
    if (!preferences) return;
    setIsSaving(true);
    setError(null);
    try {
      const prefsToSave = {
        ...preferences,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
      const success = saveToStorage(prefsToSave);
      if (!success) {
        throw new Error("Failed to save to local storage");
      }
      saveBackup(prefsToSave);
      setHasUnsavedChanges(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save preferences";
      setError(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [preferences]);
  const resetPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const defaultPrefs = createDefaultPreferences();
      setPreferences(defaultPrefs);
      saveToStorage(defaultPrefs);
      saveBackup(defaultPrefs);
      setHasUnsavedChanges(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reset preferences";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  const updateTravelPreferences = useCallback(async (updates) => {
    if (!preferences) return;
    await updatePreferences({ travelPreferences: { ...preferences.travelPreferences, ...updates } });
  }, [preferences, updatePreferences]);
  const updatePersonalizationSettings = useCallback(async (updates) => {
    if (!preferences) return;
    await updatePreferences({ personalizationSettings: { ...preferences.personalizationSettings, ...updates } });
  }, [preferences, updatePreferences]);
  const updateAdvancedSettings = useCallback(async (updates) => {
    if (!preferences) return;
    await updatePreferences({ advancedSettings: { ...preferences.advancedSettings, ...updates } });
  }, [preferences, updatePreferences]);
  const updatePrivacySettings = useCallback(async (updates) => {
    if (!preferences) return;
    await updatePreferences({ privacySettings: { ...preferences.privacySettings, ...updates } });
  }, [preferences, updatePreferences]);
  const updateNotificationSettings = useCallback(async (updates) => {
    if (!preferences) return;
    await updatePreferences({ notificationSettings: { ...preferences.notificationSettings, ...updates } });
  }, [preferences, updatePreferences]);
  const isSectionValid = useCallback((section) => {
    if (!preferences) return false;
    switch (section) {
      case "travelPreferences": {
        const tp = preferences.travelPreferences;
        return tp?.preferredLanguages !== void 0 && tp?.preferredTravelStyle !== void 0;
      }
      case "personalizationSettings": {
        const ps = preferences.personalizationSettings;
        return ps?.personalityType !== void 0 && ps?.responseLength !== void 0;
      }
      case "advancedSettings":
        return preferences.advancedSettings !== void 0 && preferences.advancedSettings !== null;
      case "privacySettings":
        return preferences.privacySettings !== void 0 && preferences.privacySettings !== null;
      case "notificationSettings":
        return preferences.notificationSettings !== void 0 && preferences.notificationSettings !== null;
      case "createdAt":
        return !!preferences.createdAt;
      case "updatedAt":
        return !!preferences.updatedAt;
      case "lastUpdated":
        return !!preferences.lastUpdated;
      default:
        return false;
    }
  }, [preferences]);
  const getSection = useCallback((section) => {
    if (!preferences) return null;
    switch (section) {
      case "travelPreferences":
        return preferences.travelPreferences;
      case "personalizationSettings":
        return preferences.personalizationSettings;
      case "advancedSettings":
        return preferences.advancedSettings;
      case "privacySettings":
        return preferences.privacySettings;
      case "notificationSettings":
        return preferences.notificationSettings;
      case "createdAt":
        return preferences.createdAt;
      case "updatedAt":
        return preferences.updatedAt;
      case "lastUpdated":
        return preferences.lastUpdated;
      default:
        return null;
    }
  }, [preferences]);
  const returnValue = useMemo(() => ({
    preferences,
    isLoading,
    isSaving,
    error,
    hasUnsavedChanges,
    updatePreferences,
    savePreferences,
    resetPreferences,
    updateTravelPreferences,
    updatePersonalizationSettings,
    updateAdvancedSettings,
    updatePrivacySettings,
    updateNotificationSettings,
    isSectionValid,
    getSection,
    data: preferences
  }), [
    preferences,
    isLoading,
    isSaving,
    error,
    hasUnsavedChanges,
    updatePreferences,
    savePreferences,
    resetPreferences,
    updateTravelPreferences,
    updatePersonalizationSettings,
    updateAdvancedSettings,
    updatePrivacySettings,
    updateNotificationSettings,
    isSectionValid,
    getSection
  ]);
  return returnValue;
}

// src/services/aiService.ts
var aiService = {
  async getPrompts() {
    const resp = await api_client_default.get("/ai/prompts");
    return Array.isArray(resp) ? resp : [];
  },
  async getPrompt(id) {
    const resp = await api_client_default.get(`/ai/prompts/${id}`);
    return resp;
  },
  async getWorkflows() {
    const resp = await api_client_default.get("/ai/workflows");
    return Array.isArray(resp) ? resp : [];
  },
  async runWorkflow(id, input) {
    const resp = await api_client_default.post(`/ai/workflows/${id}/run`, input);
    return resp;
  }
};

// src/services/destinationService.ts
var DestinationService = class {
  /**
   * Get all available destinations with optional filtering
   */
  static async getDestinations(filters) {
    const params = { ...filters };
    const resp = await api_client_default.get("/destinations", {
      params
    });
    return resp?.destinations || [];
  }
  /**
   * Get a single destination by ID
   */
  static async getDestinationById(id) {
    try {
      const resp = await api_client_default.get(`/destinations/${id}`);
      return resp?.destination || null;
    } catch (error) {
      console.error(`Error fetching destination ${id}:`, error);
      return null;
    }
  }
  /**
   * Get destinations by continent
   */
  static async getDestinationsByContinent(continent) {
    const resp = await api_client_default.get("/destinations", {
      params: { continent }
    });
    return resp?.destinations || [];
  }
  /**
   * Get featured destinations
   */
  static async getFeaturedDestinations(limit = 6) {
    const resp = await api_client_default.get("/destinations", {
      params: { limit, featured: true }
    });
    return resp?.destinations || [];
  }
  /**
   * Search destinations by query string
   */
  static async searchDestinations(query) {
    const resp = await api_client_default.get("/destinations", {
      params: { q: query }
    });
    return resp?.destinations || [];
  }
};

// src/services/packageService.ts
var VALID_CATEGORIES = /* @__PURE__ */ new Set([
  "adventure",
  "luxury",
  "family",
  "romantic",
  "cultural",
  "eco",
  "coastal",
  "corporate",
  "cultural-exchange",
  "gastronomic",
  "group-travel",
  "photography",
  "snow-sports",
  "wellness"
]);
var VALID_DIFFICULTIES = /* @__PURE__ */ new Set(["easy", "moderate", "challenging", "expert"]);
var VALID_SERVICE_TYPES = /* @__PURE__ */ new Set(["package", "service", "both"]);
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function extractCategory(s) {
  if (Array.isArray(s.tags) && s.tags.includes("luxury")) {
    return "luxury";
  }
  if (typeof s.category === "string" && VALID_CATEGORIES.has(s.category)) {
    return s.category;
  }
  return "adventure";
}
function extractDifficulty(value) {
  if (typeof value === "string" && VALID_DIFFICULTIES.has(value)) {
    return value;
  }
  return void 0;
}
function extractServiceType(value) {
  if (typeof value === "string" && VALID_SERVICE_TYPES.has(value)) {
    return value;
  }
  return "package";
}
function extractPrice(s) {
  if (isRecord(s.price)) {
    const base = s.price.base;
    return Number(base ?? 0);
  }
  return Number(s.price ?? 0);
}
function extractDestination(s) {
  if (isRecord(s.destination)) {
    return String(s.destination.name ?? "");
  }
  return String(s.destination ?? "");
}
function extractImages(s) {
  if (Array.isArray(s.imageGallery) && s.imageGallery.length > 0) {
    return s.imageGallery.map(String);
  }
  if (s.coverImage) {
    return [String(s.coverImage)];
  }
  return [];
}
function extractStringArray(value) {
  return Array.isArray(value) ? value.map(String) : [];
}
function parseActivity(value) {
  if (isRecord(value)) {
    return value;
  }
  return { name: String(value), description: "" };
}
function parseActivities(values) {
  if (!Array.isArray(values)) return [];
  return values.map(parseActivity);
}
function parseMonthlyWeather(items) {
  return items.filter(isRecord);
}
function parseMonthlyRecommendations(items) {
  return items.filter(isRecord);
}
function parseItineraryDay(d, idx) {
  return {
    day: Number(d.day ?? idx + 1),
    title: String(d.title ?? d.name ?? ""),
    description: String(d.description ?? ""),
    activities: parseActivities(d.plan ?? d.activities)
  };
}
function parseAvailabilitySlot(a) {
  return {
    startDate: String(a.date ?? a.startDate ?? ""),
    endDate: String(a.endDate ?? a.date ?? ""),
    spotsAvailable: Number(a.available ?? a.spotsAvailable ?? 0)
  };
}
function parseDayDetail(d) {
  return {
    day: Number(d.day ?? 0),
    morning: parseActivities(d.morning),
    afternoon: parseActivities(d.afternoon),
    evening: parseActivities(d.evening)
  };
}
function parseExtraActivity(e) {
  if (isRecord(e)) {
    return {
      name: String(e.name ?? ""),
      duration: String(e.duration ?? "")
    };
  }
  return { name: String(e), duration: "" };
}
function mapServiceToPackage(s) {
  const difficulty = extractDifficulty(s.difficulty);
  return {
    id: String(s.id),
    name: String(s.name ?? ""),
    description: String(s.description ?? ""),
    destination: extractDestination(s),
    price: extractPrice(s),
    duration: Number(s.duration ?? 0),
    rating: Number(s.rating ?? 0),
    reviews: Number(s.reviewCount ?? 0),
    category: extractCategory(s),
    images: extractImages(s),
    features: extractStringArray(s.features),
    included: extractStringArray(s.included ?? s.inclusions),
    excluded: extractStringArray(s.excluded ?? s.exclusions),
    highlights: extractStringArray(s.highlights),
    tags: extractStringArray(s.tags),
    requirements: extractStringArray(s.requirements),
    serviceType: extractServiceType(s.serviceType),
    inclusions: extractStringArray(s.inclusions),
    ...difficulty !== void 0 && { difficulty },
    ...s.bestTimeToVisit !== void 0 && { bestTimeToVisit: String(s.bestTimeToVisit) },
    ...s.climate !== void 0 && { climate: String(s.climate) }
  };
}
function extractBestTime(det) {
  if (det.overview?.bestTime) {
    return String(det.overview.bestTime);
  }
  if (typeof det.best_time === "object" && det.best_time !== null) {
    const bt = det.best_time;
    if (bt.months) return String(bt.months);
  }
  if (typeof det.best_time === "string") {
    return det.best_time;
  }
  return void 0;
}
function extractClimate(det) {
  if (det.overview?.climate) return String(det.overview.climate);
  if (det.weather?.climate) return String(det.weather.climate);
  return void 0;
}
function extractItinerary(det) {
  const itin = det.itineraries?.days ?? det.itineraries?.stops ?? [];
  if (!Array.isArray(itin)) return [];
  return itin.map((d, idx) => parseItineraryDay(d, idx));
}
function extractAvailability(det) {
  const avail = det.availability?.slots ?? det.availability?.startDates ?? [];
  if (!Array.isArray(avail)) return [];
  return avail.map((a) => parseAvailabilitySlot(a));
}
function extractDayDetails(det) {
  const dayDetails = det.itineraries?.dayDetails;
  if (!Array.isArray(dayDetails) || dayDetails.length === 0) return void 0;
  return dayDetails.map((d) => parseDayDetail(d));
}
function extractExtraActivities(det) {
  const extras = det.highlights?.extraActivities ?? det.extra_activities;
  if (!Array.isArray(extras) || extras.length === 0) return void 0;
  return extras.map(parseExtraActivity);
}
function enrichPackageWithDetails(pkg, det) {
  const bestTime = extractBestTime(det);
  const climate = extractClimate(det);
  const dayDetails = extractDayDetails(det);
  const extraActivities = extractExtraActivities(det);
  return {
    ...pkg,
    itinerary: extractItinerary(det),
    availability: extractAvailability(det),
    ...bestTime !== void 0 && { bestTimeToVisit: bestTime },
    ...climate !== void 0 && { climate },
    ...det.overview?.monthlyWeather && {
      monthlyWeather: parseMonthlyWeather(det.overview.monthlyWeather)
    },
    ...det.overview?.monthlyRecommendations && {
      monthlyRecommendations: parseMonthlyRecommendations(det.overview.monthlyRecommendations)
    },
    ...dayDetails !== void 0 && { dayDetails },
    ...extraActivities !== void 0 && { extraActivities }
  };
}
var PackageService = class {
  async getAllPackages(filters) {
    const params = this.buildFilterParams(filters);
    const resp = await api_client_default.get(
      "/packages/services",
      { params: { ...params, limit: 100 } }
    );
    const items = Array.isArray(resp?.services) ? resp.services : [];
    return items.map(mapServiceToPackage);
  }
  async getPackageById(id) {
    try {
      const resp = await api_client_default.get(
        `/packages/services/${id}`
      );
      const s = resp?.service;
      return s ? mapServiceToPackage(s) : null;
    } catch {
      return this.findPackageById(id);
    }
  }
  async getPackageBySlug(slug) {
    try {
      return await this.fetchPackageWithDetails(slug);
    } catch {
      return this.findPackageBySlug(slug);
    }
  }
  async searchPackages(query) {
    const resp = await api_client_default.get(
      "/services",
      { params: { category: "package", query: query.trim() } }
    );
    const items = Array.isArray(resp?.services) ? resp.services : [];
    return items.map(mapServiceToPackage);
  }
  async filterPackages(filters) {
    return this.getAllPackages(filters);
  }
  async getPackagesByCategory(category) {
    return this.getAllPackages({ category });
  }
  async getFeaturedPackages(limit = 6) {
    const list = await this.getAllPackages();
    return list.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews).slice(0, limit);
  }
  async getCategoryStats() {
    const list = await this.getAllPackages();
    const stats = /* @__PURE__ */ new Map();
    for (const pkg of list) {
      stats.set(pkg.category, (stats.get(pkg.category) ?? 0) + 1);
    }
    return Object.fromEntries(stats);
  }
  // ===========================================================================
  // Private Helper Methods
  // ===========================================================================
  buildFilterParams(filters) {
    const params = {
      category: "package",
      limit: 50,
      page: 1
    };
    if (!filters) return params;
    if (filters.category) params.tags = filters.category;
    if (filters.minPrice !== void 0) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== void 0) params.maxPrice = filters.maxPrice;
    if (filters.minDuration !== void 0) params.minDuration = filters.minDuration;
    if (filters.maxDuration !== void 0) params.maxDuration = filters.maxDuration;
    if (filters.minRating !== void 0) params.minRating = filters.minRating;
    if (filters.serviceType) params.serviceType = filters.serviceType;
    return params;
  }
  async fetchPackageWithDetails(slug) {
    const resp = await api_client_default.get(`/services/${slug}/details`);
    const svc = resp?.service;
    if (!svc) return null;
    const pkg = mapServiceToPackage(svc);
    const det = resp?.details;
    return det ? enrichPackageWithDetails(pkg, det) : pkg;
  }
  async findPackageById(id) {
    const list = await this.getAllPackages();
    return list.find((p) => p.id === id) ?? null;
  }
  async findPackageBySlug(slug) {
    const resp = await api_client_default.get(
      "/services",
      { params: { category: "package", query: slug } }
    );
    const items = resp?.services ?? [];
    const item = items.find((s) => s.slug === slug);
    return item ? mapServiceToPackage(item) : null;
  }
};
var CATEGORY_LABELS = /* @__PURE__ */ new Map([
  ["adventure", "Aventura"],
  ["luxury", "Luxo"],
  ["family", "Fam\xEDlia"],
  ["romantic", "Rom\xE2ntico"],
  ["cultural", "Cultural"],
  ["eco", "Eco-turismo"],
  ["coastal", "Costeiro"],
  ["corporate", "Corporativo"],
  ["cultural-exchange", "Interc\xE2mbio Cultural"],
  ["gastronomic", "Gastron\xF3mico"],
  ["group-travel", "Viagens em Grupo"],
  ["photography", "Fotografia"],
  ["snow-sports", "Desportos de Neve"],
  ["wellness", "Bem-estar"]
]);
var CATEGORY_COLORS = /* @__PURE__ */ new Map([
  ["adventure", "bg-orange-500"],
  ["luxury", "bg-purple-600"],
  ["family", "bg-green-500"],
  ["romantic", "bg-pink-500"],
  ["cultural", "bg-blue-600"],
  ["eco", "bg-green-600"],
  ["coastal", "bg-cyan-500"],
  ["corporate", "bg-gray-600"],
  ["cultural-exchange", "bg-indigo-500"],
  ["gastronomic", "bg-yellow-600"],
  ["group-travel", "bg-blue-500"],
  ["photography", "bg-violet-500"],
  ["snow-sports", "bg-blue-300"],
  ["wellness", "bg-emerald-500"]
]);
var DIFFICULTY_COLORS = /* @__PURE__ */ new Map([
  ["easy", "bg-green-100 text-green-800"],
  ["moderate", "bg-yellow-100 text-yellow-800"],
  ["challenging", "bg-orange-100 text-orange-800"],
  ["expert", "bg-red-100 text-red-800"]
]);
var getCategoryLabel = (category) => CATEGORY_LABELS.get(category) ?? category;
var getCategoryColor = (category) => CATEGORY_COLORS.get(category) ?? "bg-gray-500";
var getDifficultyColor = (difficulty) => DIFFICULTY_COLORS.get(difficulty ?? "") ?? "bg-gray-100 text-gray-800";
var packageService = new PackageService();

// src/services/sustainableService.ts
var CO2_FACTORS = {
  flight: 0.115,
  train: 0.041,
  ferry: 0.12,
  bus: 0.1
};
var DEFAULT_CO2_FACTOR = 0.1;
function isValidTransportMode(mode) {
  return mode === "flight" || mode === "train" || mode === "ferry" || mode === "bus";
}
function getCO2Factor(mode) {
  const normalizedMode = mode.toLowerCase().trim();
  if (isValidTransportMode(normalizedMode)) {
    return CO2_FACTORS[normalizedMode];
  }
  return DEFAULT_CO2_FACTOR;
}
function radiativeForcingFactor(mode) {
  return mode === "flight" ? 1.9 : 1;
}
function cabinMultiplier(mode, cabinClass) {
  if (mode !== "flight") return 1;
  const normalized = (cabinClass ?? "").toLowerCase().trim();
  switch (normalized) {
    case "business":
    case "first":
      return 1.5;
    case "economy":
    case "premium economy":
    default:
      return 1;
  }
}
function haversineKm(aLat, aLon, bLat, bLon) {
  const R = 6371;
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function resolveDistance(seg) {
  if (typeof seg.distanceKm === "number" && seg.distanceKm >= 0) {
    return seg.distanceKm;
  }
  const { origin: o, destination: d } = seg;
  if (typeof o.lat === "number" && typeof o.lon === "number" && typeof d.lat === "number" && typeof d.lon === "number") {
    return haversineKm(o.lat, o.lon, d.lat, d.lon);
  }
  return 0;
}
function sanitizeSegment(seg) {
  return {
    ...seg,
    mode: String(seg.mode || "flight").toLowerCase().trim(),
    passengers: Math.max(1, Math.min(1e3, Number(seg.passengers) || 1)),
    class: String(seg.class || "economy").toLowerCase().trim()
  };
}
function calculateFootprintLocally(segments) {
  const results = [];
  let totalCo2Kg = 0;
  for (const rawSeg of segments) {
    const seg = sanitizeSegment(rawSeg);
    const distanceKm = resolveDistance(seg);
    const passengers = seg.passengers ?? 1;
    const cabinClass = seg.class ?? "economy";
    const mode = seg.mode;
    const baseFactor = getCO2Factor(mode);
    const rfFactor = radiativeForcingFactor(mode);
    const cabinFactor = cabinMultiplier(mode, cabinClass);
    const co2Kg = distanceKm * passengers * baseFactor * rfFactor * cabinFactor;
    results.push({
      mode,
      distanceKm: Math.round(distanceKm * 100) / 100,
      passengers,
      class: cabinClass,
      co2Kg: Math.round(co2Kg * 100) / 100
      // Round to 2 decimals
    });
    totalCo2Kg += co2Kg;
  }
  return {
    totalCo2Kg: Math.round(totalCo2Kg * 100) / 100,
    segments: results
  };
}
var sustainableService = {
  /**
   * Fetch all sustainable destinations
   */
  async getDestinations() {
    try {
      const resp = await api_client_default.get("/sustainable/destinations");
      return Array.isArray(resp) ? resp : [];
    } catch (error) {
      console.error("Failed to fetch sustainable destinations:", error);
      return [];
    }
  },
  /**
   * Fetch a single destination by ID
   */
  async getDestinationById(id) {
    try {
      const sanitizedId = String(id).trim();
      if (!sanitizedId || sanitizedId.length > 100) {
        return void 0;
      }
      const resp = await api_client_default.get(
        `/sustainable/destinations/${encodeURIComponent(sanitizedId)}`
      );
      return resp ?? void 0;
    } catch (error) {
      console.error("Failed to fetch destination:", error);
      return void 0;
    }
  },
  /**
   * Compute carbon footprint via API with local fallback
   * If API fails, uses client-side calculation
   */
  async computeFootprint(segments) {
    try {
      const resp = await api_client_default.post("/sustainable/calculate", { segments });
      return resp;
    } catch (error) {
      console.warn("API footprint calculation failed, using local calculation:", error);
      return calculateFootprintLocally(segments);
    }
  },
  /**
   * Compute carbon footprint locally (instant, no API call)
   * Useful for real-time estimates or offline mode
   */
  computeFootprintLocally(segments) {
    return calculateFootprintLocally(segments);
  },
  /**
   * Get all available transport modes and their CO2 factors
   * Useful for displaying emission comparisons in UI
   */
  getTransportModes() {
    return Object.entries(CO2_FACTORS).map(([mode, co2PerKm]) => ({
      mode,
      co2PerKm
    }));
  }
};

// src/services/tripPlanningService.ts
var TripPlanningService = class {
  /**
   * Submit a trip planning request
   * @param formData The form data from the booking form
   * @returns Promise with the API response
   */
  static async submitTripPlanningRequest(formData) {
    try {
      const response = await api_client_default.post(
        "/trip-planning",
        {
          destination: formData.destination,
          dateRange: {
            from: formData.dateRange.from,
            to: formData.dateRange.to
          },
          travelers: formData.travelers,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          travelType: formData.travelType,
          budget: formData.budget,
          message: formData.message
        }
      );
      return response;
    } catch (error) {
      console.error("Error submitting trip planning request:", error);
      throw error;
    }
  }
};

// src/lib/date-picker.ts
import { DayPicker } from "react-day-picker";
var defaultDatePickerProps = {
  mode: "single",
  showOutsideDays: true,
  fixedWeeks: false
};
var createDateRangeConfig = () => ({
  mode: "range",
  showOutsideDays: true,
  fixedWeeks: false
});

// src/lib/markdown.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
var Markdown = ({ children, ...props }) => /* @__PURE__ */ React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], ...props }, children);
var defaultMarkdownComponents = {
  h1: ({ children }) => /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-bold mb-4" }, children),
  h2: ({ children }) => /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold mb-3" }, children),
  h3: ({ children }) => /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold mb-2" }, children),
  p: ({ children }) => /* @__PURE__ */ React.createElement("p", { className: "mb-4" }, children),
  ul: ({ children }) => /* @__PURE__ */ React.createElement("ul", { className: "list-disc pl-6 mb-4" }, children),
  ol: ({ children }) => /* @__PURE__ */ React.createElement("ol", { className: "list-decimal pl-6 mb-4" }, children),
  a: ({ href, children }) => /* @__PURE__ */ React.createElement("a", { href, className: "text-blue-600 hover:underline" }, children),
  code: ({ children }) => /* @__PURE__ */ React.createElement("code", { className: "bg-gray-100 rounded px-1 py-0.5 text-sm" }, children)
};

// src/lib/next.ts
var NEXT_TELEMETRY_DISABLED = true;
var getNextConfig = () => ({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en", "pt", "es", "fr"],
    defaultLocale: "en"
  }
});
var imageConfig = {
  domains: ["images.unsplash.com", "res.cloudinary.com"],
  formats: ["image/avif", "image/webp"]
};
var IMAGE_BLUR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// src/lib/store.ts
import { create, useStore, createStore } from "zustand";
import { persist } from "zustand/middleware";
var createSimpleStore = (initialState) => {
  return create()(() => initialState);
};
var createPersistentStore = (name, initialState) => {
  return create()(
    persist(
      (set) => ({
        ...initialState,
        // Assert as Partial<PersistentStore<T>> to satisfy strict Zustand typing
        set: (partial) => set(partial),
        // Assert as Partial<PersistentStore<T>> to satisfy strict Zustand typing
        reset: () => set(initialState)
      }),
      {
        name
      }
    )
  );
};

// src/lib/virtual-list.ts
var reactWindow = __require("react-window");
var availableExports = {};
if (reactWindow.FixedSizeList) {
  availableExports.FixedSizeList = reactWindow.FixedSizeList;
}
if (reactWindow.VariableSizeList) {
  availableExports.VariableSizeList = reactWindow.VariableSizeList;
}
var defaultListProps = {
  height: 400,
  width: "100%",
  itemCount: 100,
  itemSize: 50
};
export {
  AICapabilityTypeSchema,
  AIPreferencesSchema,
  AIProvider,
  AI_PROVIDERS,
  API_BASE_URL,
  APP_NAME,
  APP_ROUTES,
  ASSISTANCE_NEED_LABELS,
  AccessibilityNeedSchema,
  AccommodationTypeSchema,
  ActivityTypeSchema,
  AdminBreadcrumbs,
  AdvancedSettingsDataSchema,
  ApiClientError,
  AuthProvider,
  AuthService,
  BADGE_CONFIGS,
  BED_TYPE_LABELS,
  BUDGET_LEVELS,
  BUDGET_LEVEL_CONFIG,
  BlogCard_default as BlogCard,
  BookingDialog,
  BudgetLevel,
  BudgetRangeSchema,
  CABIN_CLASS_LABELS,
  ChatMetric,
  ComponentError,
  Config,
  ContactInfo_default as ContactInfo,
  DEFAULT_AI_PREFERENCES,
  DEFAULT_BUDGET_GUARDRAILS,
  DEFAULT_FLIGHT_PREFERENCES,
  DEFAULT_HOTEL_PREFERENCES,
  DOCUMENT_TYPE_LABELS,
  DashboardCard,
  DateRangePicker,
  DayPicker,
  DemoButtons,
  DestinationService,
  DietaryRestrictionSchema,
  EventManager,
  ExperimentalFeaturesSchema,
  FAQSection,
  FEATURES,
  FeaturedDestinations_default as FeaturedDestinations,
  HTTP_STATUS,
  IMAGE_BLUR_PLACEHOLDER,
  InterfaceSettingsSchema,
  LOCALE_KEYS,
  LOYALTY_CATEGORY_LABELS,
  LOYALTY_STATUS_LABELS,
  LanguageSwitcher_default as LanguageSwitcher,
  LanguageSwitcherNextIntl_default as LanguageSwitcherNextIntl,
  LanguageSwitcherSize,
  LanguageSwitcherVariant,
  MEAL_PREFERENCE_LABELS,
  Markdown,
  ModelParametersSchema,
  NEXT_TELEMETRY_DISABLED,
  NOTIFICATION_FREQUENCIES,
  NOTIFICATION_TYPES,
  NavigationError,
  NotificationFrequency,
  NotificationSettingsSchema,
  NotificationType,
  PERSONALITY_TYPES,
  PRIORITY_WEIGHT,
  PersonalityType,
  PersonalizationSettingsDataSchema,
  PriceSummary,
  PrivacySettingsDataSchema,
  RESPONSE_LENGTHS,
  ReactMarkdown,
  ResponseLength,
  SEAT_PREFERENCE_LABELS,
  SMOKING_PREFERENCE_LABELS,
  SUCCESS_METRICS,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
  SUSTAINABILITY_LEVELS,
  SecuritySettingsSchema,
  Sidebar,
  SupportedCurrencySchema,
  SupportedLanguageSchema,
  SustainabilityLevel,
  THEME_TYPES,
  TRAVELER_TYPE_LABELS,
  TRAVEL_STYLES,
  TransportationTypeSchema,
  TravelPreferencesDataSchema,
  TravelStyle,
  TripPlanningService,
  USER_ROLES,
  adaptLegacyTheme,
  addDays,
  aiService,
  api_client_default as apiClient,
  authService,
  batchDOMUpdates,
  breakpoints,
  camelToTitle,
  cancelAnimationFrameWrapper,
  capitalize,
  cn,
  colors,
  computeExtrasBreakdown,
  computeTotals,
  config,
  create,
  createAddOnService,
  createAuthor,
  createBlogPost,
  createCategory,
  createDarkTheme,
  createDateRangeConfig,
  createFAQ,
  createLazyImageLoader,
  createLightTheme,
  createManyAuthors,
  createManyBlogPosts,
  createManyCategories,
  createManyFAQs,
  createManyPackageServices,
  createManyReviews,
  createManySupportAgents,
  createManySupportArticles,
  createManySystemPaymentMethods,
  createManyTestimonials,
  createOptimizedResizeHandler,
  createOptimizedScrollHandler,
  createPackageService,
  createPersistentStore,
  createReview,
  createServiceAvailability,
  createServiceProvider,
  createSimpleStore,
  createStore,
  createSupportAgent,
  createSupportArticle,
  createSystemPaymentMethod,
  createTestimonial,
  createTheme,
  createThemePair,
  cssVar,
  cssVarsString,
  darkTheme,
  dateSchema,
  debounce,
  defaultDatePickerProps,
  defaultListProps,
  defaultMarkdownComponents,
  diffDays,
  durations,
  easings,
  emailSchema,
  en_default as en,
  es_default as es,
  extendTheme,
  extractCssVars,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDuration,
  formatFileSize,
  formatNumber,
  formatPercentage,
  formatPhoneNumber,
  formatStatNumber,
  formatStatusBadge,
  formatTime,
  formatters,
  fr_default as fr,
  generateThemeCss,
  getCategoryColor,
  getCategoryLabel,
  getDifficultyColor,
  getEnv,
  getFeatureConfig,
  getNextConfig,
  i18n_default as i18n,
  imageConfig,
  initializeMonitoring,
  isBrowser,
  isEnvEnabled,
  isFeatureEnabled,
  isInViewport,
  isNext,
  theme as legacyTheme,
  lightTheme,
  logger,
  nonEmptyString,
  normalizeError,
  optimizeAnimation,
  optimizedDebounce,
  optionalDate,
  optionalString,
  passwordSchema,
  phoneSchema,
  positiveNumber,
  prefersReducedMotion,
  preloadResource,
  pt_default as pt,
  radii,
  remarkGfm,
  reportError,
  requestAnimationFrameWrapper,
  requiredString,
  resources,
  sanitizeHref,
  sanitizeText,
  semanticColors,
  shadows,
  smoothScrollTo,
  sortNotificationsByPriority,
  spacing,
  sumExtrasTotal,
  sustainableService,
  themeToCssVars,
  throttle,
  toDateString,
  trackChatEvent,
  trackChatMetric,
  trackError,
  trackEvent,
  trackGtagEvent,
  trackMonitoringEvent,
  truncateText,
  typography,
  urlSchema,
  useAIPreferences,
  useAuth,
  useAuthSafe,
  useAuthState,
  useIsAuthenticated,
  useAIPreferences as useSharedAIPreferences,
  useStore,
  useUser,
  uuidSchema,
  validateAIPreferences,
  validateEnv,
  validateTheme,
  validateWithSchema,
  zIndex
};
//# sourceMappingURL=index.js.map