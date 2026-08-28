import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/farmer'),
    },
  },
  server: {
    host: true,
    proxy: {
      '/farmers': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/disease': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
