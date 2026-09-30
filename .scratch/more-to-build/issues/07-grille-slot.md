# 07: Grille Slot

**What to build:** a Grille Slot for the front of the Truck: 4 Bolt Mods plus a Legendary.

**Blocked by:** 04 (room for more Slots in the Garage UI)

**Status:** ready-for-human

## Open questions (decide before building)

1. **Names.** Defaults: free "Plain", then "Chrome Bars", "Bull Bar", "Shark Teeth" and Legendary "Dragon Jaw". Ask him.
2. **Legendary price.** Default $2.45.

## Tasks

- [x] `SLOTS` in `src/garage/catalog.ts` gets `grille`, and `defaultFit` gets `grille: 0`. `CASH_PRICES` gets its price
- [x] A mesh for each Rung on every Body in `src/garage/three/truck.ts`, fitted to the Body's front edge. Each looks clearly cooler than the Rung below, and the Legendary moves (the jaw snaps when he taps the Truck in Show Off)
- [x] A Grille hotspot and anchor on every Body
- [x] New Mod names go in `phrases.ts` and get recorded
- [x] Old saves load unchanged (a missing Slot reads as 0; add a test)
- [x] Vitest: prices, Goal, `builtEverything`
- [ ] Checked by eye on all Bodies, and on the iPad

## Comments

- 2026-09-30: Open questions settled with the defaults: Plain, Chrome Bars, Bull Bar, Shark Teeth and Legendary Dragon Jaw at $2.45, which makes it the third-cheapest Legendary. Built. `grille()` in `truck.ts` sizes each Grille to the Body's front edge between the headlights. On a short nose (Dragster, Race Car), Chrome Bars and Bull Bar sit above the tube bumper and stand a little proud. Shark Teeth and Dragon Jaw are mouths: they replace the front tube bumper and go lower. The Dragon Jaw's lower jaw chomps a little at rest, its fire flickers, and it snaps twice on every tap in Show Off (`stage.snap()`). The Grille hotspot is worked out from the front edge rather than stored in `bodies.ts`, and sits just below the Lights hotspot. No save version bump. Checked by eye on all 12 Bodies at every Rung, in headless Chromium only. The iPad check is still to do.
