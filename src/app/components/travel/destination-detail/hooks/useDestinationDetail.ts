'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { DestinationDetailData } from '../DestinationDetailPage';

export function useDestinationDetail(slug: string, locale: string) {
  const [data, setData] = useState<DestinationDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/travel/destinations/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<DestinationDetailData>;
      })
      .then((json) => {
        if (isMounted.current) setData(json);
      })
      .catch((e: unknown) => {
        if (isMounted.current)
          setError(e instanceof Error ? e.message : 'Erro ao carregar');
      })
      .finally(() => {
        if (isMounted.current) setLoading(false);
      });
  }, [slug, locale]);

  useEffect(() => {
    isMounted.current = true;
    refetch();
    return () => {
      isMounted.current = false;
    };
  }, [refetch]);

  return { data, error, loading, refetch };
}
