import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "sass:math" as *;\n`,
      },
    },
  },
  resolve: {
    alias:
      process.env.PUBLIC_ONLY_MODE === 'true'
        ? {
            '@akmleva/db': path.resolve(
              rootDir,
              'src/lib/db/public-stub.ts',
            ),
          }
        : {},
  },

  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    react(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }) as unknown,
    tailwindcss() as ReturnType<typeof tailwindcss>,
  ],
})
