# 08: Exhaust Slot

**What to build:** an Exhaust Slot: pipes that puff when the Truck moves. The Mods go from plain pipes to smoke to flames.

**Blocked by:** 04 (room for more Slots in the Garage UI)

**Status:** ready-for-human

## Open questions (decide before building)

1. **Names.** Defaults: free "Tailpipe", then "Twin Stacks", "Smoke Stacks", "Flame Stacks" and Legendary "Rainbow Blast". Ask him.
2. **Legendary price.** Default $3.20.
3. **When it puffs.** Default: on every move (`hop` / `jump` / `mega`), on an engine rev (if 04 has landed), and gently while idle in Show Off.

## Tasks

- [x] `SLOTS` gets `exhaust`, `defaultFit` gets `exhaust: 0`, and `CASH_PRICES` gets its price
- [x] Pipe meshes on every Body in `src/garage/three/truck.ts`: behind the cab for stacks, at the rear for the tailpipe
- [x] A small particle effect for smoke, flames and the rainbow, added to `TruckAnim` and driven from `src/celebrate/` moves. Keep it light on the iPad
- [x] An Exhaust hotspot and anchor on every Body
- [x] New Mod names go in `phrases.ts` and get recorded
- [x] Old saves load unchanged (a missing Slot reads as 0)
- [x] Vitest: prices, Goal, `builtEverything`
- [ ] Checked by eye on all Bodies, and on the iPad (frame rate holds during a mega move)

## Comments

- 2026-09-30: Open questions settled with the defaults: Tailpipe, Twin Stacks, Smoke Stacks, Flame Stacks and Legendary Rainbow Blast at $3.20, between Decals and Lights. It puffs on every move (a jump or mega keeps puffing all the way through), on every engine rev (opening Show Off, opening the Engine sheet, trying an Engine), when a new Exhaust is fitted, and gently while idle in Show Off. Built. Each Body has a `stack` x in `bodies.ts`, and the stacks rise from the shell's top there: behind the cab on the Pickup, Tow Truck, Dump Truck, Fire Truck, Dragster and Race Car, on the roof of the SUVs and boxes, and up through the hood on the Tractor. The Tailpipe comes out low at the back on the left. The Tractor's is its old single hood stack. The Pickup's old decorative stacks and the Tractor's hood stack are gone from the Body extras, since the Exhaust Slot now draws them. The puffs are in `src/garage/three/exhaust.ts`: one pool of 96 particles in one draw call. They live in the turntable's space, so a jump leaves its smoke behind. No save version bump. Checked by eye in headless Chromium on all 12 Bodies at Rungs 0, 2 and 4, and on several at every Rung. The iPad check and its frame rate during a mega move are still to do. The puffs are not on `TruckAnim` as the task said. They are `BuiltTruck.exhaust`, because their points sit on the turntable rather than the Truck. The moves in `src/celebrate/` drive them through `stage.play()`, which puffs, so `src/celebrate/` needed no change. Also puffs when the Exhaust sheet opens, which the defaults didn't ask for.
