# 10: Door Number

**What to build:** a racing number on the Truck's door. He picks the number himself, and the Mods are the number's style. Picking the number is a bit of number practice, and it makes each Truck feel like his.

**Blocked by:** 04 (room for more Slots in the Garage UI)

**Status:** ready-for-human

## Open questions (decide before building)

1. **Styles (the Rungs).** Defaults: free "No Number", then "Plain", "Outlined", "Flaming" and Legendary "Glowing Gold". Ask him.
2. **Choosing the number.** Default: 0-99, set with two big up/down wheels (tens and ones) while the number is read aloud ("Forty-two!"). Changing it is always free.
3. **One number or one per Body?** Default: one per Body, stored with that Body's fit.
4. **Legendary price.** Default $1.85.

## Tasks

- [x] `SLOTS` gets `number`, `defaultFit` gets `number: 0`, and `CASH_PRICES` gets its price
- [x] The save stores the chosen number per Body. Old saves read it as a default (his age, or 1). If this needs a new field on `fitted`, take the next save version and add a migration
- [x] The number is drawn on the side canvas with Paint and Decals (`drawPaint` in `src/garage/three/truck.ts`), placed so it doesn't clash with any Decal on any Body
- [x] A number picker opens from the Mod sheet once a style is fitted
- [x] Voice lines for 0-99 already exist, or get generated, through `src/voice/amount.ts` / `phrases.ts`
- [x] ~~The Show Off photo shows the number~~ (the photo was removed in 50edf16; the number is on the Truck, so Show Off shows it)
- [x] Vitest: number range, per-Body storage, migration
- [ ] Checked by eye on all Bodies, and on the iPad

## Comments

- 2026-09-30: Open questions settled with the defaults: No Number, Plain, Outlined, Flaming and Legendary Glowing Gold at $1.85, now the second-cheapest Legendary after the Tires. The number is 0-99 and set with two wheels (tens and ones) that each turn round 0-9, and every turn is read aloud ("42!"). One number per Body. Built. `Fit` has a `doorNumber` beside the Slots. There's no save version bump: `readFit` reads a missing or broken number as 1 (his age isn't stored anywhere). The number isn't painted on the paint canvas itself. That canvas is projected from the side, so text on it reads backwards on the far side. So the number goes on a panel of its own on each side of the shell, placed from the same Decal shapes `drawPaint` uses (`src/garage/three/sidePaint.ts`). `numberSpot` picks the spot nearest the door (`door` in `bodies.ts`), as big as fits (digits 16-30 units tall), on the shell and clear of the windows, the School Bus bands, the Ice Cream awning, the wheels and the fitted Decal. The Stripes break round it. It also depends on the fitted Tires, so the number can move when the Tires change. Where there's no room, it tries in this order: let the Mega Spikes or Monster Treads spikes pass in front of it, then a dark plate that may cover Flames, Stripes, the small Lightning bolt or the wings but never the skull or the big bolt, then as a last resort a plate that the tops of the tires pass in front of. Only the Pickup and Race Car with Monster Treads plus Lightning or Skull & Wings reach that last step. With Skull & Wings the plate shows on the Pickup, Big Foot, Dragster, School Bus, Tow Truck and Race Car. Glowing Gold glows (an emissive map) and pulses. The picker opens from a pulsing number button in the Door Number sheet once a style is fitted. While it is open every hotspot steps away so none covers the number, and a turn only repaints the number, not the whole Truck. 114 new clips (0-99 and the Mod lines). GLOSSARY has a Door Number entry. Checked by eye in headless Chromium on all 12 Bodies with every Decal, at small tires and Monster Treads, with each style and on several paints, and the picker in portrait and landscape. Still open: Flaming on Gold Flake is the lowest contrast; the numbers placed near a wheel with Monster Treads have spikes sweeping past them; the iPad check.
