"use client";

import { useCallback, useEffect, useState } from 'react';

import type { AIPreferences } from '../types/preferences.types';
import { loadPreferences, resetPreferences, savePreferences } from './preferencesService';

export interface AIPreferencesState {
  data: AIPreferences | null;
  isLoading: boolean;
  error: string | null;
  save: (preferences: AIPreferences) => Promise<AIPreferences | null>;
  reset: () => Promise<AIPreferences | null>;
  refresh: () => Promise<void>;
}

export function useAIPreferences(): AIPreferencesState {
  const [data, setData] = useState<AIPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await loadPreferences();
    setData(result);
    setIsLoading(false);
  }, []);

  const save = useCallback(async (preferences: AIPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const saved = await savePreferences(preferences);
      setData(saved);
      return saved;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao guardar preferências');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resetData = await resetPreferences();
      setData(resetData);
      return resetData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao repor preferências');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    data,
    isLoading,
    error,
    save,
    reset,
    refresh,
  };
}
