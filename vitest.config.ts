import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'))

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // The throwaway repos built by `npm run scenario` contain their own test
    // files, which are part of those exercises and not part of this suite.
    exclude: ['**/node_modules/**', '**/dist/**', '.scenarios/**'],
  },
})
