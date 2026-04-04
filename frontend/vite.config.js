import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/web_application/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
})
