import type {
  AIMode,
  AIMessage,
  AISuggestion,
  UnifiedAIConfig,
} from './types/ai.types';

export type { AIMode, UnifiedAIConfig } from './types/ai.types';

export interface UnifiedAIProps {
  config?: UnifiedAIConfig;
  className?: string;
  onReady?: () => void;
}

export interface AIState {
  mode: AIMode;
  isOnline: boolean;
  userContext: UserContext;
  suggestions: SuggestionsState;
  tripGenerator: TripGeneratorState;
  search: SearchState;
  preferences: PreferencesState;
  admin: AdminState;
  chat: ChatState;
}

export interface AIActions {
  setMode: (mode: AIMode) => void;
  updateUserContext: (context: Partial<UserContext>) => void;
  loadSuggestions: (query: string) => Promise<void>;
  generateTrip: (preferences: TripPreferences) => Promise<void>;
  performSearch: (params: SearchParams) => Promise<void>;
  sendMessage: (message: string, context?: AIRequestContext) => Promise<void>;
  processCommand: (command: AICommand) => Promise<void>;
  clearSession: () => void;
}

export interface AIContextValue {
  state: AIState;
  actions: AIActions;
}

export interface UserContext {
  id?: string;
  name?: string;
  role?: string;
  locale?: string;
  metadata?: Record<string, unknown>;
}

export interface SuggestionsState {
  items: AISuggestion[];
  isLoading: boolean;
  error: string | null;
}

export interface TripGeneratorState {
  isLoading: boolean;
  error: string | null;
  draft?: Record<string, unknown>;
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  results?: Record<string, unknown>;
}

export interface PreferencesState {
  isLoading: boolean;
  error: string | null;
  data?: Record<string, unknown>;
}

export interface AdminState {
  isLoading: boolean;
  error: string | null;
  data?: Record<string, unknown>;
}

export interface ChatState {
  sessionId?: string | undefined;
  isSending: boolean;
  error: string | null;
  messages: AIMessage[];
}

export interface TripPreferences {
  name?: string;
  email?: string;
  budget: number;
  duration: number;
  interests: string[];
  sustainability: number;
  travelers: number;
  destination?: string;
  additionalComments?: string;
}

export interface SearchParams {
  query: string;
  [key: string]: unknown;
}

export interface AIRequestContext {
  [key: string]: unknown;
}

export interface AICommand {
  type: string;
  payload?: Record<string, unknown>;
}
