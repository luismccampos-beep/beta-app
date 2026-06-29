'use client';

import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';

export default function DestinationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Destinations error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Algo correu mal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Não foi possível carregar esta página. Tente novamente.
        </p>
        <Button onClick={reset} variant="default">
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
