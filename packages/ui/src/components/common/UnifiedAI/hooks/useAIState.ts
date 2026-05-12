import { useContext } from 'react';

import type { AIState } from '../UnifiedAI.types';
import { AIContext } from '../UnifiedAI';

const fallbackState: AIState = {
  mode: 'user',
  isOnline: true,
  userContext: {},
  suggestions: {
    items: [],
    isLoading: false,
    error: null,
  },
  tripGenerator: {
    isLoading: false,
    error: null,
  },
  search: {
    isLoading: false,
    error: null,
  },
  preferences: {
    isLoading: false,
    error: null,
  },
  admin: {
    isLoading: false,
    error: null,
  },
  chat: {
    isSending: false,
    error: null,
    messages: [],
  },
};

export function useAIState(): AIState {
  const context = useContext(AIContext);
  return context?.state ?? fallbackState;
}
