'use client';

import { useQuery } from '@tanstack/react-query';
import type { DestinationDetailData } from '../DestinationDetailPage';

export function useDestinationDetail(slug: string, locale: string) {
  const query = useQuery({
    queryKey: ['travel', 'destination', slug, locale] as const,
    queryFn: async (): Promise<DestinationDetailData> => {
      const res = await fetch(`/api/travel/destinations/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      return res.json() as Promise<DestinationDetailData>;
    },
    enabled: !!slug && !!locale,
    staleTime: 5 * 60_000,
  });

  return {
    data: query.data ?? null,
    error: query.error?.message ?? null,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}
