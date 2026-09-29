# 11: Round celebrations

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Celebrations") · Port from the "Celebrations" prototype (`prototype/celebrations` @ `6175229`)

**What to build:** The plain end-of-Round overlay becomes the Truck show: his Truck acts out each moment on a small road, getting bigger for bigger events, with sounds made in code. The buttons stay dimmed until every moment has played.

**Blocked by:** 05 (3D Garage stage), 09 (Count the Cash)

**Status:** ready-for-human

- [x] Round done (~2.3 s): the Truck drives in with 3 Bolts in its bed, and they fly onto the pile with a clink each
- [x] Level up (+~2 s): a wheelie with a honk; the new money pops up with a chime and confetti
- [x] Mode opens (+~2.9 s): the Truck crushes the mode's padlock with a crunch, a shake and flying bits
- [x] ⭐ (+~4.3 s): a ramp flip through a giant star, with fireworks and the long fanfare
- [x] Several events play smallest first; moments can't be skipped and no tap is taken while one plays
- [x] All sounds are Web Audio, with no sound-effect files; voice lines play in step with the moments
- [ ] Checked on the iPad, including a ~7 s combo

## Comments

**2026-09-29, Claude:** implemented in `6de5044` on `wayfinder/monster-truck-garage`.
Still open:
- Checked on the iPad, including a ~7 s combo: needs the iPad (headless: the combo takes about 7 s and fits every screen size)
