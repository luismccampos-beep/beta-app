/**
 * React Query hooks for travel data fetching.
 * These hooks encapsulate loading/error/data states and provide
 * caching, deduplication, and automatic re-fetching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { travelApi, type TravelCatalogResponse, type MeResponse } from '../api-client';

// ─── Query key factories ───────────────────────────────────────────────────

export const travelKeys = {
  all: ['travel'] as const,
  destinations: (params: Record<string, unknown>) => ['travel', 'destinations', params] as const,
  catalog: (locale: string) => ['travel', 'catalog', locale] as const,
  countries: () => ['travel', 'countries'] as const,
  results: (query: string) => ['travel', 'results', query] as const,
  preferences: () => ['user', 'preferences'] as const,
  me: () => ['user', 'me'] as const,
  aiInsights: (prefsHash: string) => ['ai', 'insights', prefsHash] as const,
};

// ─── Hash helper for AI insights caching ──────────────────────────────────

function simpleHash(obj: unknown): string {
  try {
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  } catch {
    return Date.now().toString(36);
  }
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

/**
 * Fetch paginated/queried destinations for the browse page.
 * Respects stale time to avoid re-fetching on mount.
 */
export function useDestinations(params: {
  q?: string;
  continent?: string;
  iata?: string;
  page: number;
  pageSize: number;
  locale: string;
}) {
  return useQuery({
    queryKey: travelKeys.destinations(params),
    queryFn: () => travelApi.fetchDestinations(params),
    staleTime: 30_000, // 30 seconds – fresh enough for browse
  });
}

/**
 * Fetch travel catalog data (airports, cabins, chains, etc.).
 */
export function useTravelCatalog(locale: string) {
  return useQuery({
    queryKey: travelKeys.catalog(locale),
    queryFn: () => travelApi.fetchCatalog(locale),
    staleTime: 10 * 60 * 1000, // 10 minutes – catalog rarely changes
  });
}

/**
 * Fetch country/continent filter options.
 */
export function useTravelCountries() {
  return useQuery({
    queryKey: travelKeys.countries(),
    queryFn: () => travelApi.fetchCountries(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch travel results (flights, hotels, cruises).
 */
export function useTravelResults(queryString: string, isCruise: boolean) {
  return useQuery({
    queryKey: travelKeys.results(queryString),
    queryFn: () => travelApi.fetchResults(queryString, isCruise),
    staleTime: 60_000, // 1 minute – results can change
    enabled: !!queryString, // only run if there's a query
  });
}

/**
 * Fetch current user profile.
 */
export function useMe() {
  return useQuery({
    queryKey: travelKeys.me(),
    queryFn: () => travelApi.fetchMe(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch user preferences from the server.
 */
export function useUserPreferences() {
  return useQuery({
    queryKey: travelKeys.preferences(),
    queryFn: () => travelApi.fetchUserPreferences(),
    staleTime: 5 * 60 * 1000,
    retry: false, // don't retry if not authenticated
  });
}

/**
 * Fetch AI insights for travel preferences.
 * Only enabled when aiInsightsEnabled is true and preferences have high enough score.
 */
export function useAiInsights(
  preferences: unknown,
  locale: string,
  aiInsightsEnabled: boolean,
) {
  return useQuery({
    queryKey: travelKeys.aiInsights(simpleHash(preferences) + locale),
    queryFn: () => travelApi.fetchAiInsights(preferences, locale),
    staleTime: 5 * 60 * 1000,
    enabled: aiInsightsEnabled && !!preferences,
    retry: 1,
  });
}

/**
 * Mutation to save travel preferences.
 */
export function useSavePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: unknown) => travelApi.savePreferences(preferences),
    onSuccess: () => {
      // Invalidate both preferences and AI insights
      queryClient.invalidateQueries({ queryKey: travelKeys.preferences() });
      queryClient.invalidateQueries({ queryKey: travelKeys.all });
    },
  });
}