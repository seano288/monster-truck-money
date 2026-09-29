import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import { voiceCheck } from './tools/voice-check';

export default defineConfig({
  base: './',
  plugins: [preact(), voiceCheck()],
  build: { assetsInlineLimit: 0 },
  test: { include: ['src/**/*.test.ts'] },
});
