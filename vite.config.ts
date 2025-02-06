/// <reference types="vitest"/>
/// <reference types="vite/client"/>


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'], // If you have any setup file for testing, update to .ts
    globals: true, // Optional, if you want to use globals like `describe`, `it` in your tests
  },
})
