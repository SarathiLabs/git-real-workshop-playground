import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Surfaced in the header so that tagging a release visibly changes the
    // dashboard on the projector.
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
