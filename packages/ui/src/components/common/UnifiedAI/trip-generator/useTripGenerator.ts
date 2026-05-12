"use client";

import { useCallback, useState } from 'react';

import type { GeneratedTrip, TripPreferences } from './tripGeneratorService';
import { createTripDraft } from './tripGeneratorService';

export interface TripGeneratorState {
  trip: GeneratedTrip | null;
  isLoading: boolean;
  error: string | null;
  generateTrip: (preferences: TripPreferences) => Promise<GeneratedTrip | null>;
  clearTrip: () => void;
}

export function useTripGenerator(): TripGeneratorState {
  const [trip, setTrip] = useState<GeneratedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTrip = useCallback(async (preferences: TripPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createTripDraft(preferences);
      setTrip(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao gerar viagem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearTrip = useCallback(() => {
    setTrip(null);
    setError(null);
  }, []);

  return {
    trip,
    isLoading,
    error,
    generateTrip,
    clearTrip,
  };
}
