# Vite + Preact static stack, with nothing that blocks a native wrapper

Monster Truck Money moves from one self-contained HTML file to Vite + Preact + strict TypeScript, with assets as separate files. The Garage adds art and many voice clips, so staying in one file means paying ~33% base64 overhead, re-downloading everything after any change, and giving agents ~1 MB lines to work around. It stays static (GitHub Pages, `base: './'`) so `dist/` can later be wrapped with Capacitor unchanged. The research behind this is on branches `research/static-stack-options` and `research/ipad-storage-and-offline`.

## Considered Options

- **Single HTML file**: no build step, but see above.
- **Vanilla TS** (~2 kB): the lightest, but screens and the layered Truck mean syncing DOM and state by hand.
- **Preact** (~7 kB, chosen): components and JSX with the React API that models know best; `@preact/signals` holds the shared Garage state.
- **Svelte 5**: agents confuse runes with the older syntax. **Solid**: looks like React but behaves differently. **React**: ~69 kB for no benefit here.

## Consequences

- **Storage**: `localStorage` sits behind an async `load()`/`save()` seam with a schema `version`, and `navigator.storage.persist()` is called once. The seam can be swapped for Capacitor Preferences because a wrapper doesn't inherit web storage. New keys are used, so old Monster Cup saves are ignored.
- **Offline**: `vite-plugin-pwa` precaches js/css/html plus png/svg/webp/mp3 and self-hosted fonts, with `autoUpdate` applied on the next launch. **The app never depends on the service worker**: it registers only on the web, and nothing reads the Cache API directly. Whether service workers run in Capacitor's WKWebView is unverified.
- **Voice**: `voice/phrases.ts` is the single typed list of phrases, and `say()` accepts only that type. `tools/make_voice.py` reads the phrase JSON and writes committed `public/voice/*.mp3` files plus `src/voice.gen.ts`. A missing clip fails the build, and there is no `speechSynthesis` fallback.
- **Checks**: CI runs `tsc --noEmit` and Vitest on the pure logic (Mastery, the Bolt economy, Levels, coin maths, save migration) before deploying. There are no browser tests yet.
- **Cutover**: this is a fresh build that reuses the coin images, the voice pipeline and selected logic. It replaces the old app at the same Pages URL, and he reinstalls to the Home Screen once.
- **Truck art** (SVG, PNG or canvas) is not decided here. The stack allows all three.
