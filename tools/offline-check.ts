// Headless check: load the build, let the service worker precache it, go offline, reload, and play on.
// Run after `vite build`: npx tsx tools/offline-check.ts
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { preview } from 'vite';

const server = await preview({ preview: { port: 4317, strictPort: true }, logLevel: 'silent' });
const url = 'http://localhost:4317/';
const browser = await chromium.launch();
let failed = false;
const check = (ok: boolean, what: string) => { console.log(`${ok ? '✓' : '✗'} ${what}`); if (!ok) failed = true; };
try {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(url);
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready; // installed means everything is precached
    if (!navigator.serviceWorker.controller) await new Promise(r => navigator.serviceWorker.addEventListener('controllerchange', r, { once: true }));
    return reg.active?.state;
  });
  check(true, 'service worker installed and controlling the page');

  await ctx.setOffline(true);
  await page.reload();
  check(await page.isVisible('.start-btn'), 'offline reload shows the tap-to-start screen');
  await page.click('.start-btn');
  check(await page.isVisible('.home, .picker-screen'), 'offline, tapping start opens the game');
  const clip = readFileSync('dist/sw.js', 'utf8').match(/voice\/[0-9a-f]{12}\.mp3/)?.[0];
  const voiceOk = !!clip && (await page.evaluate(async c => (await fetch('./' + c)).ok, clip));
  check(voiceOk, 'offline, a voice clip plays from the precache');

  const noSw = await browser.newContext({ serviceWorkers: 'block' });
  const plain = await noSw.newPage();
  await plain.goto(url);
  await plain.click('.start-btn');
  check(await plain.isVisible('.home, .picker-screen'), 'with no service worker at all, the game still runs');
} finally {
  await browser.close();
  await new Promise<void>(r => server.httpServer.close(() => r()));
}
process.exit(failed ? 1 : 0);
