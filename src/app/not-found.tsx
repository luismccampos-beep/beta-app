import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="pt">
      <body className="bg-white dark:bg-gray-950 font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-8xl font-bold bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent mb-4">
              404
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Página não encontrada
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              A página que procura não existe ou foi movida.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-orange-500 text-white hover:from-teal-700 hover:to-orange-600 transition-all font-medium"
            >
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
