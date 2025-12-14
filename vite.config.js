import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // Proxy para evitar problemas de CORS en desarrollo
    proxy: {
      '/api': {
        target: 'https://api-resto-datasuitepro-production.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Silencia advertencias de SASS
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})