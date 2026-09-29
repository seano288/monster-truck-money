# 01: Skeleton: tap to start, deployed as a preview

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) · Stack: [ADR 0001](../../../docs/adr/0001-vite-preact-static-stack.md)

**What to build:** A fresh Vite + Preact + strict TS app that opens on a big tap-to-start screen on the app's dark background (`#23252b`), deployed to a preview URL (a `next/` subfolder of the existing Pages site) while the old app keeps the main URL. The save seam and CI are in place so every later ticket builds on them.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] Vite with `base: './'` and hashed separate assets; Preact with `@preact/signals`; TS strict mode
- [x] The tap-to-start screen fits 820×1180, 1180×820 and 390×844 with no scrolling, and its button has an icon
- [x] Save seam: async `load()`/`save()` over `localStorage` with new keys (old saves ignored), a schema `version`, and one `navigator.storage.persist()` call
- [x] Save migrations are pure functions, with a first Vitest test
- [x] CI runs `tsc --noEmit` and Vitest on every push
- [ ] The Pages workflow publishes the old app at the root, as now, and the new build under `next/`
- [x] `dist/` has an `index.html` with only relative paths

## Comments

**2026-09-29, Claude:** implemented in `66a749e` on `wayfinder/monster-truck-garage`.
Still open:
- The Pages workflow publishes the old app at the root, as now, and the new build under `next/`: written but never deployed, since Pages deploys only from main; replaced at cutover (08), which publishes the new build at the root
CI passed on GitHub (run 36633702464) once the lockfile resolved from the public npm registry (`1acafb2`).
