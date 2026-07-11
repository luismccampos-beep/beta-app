/**
 * Centralized API client for all fetch requests.
 * Handles base URL, credentials, common error responses,
 * and provides typed helper methods.
 */

// ─── Error types ───────────────────────────────────────────────────────────

export class ApiError extends Error {
  public readonly status: number;
  public readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

// ─── Configuration ─────────────────────────────────────────────────────────

interface ApiClientConfig {
  baseUrl?: string;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
}

const DEFAULT_CONFIG: ApiClientConfig = {
  credentials: 'include',
  headers: {
    'content-type': 'application/json',
  },
};

// ─── Helper: build full URL ────────────────────────────────────────────────

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  // path is already absolute like /api/...
  const url = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '' && value !== false) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

// ─── Core request function ────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string | number | boolean | undefined | null> } = {},
): Promise<T> {
  const { params, ...init } = options;
  const url = params ? buildUrl(path, params) : buildUrl(path);

  const config: RequestInit = {
    ...DEFAULT_CONFIG,
    ...init,
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...(init.headers as Record<string, string> | undefined),
    },
  };

  const res = await fetch(url, config);

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  // Try to parse JSON body
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message =
      body && typeof body === 'object' && 'message' in body && typeof (body as { message: unknown }).message === 'string'
        ? (body as { message: string }).message
        : `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}

// ─── Public API ────────────────────────────────────────────────────────────

export const api = {
  get<T>(path: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<T> {
    return request<T>(path, { method: 'GET', params });
  },

  post<T>(path: string, data?: unknown): Promise<T> {
    return request<T>(path, { method: 'POST', body: data != null ? JSON.stringify(data) : undefined });
  },

  put<T>(path: string, data?: unknown): Promise<T> {
    return request<T>(path, { method: 'PUT', body: data != null ? JSON.stringify(data) : undefined });
  },

  patch<T>(path: string, data?: unknown): Promise<T> {
    return request<T>(path, { method: 'PATCH', body: data != null ? JSON.stringify(data) : undefined });
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'DELETE' });
  },
};

// ─── Pre-built typed API functions ─────────────────────────────────────────

import type { TravelResult } from '../app/components/data/mockResults';

export interface TravelCatalogResponse {
  configured: { duffel: boolean; hotelbeds: boolean; mockHotels?: boolean; siloah?: boolean };
  duffelCabinClasses: { value: string; label: string }[];
  loyaltyProgrammes: { id: string; label: string }[];
  airports: { iataCode: string; label: string; country: string | null }[];
  accommodations: { code: string; label: string }[];
  chains: { code: string; label: string }[];
  facilities: { code: string; label: string }[];
  cruiseDestinations?: { id: string; label: string }[];
  cruiseBrands?: { name: string; tier: string; label: string; shipCount: number }[];
  errors: { source: string; message: string }[];
}

export interface TravelDestinationsResponse {
  destinations: unknown[];
  total: number;
}

export interface TravelResultsResponse {
  ok?: boolean;
  message?: string;
  results?: TravelResult[];
}

export interface MeResponse {
  authenticated?: boolean;
  user?: unknown;
}

export interface UserPreferencesResponse {
  authenticated?: boolean;
  preference?: { aiSettings?: unknown };
}

export const travelApi = {
  fetchDestinations(params: {
    q?: string;
    continent?: string;
    iata?: string;
    page: number;
    pageSize: number;
    locale: string;
  }) {
    return api.get<TravelDestinationsResponse>('/api/travel/destinations', params);
  },

  fetchCatalog(locale: string) {
    return api.get<TravelCatalogResponse>('/api/travel/catalog', { locale });
  },

  fetchCountries() {
    return api.get<{ countries?: { name: string; count: number }[]; continents?: { name: string; count: number }[] }>(
      '/api/travel/v1/destinations/countries',
    );
  },

  fetchResults(queryString: string, isCruise: boolean) {
    const base = isCruise ? '/api/travel/cruises' : '/api/travel/results';
    const url = queryString ? `${base}?${queryString}` : base;
    return api.get<TravelResultsResponse>(url);
  },

  savePreferences(preferences: unknown) {
    return api.put<{ success?: boolean; message?: string }>('/api/user/preferences', { preferences });
  },

  fetchMe() {
    return api.get<MeResponse>('/api/auth/me');
  },

  fetchUserPreferences() {
    return api.get<UserPreferencesResponse>('/api/user/preferences');
  },

  fetchAiInsights(preferences: unknown, locale: string) {
    return api.post<{ ok?: boolean; answer?: string; message?: string }>('/api/ai/preferences-insights', {
      preferences,
      locale,
    });
  },
};