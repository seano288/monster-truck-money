import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: './',
  plugins: [preact()],
  build: { assetsInlineLimit: 0 },
  test: { include: ['src/**/*.test.ts'] },
});
