import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Pisahkan vendor besar (three/rapier) ke chunk sendiri → download paralel
    // & cache stabil (perubahan kode game tak invalidasi chunk library).
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@dimforge') || id.includes('rapier')) return 'rapier'
          if (id.includes('three')) return 'three'
          if (id.includes('react') || id.includes('scheduler')) return 'react'
        },
      },
    },
    // Rapier ~2.9MB (WASM ter-inline base64) memang besar & tak terhindarkan;
    // naikkan ambang di atasnya supaya warning tidak palsu.
    chunkSizeWarningLimit: 3000,
  },
})
