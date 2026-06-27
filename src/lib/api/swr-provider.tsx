'use client';

import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
        errorRetryCount: 2,
        onError: (err) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('[SWR]', err);
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
