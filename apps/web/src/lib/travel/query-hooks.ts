/**
 * React Query hooks for travel data fetching.
 * These hooks encapsulate loading/error/data states and provide
 * caching, deduplication, and automatic re-fetching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { travelApi, api, type TravelCatalogResponse, type MeResponse } from '../api-client';
import type { RecommendApiResponse } from './recommend-api-types';
import type { TripGoTripPlan } from './tripgo';

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
  recommendations: (params: Record<string, unknown>) => ['travel', 'recommendations', params] as const,
  destinationDetail: (slug: string, locale: string) => ['travel', 'destination', slug, locale] as const,
  profile: () => ['user', 'profile'] as const,
  sessions: () => ['user', 'sessions'] as const,
  twoFaStatus: () => ['user', '2fa'] as const,
  tripGoRoutes: (params: Record<string, unknown>) => ['travel', 'tripgo', params] as const,
  localRoutes: (params: Record<string, unknown>) => ['travel', 'local-routes', params] as const,
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

// ─── Recommendations ──────────────────────────────────────────────────────

export function useRecommendations(params: {
  prefsKey: string;
  nights: number;
  travelers: number;
  origin: string;
  locale: string;
  enabled?: boolean;
}) {
  const { prefsKey, nights, travelers, origin, locale, enabled = true } = params;
  const lang = locale.startsWith('pt') ? 'pt' : locale.startsWith('es') ? 'es' : locale.startsWith('fr') ? 'fr' : 'pt';

  return useQuery({
    queryKey: travelKeys.recommendations({ nights, travelers, origin, prefsKey, lang }),
    queryFn: async (): Promise<RecommendApiResponse> => {
      const qs = new URLSearchParams({
        nights: String(nights),
        travelers: String(travelers),
        origin,
        budgetFilter: '1',
        limit: '12',
        lang,
      });
      if (prefsKey) qs.set('prefs', prefsKey);
      return api.get<RecommendApiResponse>(`/api/travel/v1/recommend?${qs}`);
    },
    staleTime: 5 * 60_000,
    enabled: enabled && !!prefsKey,
  });
}

// ─── Destination Detail ──────────────────────────────────────────────────

export function useDestinationDetail(slug: string, locale: string) {
  return useQuery({
    queryKey: travelKeys.destinationDetail(slug, locale),
    queryFn: () => api.get<DestinationDetailData>(`/api/travel/destinations/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`),
    enabled: !!slug && !!locale,
    staleTime: 5 * 60_000,
  });
}

// Lazy import to avoid circular deps
type DestinationDetailData = Record<string, unknown>;

// ─── Profile / Auth ─────────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: travelKeys.me(),
    queryFn: () => api.get<MeResponse>('/api/auth/me'),
    staleTime: 5 * 60_000,
  });
}

export function useSessions() {
  return useQuery({
    queryKey: travelKeys.sessions(),
    queryFn: () => api.get<{ sessions?: Array<{ id: string; device: Record<string, unknown>; ipAddress: string | null; createdAt: string; lastUsedAt: string; isCurrent: boolean }> }>('/api/auth/me/sessions'),
    staleTime: 30_000,
  });
}

export function use2FAStatus() {
  return useQuery({
    queryKey: travelKeys.twoFaStatus(),
    queryFn: () => api.get<{ enabled: boolean; secret?: string; uri?: string; hasBackupCodes?: boolean }>('/api/auth/me/2fa'),
    staleTime: 30_000,
  });
}

// ─── Profile Mutations ──────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { user: Record<string, string> }) =>
      api.put<{ success?: boolean }>('/api/auth/me', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelKeys.me() }),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch('/api/auth/me/avatar', { method: 'POST', credentials: 'include', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      return res.json() as Promise<{ avatarUrl?: string }>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelKeys.me() }),
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete<{ success?: boolean }>('/api/auth/me/avatar'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelKeys.me() }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      api.put<{ success?: boolean }>('/api/auth/me/password', data),
  });
}

export function useEnable2FA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { code: string }) =>
      api.post<{ success?: boolean; backupCodes?: string[]; error?: string }>('/api/auth/me/2fa', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelKeys.twoFaStatus() }),
  });
}

export function useDisable2FA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { password: string }) =>
      fetch('/api/auth/me/2fa', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      }).then(async (res) => {
        const body = await res.json().catch(() => ({})) as { success?: boolean; error?: string };
        if (!res.ok) throw new Error(body.error || 'Failed to disable');
        return body;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: travelKeys.twoFaStatus() });
    },
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      fetch('/api/auth/me/sessions', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      }).then(async (res) => {
        if (!res.ok) throw new Error('Failed to revoke');
        return res.json() as Promise<{ success?: boolean }>;
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelKeys.sessions() }),
  });
}

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      fetch('/api/auth/me/sessions', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      }).then(async (res) => {
        if (!res.ok) throw new Error('Failed to revoke');
        return res.json() as Promise<{ success?: boolean; revokedCount?: number }>;
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelKeys.sessions() }),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: () => api.post<{ success?: boolean }>('/api/auth/me/verify-email'),
  });
}

// ─── Draft Auto-Save ────────────────────────────────────────────────────

export function useSaveDraft() {
  return useMutation({
    mutationFn: (data: { preferences: unknown; step: number }) =>
      api.put<{ success?: boolean }>('/api/user/preferences/draft', data),
  });
}

export function useFetchDraft() {
  return useQuery({
    queryKey: ['user', 'draft'] as const,
    queryFn: async () => {
      const res = await fetch('/api/user/preferences/draft', { credentials: 'include' });
      if (!res.ok) return null;
      const data = await res.json().catch(() => null);
      return (data?.draft as Record<string, unknown>) ?? null;
    },
    staleTime: 0,
    gcTime: 0,
  });
}

// ─── Contact Form ───────────────────────────────────────────────────────

export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; phone: string; subject: string; message: string }) =>
      api.post<{ success?: boolean }>('/api/contact', data),
  });
}

// ─── Routing ────────────────────────────────────────────────────────────

export function useTripGoRoutes(params: {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  departAfter?: number;
  modes?: string;
  locale: string;
  enabled?: boolean;
}) {
  const { from, to, departAfter, modes = 'pt_pub_wa_wal', locale, enabled = true } = params;
  const lang = locale.startsWith('pt') ? 'pt' : locale.startsWith('es') ? 'es' : locale.startsWith('fr') ? 'fr' : 'en';

  return useQuery({
    queryKey: travelKeys.tripGoRoutes({ from, to, departAfter, modes, lang }),
    queryFn: async (): Promise<{ configured?: boolean; plans?: TripGoTripPlan[]; message?: string }> => {
      const qs = new URLSearchParams({
        from: `${from.lat},${from.lon}`,
        to: `${to.lat},${to.lon}`,
        modes,
        locale: lang,
      });
      if (departAfter) qs.set('departAfter', String(departAfter));
      return api.get(`/api/travel/tripgo/routing?${qs}`);
    },
    staleTime: 60_000,
    enabled,
  });
}

type LocalRoutingMode = 'transit' | 'auto' | 'pedestrian' | 'bicycle' | 'bus' | 'motorcycle';

export function useLocalRoutes(params: {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  departAfter?: number;
  modes?: string;
  locale: string;
  routingMode: LocalRoutingMode;
  enabled?: boolean;
}) {
  const { from, to, departAfter, modes = 'pt_pub_wa_wal', locale, routingMode, enabled = true } = params;
  const lang = locale.startsWith('pt') ? 'pt' : locale.startsWith('es') ? 'es' : locale.startsWith('fr') ? 'fr' : 'en';

  return useQuery({
    queryKey: travelKeys.localRoutes({ from, to, departAfter, modes, lang, routingMode }),
    queryFn: async (): Promise<{ configured?: boolean; provider?: string; plans?: TripGoTripPlan[]; message?: string }> => {
      const qs = new URLSearchParams({
        from: `${from.lat},${from.lon}`,
        to: `${to.lat},${to.lon}`,
        mode: routingMode,
        modes,
        locale: lang,
      });
      if (departAfter) qs.set('departAfter', String(departAfter));
      if (process.env.NEXT_PUBLIC_TRAVEL_ROUTING_LOCAL_ONLY === 'true') qs.set('localOnly', '1');
      return api.get(`/api/travel/routing/local?${qs}`);
    },
    staleTime: 60_000,
    enabled,
  });
}