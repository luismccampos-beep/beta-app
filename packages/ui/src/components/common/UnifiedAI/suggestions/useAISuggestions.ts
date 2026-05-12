"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { AISuggestion } from '../types/ai.types';
import { fetchSuggestions, type SuggestionsOptions } from './suggestionsService';

export interface AISuggestionsState {
  items: AISuggestion[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAISuggestions(options: SuggestionsOptions = {}): AISuggestionsState {
  const [items, setItems] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const optionsKey = useMemo(() => JSON.stringify(options), [options]);
  const stableOptions = useMemo(() => options, [optionsKey]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSuggestions(stableOptions);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suggestions');
    } finally {
      setIsLoading(false);
    }
  }, [stableOptions]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    items,
    isLoading,
    error,
    refresh,
  };
}
