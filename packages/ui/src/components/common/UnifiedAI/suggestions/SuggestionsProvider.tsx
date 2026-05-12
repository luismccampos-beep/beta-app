import type { ReactNode } from 'react';

import { SuggestionsRenderer } from './SuggestionsRenderer';
import { useAISuggestions, type AISuggestionsState } from './useAISuggestions';
import type { AISuggestion } from '../types/ai.types';
import type { SuggestionsOptions } from './suggestionsService';

export interface SuggestionsProviderProps {
  children?: ReactNode | ((state: AISuggestionsState) => ReactNode);
  options?: SuggestionsOptions;
  onSelect?: (suggestion: AISuggestion) => void;
}

export function SuggestionsProvider({ children, options, onSelect }: SuggestionsProviderProps) {
  const { items, isLoading, error, refresh } = useAISuggestions(options);

  if (typeof children === 'function') {
    return children({ items, isLoading, error, refresh });
  }

  if (children !== undefined && children !== null) {
    return children;
  }

  return (
    <SuggestionsRenderer suggestions={items} isLoading={isLoading} error={error} onSelect={onSelect} />
  );
}
