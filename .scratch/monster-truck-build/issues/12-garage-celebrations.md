# 12: Garage celebrations

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Celebrations") · Port from the "Celebrations" prototype (`prototype/celebrations` @ `6175229`)

**What to build:** Unlocking a Mod in the Garage makes the 3D Truck jump, bigger for higher Rungs, and a top-Rung Mod is framed by "Wow!" and "That's the best one!".

**Blocked by:** 06 (Mods and unlocking)

**Status:** ready-for-human

- [x] First Rung (0.6 s): a hop with sparks
- [x] Second Rung (1.3 s): a crouch, then a 360° spin jump
- [x] Top Rung (2.1 s): "Wow!", a big double-spin jump, fireworks and a shake, then "That's the best one!"
- [x] A Horn Mod plays its horn on landing
- [x] Input is blocked only for the length of the jump
- [x] Sounds are Web Audio, with no sound-effect files
- [ ] Checked on the iPad

## Comments

**2026-09-29, Claude:** implemented in `fd8e60a` on `wayfinder/monster-truck-garage`; the review fixes in `467d079` also touch it.
Still open:
- Checked on the iPad: needs the iPad
