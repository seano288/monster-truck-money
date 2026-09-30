# 05: More Bodies

**What to build:** a second batch of Bodies bought with Bolts. Each Body keeps its own Mod fit, so every new one is a new Truck to kit out, and more Bodies give Bolts the longest-lasting use.

**Blocked by:** none

**Status:** ready-for-human

## Open questions (decide before building)

1. **Which Bodies?** Let him pick. Defaults that fit the side-profile system in `src/garage/three/bodies.ts` (one outline polygon plus windows): **Tow Truck**, **Dump Truck**, **Police Truck**, **Ice Cream Truck**, **Tractor**, **Race Car**. Anything with non-box parts (a crane arm, a tipping bed) is a later ticket.
2. **Prices.** The current Bodies cost 50 / 75 / 100 Bolts. The default continues upward: 125 / 150 / 175 / 200 / 250 / 300, so the last ones are a long save-up.

## Tasks

- [x] Add the Bodies to `BODY_IDS` / `BODY_NAMES` in `src/garage/catalog.ts` and add their shapes to `BODIES`. Every Mod, and its anchor and hotspot, works on each
- [x] Prices go in `PRICES.bodies` in `src/garage/economy.ts`
- [x] The Body strip in the Garage still works with 12 Bodies on iPad (scrolls, or groups owned and locked)
- [x] `fitted` gets the new Body keys. Check that `migrate.ts` fills missing Body keys with default fits; if it doesn't, fix it (no version bump needed if it does)
- [x] The first-launch `BodyPicker` still offers only the starter Bodies
- [x] New Body names go in `phrases.ts` and get recorded
- [x] Vitest: prices, the Goal picking the cheapest new Body, `builtEverything`, loading a version-2 save
- [ ] Checked on the iPad

## Comments

- 2026-09-30: Open questions settled with the defaults: Tow Truck, Dump Truck, Police Truck, Ice Cream Truck, Tractor and Race Car at 125 / 150 / 175 / 200 / 250 / 300 Bolts. Built. Each has a small extra in 3D: a winch on the tow bed (the boom is a crane arm, so it's left for a later ticket), dump-box ribs, a red and blue light bar, a cone on the roof with an awning over the serving window, an exhaust stack, and a rear wing. The Body strip already scrolled; it now keeps the Body he's driving scrolled into view. `migrate.ts` already filled missing Body keys with default fits, so there's no version bump. The top price rising to 300 means "You need N more Bolts." is recorded up to 300, which adds 200 clips (the voice folder goes from 6.4 MB to 10 MB of precache). The iPad check is still to do.
