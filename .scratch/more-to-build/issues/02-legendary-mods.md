# 02: Legendary Mods, bought with cash

**What to build:** a 4th, Legendary Rung in each of the 5 Slots. It is paid for in money, not Bolts: he taps coins and bills into the Pay the Shop tray until they add up to the price. That gives him new top-end Mods to chase and more counting practice together. This is the "Real-money shop" the Garage spec left room for (see "Guardrails for future work" in [the Garage spec](../../monster-truck-garage/spec.md)).

**Blocked by:** none

**Status:** ready-for-human

## Open questions (decide before building)

1. **Pacing.** Five Legendaries paid only in cash could all be bought in ten minutes. Options: (a) cash only; (b) a Legendary opens for purchase only after the top Rung in its Slot is unlocked; (c) each needs a Bolt cost as well. The default is **(b)**, because (c) would mix Bolts with money, which the glossary rules out.
2. **Prices.** The default is fixed prices from $1.35 to $4.80, one per Mod, using everything up to the $5 bill. Pay the Shop's bank currently leaves out `b5`, so these prices would add it.
3. **Names.** The defaults are Tires "Monster Treads", Paint "Gold Flake", Decals "Skull & Wings", Lights "Laser Show", Horn "Train Horn". Ask him.

## Tasks

- [x] `SLOTS` in `src/garage/catalog.ts` gets a 5th Mod per Slot. `Rung` becomes `0 | 1 | 2 | 3 | 4`; update `RUNGS`, `ModId`, `ALL_MODS` and `readFit` in `src/save/migrate.ts`, which currently accepts only 1-3
- [x] Prices split into Bolt prices (Rungs 1-3, unchanged `PRICES`) and cash prices (Rung 4, a new table in cents). `goalOf`, `affordable` and `boltsNeeded` in `src/garage/economy.ts` skip Legendaries. `builtEverything` counts them
- [x] One unlock path still: `unlock(mod)` takes a payment kind, so a Legendary unlocks only after an exact cash payment
- [x] Tapping a Legendary in the Mod sheet opens a checkout that reuses Pay the Shop's tray, `checkPay` and "Help me pay" (`src/modes/pay/`), with the Mod as the shop item. Short and over replies work as in Pay the Shop. Paying exactly unlocks and fits it, with the unlock celebration
- [x] Legendary tiles look special (gold frame, sparkle) and show the price as money, not Bolts. While locked by open question 1, they show a padlock and the Mod it's waiting on
- [x] Each Legendary has a mesh on all Bodies (`src/garage/three/truck.ts`), clearly flashier than the top Rung
- [x] New Mod names and lines ("{Mod} costs {amount}.", "You bought {Mod}!") go in `phrases.ts` and get recorded
- [x] GLOSSARY.md: **Rung** gets a Legendary step, paid in money. **Bolt** still never buys a Legendary
- [x] Old saves load unchanged; the Legendaries show up locked
- [x] Vitest: cash prices, exact-payment unlock, the Goal skipping Legendaries, `builtEverything` with Rung 4, migrating an old save
- [ ] Checked on the iPad

## Comments

- 2026-09-29: Open questions settled with the defaults: (b) a Legendary opens once the top Rung in its Slot is unlocked; prices $1.35 / $2.10 / $2.75 / $3.60 / $4.80 (Tires → Horn) with the $5 bill in the checkout's bank; the default names. Built. `priceOf` returns `{ bolts }` or `{ cents }`, `unlock(w, item, payment)` is the one path, and the checkout (`Checkout.tsx`) reuses Pay the Shop's counter, now `PayCounter.tsx`. Once only Legendaries are left, the Goal bar shows the cheapest one with its money price. Save version 2 (shared with 03). The iPad check is still to do.
