import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import { voiceCheck } from './tools/voice-check';

export default defineConfig({
  base: './',
  plugins: [preact(), voiceCheck()],
  build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 800 }, // three.js is in the main bundle on purpose
  test: { include: ['src/**/*.test.ts'] },
});
