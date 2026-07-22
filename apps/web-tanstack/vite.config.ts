import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tanstackStart(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }) as unknown,
    tailwindcss() as ReturnType<typeof tailwindcss>,
  ],
})
