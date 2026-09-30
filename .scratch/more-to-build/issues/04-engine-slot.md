# 04: Engine sound Slot

**What to build:** a 6th Slot, Engine, whose Mods are sounds rather than parts. He revs the Truck to hear it. It's the cheapest new Slot to build because it needs no meshes: 4 more Mods and a Legendary without any 3D work.

**Blocked by:** none (it's the first new Slot, so it also makes room for more Slots in the Garage UI; 07-10 build on that)

**Status:** ready-for-human

## Open questions (decide before building)

1. **Names.** Defaults: free "Putt-Putt", then "Rumble", "V8", "Jet Turbine" and Legendary "Rocket". Ask him.
2. **Where he hears it.** Default: tapping the Engine hotspot (on the hood) revs it in the Garage, it plays when a Show Off starts, and it plays in place of `sEngine` in the Garage celebrations.
3. **More Horn Rungs instead?** Every Slot shares the same 5-step shape (`Rung` 0-4), so adding Rungs to Horn alone would break that. The default is to add the Engine Slot and leave Horn at 5.

## Tasks

- [x] `SLOTS` in `src/garage/catalog.ts` gets `{ id: 'engine', name: 'Engine', icon: '🔧', mods: [...] }`, and `defaultFit` gets `engine: 0`
- [x] `CASH_PRICES` in `src/garage/economy.ts` gets an Engine Legendary price (default $3.95)
- [x] `ENGINES` in `src/audio/sfx.ts`: five engine sounds by Rung, built like `HORNS`, each clearly beefier than the last. Rocket gets a whoosh and a roar
- [x] The Garage's Slot bar and hotspots make room for more than 5 Slots on iPad (the next Slot tickets add more). The `anchors` type in `src/garage/three/truck.ts` stops listing Slot ids by hand and uses `SlotId`
- [x] An Engine hotspot on every Body; tapping it opens the Mod sheet and revs the fitted engine
- [x] Tapping an Engine Mod tile plays its sound before he buys it
- [x] Show Off and the Garage celebrations play the fitted engine
- [x] New Mod names go in `phrases.ts` and get recorded
- [x] Old saves load unchanged: `readFit` in `src/save/migrate.ts` already fills a missing Slot with 0, so no save version bump. Add a test that proves it
- [x] Vitest: Engine prices, the Goal picking up Engine Mods, `builtEverything` needing them, loading an old save
- [ ] Checked on the iPad

## Comments

- 2026-09-30: Open questions settled with the defaults: names Putt-Putt, Rumble, V8, Jet Turbine and Legendary Rocket at $3.95; the Engine revs from its hotspot on the hood, when Show Off starts, and in place of `sEngine` in the Garage celebrations; Horn stays at 5 Rungs. Built. `ENGINES` in `sfx.ts` sits beside `HORNS`. Tapping any Engine tile plays that engine, locked ones too. There's no Slot bar in the Garage (Slots are hotspots only), so "making room" means `spreadHotspots` in `stage.ts`: it pushes apart hotspots that land on top of each other on screen, which Engine and Lights already do on Big Foot. Engine hotspot points are in each Body's `hot` in `bodies.ts`; on the cab-over Fire Truck it sits low on the windshield. No save version bump. The iPad check is still to do.
