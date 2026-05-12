export type AIMessageRole = 'user' | 'assistant' | 'system';
export type AIMode = 'user' | 'admin' | 'hybrid';
export type ChatPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type ChatTheme = 'full' | 'compact' | 'minimal';

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  createdAt: number;
}

export interface AISuggestion {
  id: string;
  label: string;
  payload?: Record<string, unknown>;
}

export interface UnifiedAIConfig {
  mode: AIMode;
  features: {
    suggestions?: boolean;
    tripGenerator?: boolean;
    search?: boolean;
    preferences?: boolean;
    admin?: boolean;
    promptManagement?: boolean;
    workflowManagement?: boolean;
  };
  behavior: {
    autoOpen?: boolean;
    persistentContext?: boolean;
    crossTabSync?: boolean;
  };
  ui: {
    position: ChatPosition;
    theme: ChatTheme;
    primaryColor?: string;
    showSuggestionsUI?: boolean;
    showSearchUI?: boolean;
    showPreferencesUI?: boolean;
    showTripGeneratorUI?: boolean;
  };
  backend: {
    apiEndpoint: string;
    wsEndpoint?: string;
    apiKey?: string;
    timeout?: number;
  };
}
