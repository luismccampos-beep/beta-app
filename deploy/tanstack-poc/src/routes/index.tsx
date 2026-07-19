import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          TanStack Start POC
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Prova de conceito do TanStack Start no monorepo AKMLEVA.
        </p>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
          <p className="text-slate-600 dark:text-slate-400">
            Se estiveres a ver esta página, o TanStack Start, Vite e Vinxi estão a funcionar.
          </p>
        </div>
      </div>
    </div>
  )
}
