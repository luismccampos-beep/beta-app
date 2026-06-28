import { useQuery } from '@tanstack/react-query';

const BASE = '/api';

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

type PaginatedResponse<T> = {
  ok: boolean;
  items: T[];
  total: number;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export function useDestinations(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  return useQuery({
    queryKey: ['destinations', params],
    queryFn: () => fetcher<PaginatedResponse<unknown>>(`${BASE}/travel/v1/destinations?${qs}`),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => fetcher<ApiResponse<unknown>>(`${BASE}/travel/v1/destinations/countries`),
    staleTime: 5 * 60_000,
  });
}

export function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: () => fetcher<ApiResponse<unknown>>(`${BASE}/travel/catalog`),
    staleTime: 5 * 60_000,
  });
}

export function useDestinationDetail(slug: string) {
  return useQuery({
    queryKey: ['destination', slug],
    queryFn: () => fetcher<ApiResponse<unknown>>(`${BASE}/travel/v1/destinations/${slug}`),
    enabled: !!slug,
    staleTime: 60_000,
  });
}

export function useHotels(slug: string) {
  return useQuery({
    queryKey: ['hotels', slug],
    queryFn: () => fetcher<ApiResponse<unknown>>(`${BASE}/travel/v1/hotels?slug=${slug}`),
    enabled: !!slug,
    staleTime: 60_000,
  });
}
