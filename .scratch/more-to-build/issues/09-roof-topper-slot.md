# 09: Roof Topper Slot

**What to build:** a Roof Topper Slot: something fun on top of the cab.

**Blocked by:** 04 (room for more Slots in the Garage UI)

**Status:** ready-for-human

## Open questions (decide before building)

1. **Which toppers?** Defaults: free "None", then "Antenna Flag", "Spoiler", "Bull Horns" and Legendary "Siren" (spins and wails). Ask him. He might want a dinosaur.
2. **Legendary price.** Default $4.15.
3. **Clash with Roof Bar.** Lights Rung 2 is a Roof Bar. Default: the topper sits behind the light bar, and both show.

## Tasks

- [x] `SLOTS` gets `topper`, `defaultFit` gets `topper: 0`, and `CASH_PRICES` gets its price
- [x] Meshes on every Body's roof line in `src/garage/three/truck.ts`. The flag waves, and the Siren spins and flashes (added to `TruckAnim`)
- [x] The Siren plays a wail on moves and in Show Off (a new sound in `sfx.ts`)
- [x] A Topper hotspot and anchor on every Body
- [x] New Mod names go in `phrases.ts` and get recorded
- [x] Old saves load unchanged (a missing Slot reads as 0)
- [x] Vitest: prices, Goal, `builtEverything`
- [ ] Checked by eye on all Bodies (Dragster and Race Car roofs are low), and on the iPad

## Comments

- 2026-09-30: Open questions settled with the defaults: None, Antenna Flag, Spoiler, Bull Horns and Legendary Siren at $4.15, between Engine and Horn. The topper stands behind the Roof Bar and both show. Built. Each Body has a `topper` x in `bodies.ts`, at the back of the roof, ahead of the Police Truck's own light bar and clear of the Ice Cream Truck's cone. The Antenna Flag stands where the plain antenna is (and replaces it), with a checkered flag that waves. The Dragster and Race Car have no plain antenna, so on them the flag just stands in that spot. Its hotspot is on the flag. The Spoiler is a red wing on struts. The Bull Horns are ivory longhorns with black tips. The Siren is a gold base under a clear dome, with red and blue lamps and beams that spin and flash. The wave and the Siren are on `TruckAnim` (`wave`, `siren`). `sSiren()` in `sfx.ts` wails on every celebration jump and in Show Off (once as it opens and on every tap). A wail that is already playing isn't started again, so fast taps don't stack. For that, `celebrateUnlock` and `celebrateBody` now take the whole `Fit` rather than just the Engine Rung. No save version bump. Checked by eye in headless Chromium on all 12 Bodies at Rungs 1-4, and with Laser Show and Train Horn fitted on six of them. Still open: on the short roofs (Pickup, Dragster, Race Car) the Train Horn's trumpets overlap a Bull Horns or Siren. The roof was already crowded before this, since the Train Horn and Roof Bar overlap there too. The Siren adds a PointLight, like Glow Under does, so fitting it recompiles shaders. Watch for a hitch on the iPad. The iPad check is still to do.

