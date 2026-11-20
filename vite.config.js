import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Configuration Vite : React, Tailwind CSS v4 et alias court vers le dossier source.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // « @ » pointe vers src pour éviter les chemins relatifs longs.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
