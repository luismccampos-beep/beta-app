import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-200/30 dark:bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 dark:bg-primary-500/10 blur-[120px]" />
      </div>

      <div className="text-center px-4 relative z-10">
        <div className="text-[12rem] font-black bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent leading-none tracking-tighter italic drop-shadow-2xl mb-8">
          404
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter uppercase italic">
          Página não encontrada
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-md mx-auto font-medium">
          Parece que te perdeste no mapa. A página que procuras não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-brand-gray via-orange to-green text-white hover:brightness-110 transition-all font-black uppercase tracking-tighter italic shadow-glow-primary hover:scale-105"
        >
          ← Voltar ao início
        </Link>
      </div>
    </div>
  );
}
