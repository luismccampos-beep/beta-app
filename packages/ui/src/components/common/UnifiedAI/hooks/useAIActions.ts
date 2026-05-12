import { useContext } from 'react';

import type { AIActions } from '../UnifiedAI.types';
import { AIContext } from '../UnifiedAI';

const fallbackActions: AIActions = {
  setMode: () => {},
  updateUserContext: () => {},
  loadSuggestions: async () => {},
  generateTrip: async () => {},
  performSearch: async () => {},
  sendMessage: async () => {},
  processCommand: async () => {},
  clearSession: () => {},
};

export function useAIActions(): AIActions {
  const context = useContext(AIContext);
  return context?.actions ?? fallbackActions;
}
