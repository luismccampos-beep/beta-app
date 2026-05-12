import type { AIContextValue } from '../UnifiedAI.types';
import { useAIActions } from './useAIActions';
import { useAIState } from './useAIState';

export function useAIContext(): AIContextValue {
  return {
    state: useAIState(),
    actions: useAIActions(),
  };
}
