import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    globals: true,
    reporters: 'verbose'
  }
})
