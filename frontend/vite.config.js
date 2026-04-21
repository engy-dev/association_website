import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /sanctum to Laravel so cookies work during dev
      '/sanctum': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: true,
      },
    },
  },
});
