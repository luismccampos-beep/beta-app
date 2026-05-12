// ============================================================================
// Core Components
// ============================================================================
export * from './AppHeader';
export { default as BaseLink } from './BaseLink';
export * from './BaseLink';
export * from './Breadcrumbs';
// Note: Button, ErrorBoundary, Skeleton are exported from root components/index.ts
export * from './ContactForm';
export * from './CustomerSupport';
export * from './GridCard';
export * from './ImageGallery';
export * from './LinkRegistry';
// Note: LoadingScreen exports LoadingSpinner which conflicts with root LoadingSpinner
export * from './Logo';
export { default as TrustBadge } from './TrustBadge';
export type { TrustBadgeProps } from './TrustBadge';
export * from './TrustBadge';
export * from './filters/SharedFilterBar';

// ============================================================================
// Booking Components
// ============================================================================
export * from './BookingWidget';

// ✅ FIXED TS2305: BookingForm exports - explicit to avoid conflicts with BookingWidget
export { BookingForm } from './BookingForm';
export type {
  BookingFormData,
  BookingFormProps,
  BookingDestination,
  BookingValidationResult,
} from './BookingForm';

// ============================================================================
// Unified Chat
// ============================================================================
// Includes ChatPosition, ChatState, ChatTheme types
export * from './UnifiedChat';

// ============================================================================
// Unified AI
// ============================================================================
// Explicit exports to avoid conflicts with UnifiedChat types
// (both modules export ChatPosition, ChatState, ChatTheme - using UnifiedChat's versions)
export { UnifiedAI } from './UnifiedAI/UnifiedAI';
export {
  UNIFIED_AI_DEFAULTS,
  UNIFIED_AI_STORAGE_KEY,
} from './UnifiedAI/UnifiedAI.constants';
export type {
  UnifiedAIProps,
  AIState,
  AIActions,
  AIContextValue,
  UserContext,
  SuggestionsState,
  TripGeneratorState,
  SearchState,
  PreferencesState,
  AdminState,
  TripPreferences,
  SearchParams,
  AIRequestContext,
  AICommand,
  AIMode,
} from './UnifiedAI/UnifiedAI.types';

// AI Chat
export * from './UnifiedAI/chat/ChatInterface';
export * from './UnifiedAI/chat/ChatMessageRenderer';
export * from './UnifiedAI/chat/ChatActionHandlers';

// AI Suggestions
export * from './UnifiedAI/suggestions/SuggestionsProvider';
export * from './UnifiedAI/suggestions/SuggestionsRenderer';
export * from './UnifiedAI/suggestions/useAISuggestions';
export * from './UnifiedAI/suggestions/suggestionsService';

// AI Trip Generator
export * from './UnifiedAI/trip-generator/TripGeneratorChat';
export * from './UnifiedAI/trip-generator/TripFormRenderer';
export { useTripGenerator } from './UnifiedAI/trip-generator/useTripGenerator';
export type { TripGeneratorState as TripGeneratorHookState } from './UnifiedAI/trip-generator/useTripGenerator';
export { createTripDraft } from './UnifiedAI/trip-generator/tripGeneratorService';
export type {
  GeneratedTrip,
  TripDayPlan,
  TripGeneratorOptions,
  TripPreferences as TripGeneratorPreferences,
} from './UnifiedAI/trip-generator/tripGeneratorService';

// AI Search
export * from './UnifiedAI/search/SearchInterface';
export * from './UnifiedAI/search/SearchResultsRenderer';
export * from './UnifiedAI/search/useAISearch';
export * from './UnifiedAI/search/searchService';

// AI Preferences
export * from './UnifiedAI/preferences/PreferencesManager';
export * from './UnifiedAI/preferences/PreferencesForm';
export * from './UnifiedAI/preferences/useAIPreferences';
export * from './UnifiedAI/preferences/preferencesService';

// AI Admin
export * from './UnifiedAI/admin/AIAdminInterface';
export * from './UnifiedAI/admin/PromptManager';
export * from './UnifiedAI/admin/WorkflowManager';
export * from './UnifiedAI/admin/adminAIService';

// AI Hooks
export * from './UnifiedAI/hooks/useAIState';
export * from './UnifiedAI/hooks/useAIActions';
export * from './UnifiedAI/hooks/useAIContext';
export * from './UnifiedAI/hooks/useAIAuthentication';

// AI Services
export * from './UnifiedAI/services/aiApiClient';
export * from './UnifiedAI/services/aiWebSocketService';
export * from './UnifiedAI/services/aiStorageService';
export * from './UnifiedAI/services/aiAnalyticsService';

// AI Types (Filtered to prevent conflicts)
// Note: types/ai.types is excluded as it contains conflicting ChatPosition, ChatTheme
// Re-export only non-conflicting types from ai.types
export type { AIMessageRole, AIMessage, AISuggestion, UnifiedAIConfig } from './UnifiedAI/types/ai.types';
export * from './UnifiedAI/types/chat.types';
export * from './UnifiedAI/types/preferences.types';
export * from './UnifiedAI/types/admin.types';

// AI Utils
export * from './UnifiedAI/utils/messageFormatter';
export * from './UnifiedAI/utils/aiResponseParser';
export * from './UnifiedAI/utils/validationSchemas';
export * from './UnifiedAI/utils/constants';