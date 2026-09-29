# 03: New Bodies, unlocked with Bolts

**What to build:** new Bodies he buys with Bolts, so Bolts have something to do again after the Mods are all bought. Each Body keeps its own Mod fit, so a new Body is a new Truck to kit out and show off.

**Blocked by:** none (it can land before or after 02, but whichever lands second takes the save version bump)

**Status:** ready-for-human

## Open questions (decide before building)

1. **Which Bodies?** Let him pick. The default is 3 that fit the side-profile system in `src/garage/three/bodies.ts` (one outline polygon plus windows): **Fire Truck**, **School Bus**, **Jeep**. Anything with non-box parts (a dino head, tank tracks) needs its own mesh work and should be its own ticket.
2. **Prices.** The default is 30 / 45 / 60 Bolts, about 10-20 Rounds each, so every Body is a real save-up at his current pace.

## Tasks

- [x] Add the new Bodies to `BODY_IDS` / `BODY_NAMES` in `src/garage/catalog.ts` and add their shapes to `BODIES`. Mod anchors and hotspots work on each, and every existing Mod fits
- [x] The save gains `ownedBodies`: `SAVE_VERSION` 2 with a migration in `MIGRATIONS` in which the 3 starter Bodies count as owned. `fitted` gets the new Body keys with default fits
- [x] Body prices go in the one prices table in `src/garage/economy.ts`, and buying goes through the same `unlock` path, which spends Bolts
- [x] The Goal can be a locked Body. The default Goal is still the cheapest locked item, and a tapped Body can be made the Goal. The Goal bar shows the Body's shape
- [x] The Garage's Body switcher shows the locked Bodies with their Bolt price, pulsing gold when he can afford one. Tapping a locked one says "{Body}. You need N more Bolts." Buying one plays a big celebration and switches him to it
- [x] The first-launch `BodyPicker` still offers only the starter Bodies
- [x] `builtEverything` also needs every Body owned
- [x] New Body names and lines go in `phrases.ts` and get recorded
- [x] GLOSSARY.md: **Body** now covers starter Bodies and Bodies bought with Bolts. **Goal** can be a locked Mod or a locked Body
- [x] Vitest: Body prices, buying, the Goal including Bodies, migrating a version-1 save (starters owned, fits kept)
- [ ] Checked on the iPad

## Comments

- 2026-09-29: Open questions settled with the defaults: Fire Truck, School Bus and Jeep at 30 / 45 / 60 Bolts. Built. This ticket took the save bump to version 2 (`ownedBodies`, with the starters always owned). The Body switcher is a strip of Body chips along the bottom of the stage, and the ◀ ▶ arrows step through owned Bodies. The iPad check is still to do.
