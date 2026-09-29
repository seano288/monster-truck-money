# 06: Mods and unlocking

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Garage and the Bolt economy")

**What to build:** Bolts now buy Mods. All 15 Mods show on every Body; tapping an affordable one unlocks and fits it in one tap, tapping a locked one makes it the Goal and says how many Bolts are still needed. The Goal bar shows on Home, in Rounds and in the Garage, and the end of a Round tells him when he can build something new.

**Blocked by:** 05 (3D Garage stage)

**Status:** ready-for-human

- [x] The 15 Mods from the spec's table, as meshes at per-Body anchor points, fit all 3 Bodies
- [x] Prices 3 / 9 / 18 live in one table; unlocking goes only through `unlock(mod)`, which spends Bolts
- [x] Tapping an owned Mod fits it; an affordable one unlocks and fits in one tap (final, no confirm); a locked one becomes the Goal and plays "{Mod}. You need N more Bolts."
- [x] Unlocking plays "You got {Mod}!"; unlocked Mods are shared across Bodies, and each Body remembers its fitted Mods
- [x] Affordable Mod tiles and hotspots pulse gold
- [x] The Goal defaults to the cheapest locked Mod; the Goal bar shows on Home, in the Round top bar and in the Garage; tapping it speaks the Goal; with everything unlocked it says "You built everything!"
- [x] The end-of-Round overlay adds 🔧 Garage (pulsing when he can afford something) and plays "You can build something new!" when he can
- [x] Vitest covers the economy: prices, spending, the default Goal and "built everything"
- [ ] Checked on the iPad

## Comments

**2026-09-29, Claude:** implemented in `1cdf441` on `wayfinder/monster-truck-garage`; the review fixes in `467d079` also touch it.
Still open:
- Checked on the iPad: needs the iPad
