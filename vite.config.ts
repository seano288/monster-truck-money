import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import { homeScreenIcons } from './tools/icons';
import { voiceCheck } from './tools/voice-check';

const BG = '#23252b';

export default defineConfig({
  base: './',
  plugins: [
    preact(),
    voiceCheck(),
    homeScreenIcons(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // src/pwa.ts registers it, only on the web and without reloading the page
      manifest: {
        name: 'Monster Truck Money',
        short_name: 'Truck Money',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        theme_color: BG,
        background_color: BG,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,webp,mp3,woff,woff2}'],
        cleanupOutdatedCaches: true,
        // the new version takes over in the background; the page isn't reloaded, so it shows on the next launch
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 800 }, // three.js is in the main bundle on purpose
  test: { include: ['src/**/*.test.ts'] },
});
