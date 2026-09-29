# Choose the stack

Type: grilling
Status: resolved
Blocked by: 01, 02
Map: [Monster Truck Garage](../map.md)

## Question

Using the findings from "iPad Safari storage and offline" and "Static stack options", which stack do we build on? That covers the build tool, the UI approach, how assets are stored (embedded or separate files), how offline works, and which storage API holds the saved Garage. The decision should explain how it keeps a native wrapper possible. This is likely worth an ADR.

## Answer

Recorded in ADR `docs/adr/0001-vite-preact-static-stack.md`, which covers the reasoning and the rejected options.

- **Build**: Vite with assets as separate hashed files and `base: './'`. A fresh build that reuses the coin images, `make_voice.py` and selected logic (coin maths, the `decodeAudioData` clip loader). It replaces the old app at the same Pages URL; there is no `/classic/` copy.
- **UI**: Preact with hooks and `@preact/signals`, in strict TypeScript.
- **Storage**: `localStorage` behind an async `load()`/`save()` seam with a schema `version` and one `navigator.storage.persist()` call. It uses new keys, so old saves are ignored. It can be swapped for Capacitor Preferences later.
- **Offline**: `vite-plugin-pwa` precaches js/css/html/png/svg/webp/mp3 and self-hosted fonts, with `autoUpdate` on the next launch (never mid-Round). The app never depends on the service worker: it registers only on the web, and nothing reads the Cache API directly.
- **Voice plumbing**: `voice/phrases.ts` is the single typed list of phrases, and `say()` accepts only that type. `make_voice.py` reads the phrase JSON and writes committed `public/voice/*.mp3` files plus `src/voice.gen.ts`. A missing clip fails the build, and there is no `speechSynthesis` fallback.
- **Checks**: CI runs `tsc --noEmit` and Vitest on the pure logic (Mastery, the economy, Levels, coin maths, save migration). There are no browser tests; the layout gets checked by hand on the iPad.
- **Native path**: `dist/` has an `index.html` and relative paths, storage sits behind the seam, and there is no dependence on the service worker.
- **Left open**: the Truck art technique (SVG, PNG or canvas) belongs to "Prototype the Truck art and the Garage screen"; the stack allows all three.
