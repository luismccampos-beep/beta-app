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
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors relative overflow-hidden">
          <div className="text-center max-w-md relative z-10">
            <div className="text-[12rem] font-black bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent leading-none tracking-tighter italic drop-shadow-2xl mb-8">
              500
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter uppercase italic">
              Algo correu mal
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 font-medium">
              Ocorreu um erro inesperado. A nossa equipa foi notificada e já estamos a tratar disso.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-brand-gray via-orange to-green text-white hover:brightness-110 transition-all font-black uppercase tracking-tighter italic shadow-glow-primary hover:scale-105"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
