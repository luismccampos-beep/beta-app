'use client';

import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <html lang="pt">
      <body className="bg-white dark:bg-gray-950 font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              500
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Algo correu mal
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Ocorreu um erro inesperado. A nossa equipa foi notificada.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white hover:from-primary-700 hover:to-accent-600 transition-all font-medium"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
