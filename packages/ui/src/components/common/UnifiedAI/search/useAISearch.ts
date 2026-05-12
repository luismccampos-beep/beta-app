"use client";

import { useCallback, useState } from 'react';

import type { AISearchResult } from './searchService';
import { runAISearch } from './searchService';

export interface AISearchState {
  results: AISearchResult | null;
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<AISearchResult | null>;
  clear: () => void;
}

export function useAISearch(): AISearchState {
  const [results, setResults] = useState<AISearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults(null);
      setError(null);
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await runAISearch(query);
      setResults(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na pesquisa');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clear,
  };
}
