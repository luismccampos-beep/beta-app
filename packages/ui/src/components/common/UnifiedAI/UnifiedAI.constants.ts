import type { UnifiedAIConfig } from './types/ai.types';

export const UNIFIED_AI_STORAGE_KEY = 'akmleva_unified_ai';

export const UNIFIED_AI_DEFAULTS: UnifiedAIConfig = {
  mode: 'hybrid',
  features: {
    suggestions: true,
    tripGenerator: true,
    search: true,
    preferences: true,
  },
  behavior: {
    autoOpen: false,
    persistentContext: true,
    crossTabSync: false,
  },
  ui: {
    position: 'bottom-right',
    theme: 'full',
  },
  backend: {
    apiEndpoint: '/api',
  },
};
