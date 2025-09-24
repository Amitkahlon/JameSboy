import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config' // 👈 חשוב מאוד
import path from 'path'
import { fileURLToPath } from 'url'

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts']
  }
})
