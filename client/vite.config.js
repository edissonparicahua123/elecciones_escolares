import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ✅ Configuración completa para React + Vite + Shadcn + Proxy API
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173, // Puerto del frontend
    proxy: {
      "/api": {
        target: "http://localhost:3001", // Tu backend (server)
        changeOrigin: true,
      },
    },
  },
})
