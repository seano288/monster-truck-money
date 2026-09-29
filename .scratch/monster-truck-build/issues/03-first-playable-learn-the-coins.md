# 03: First playable: a Learn the Coins Round

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Screens and flow" and "Game Modes and Levels")

**What to build:** From tap to start he lands on the Tile home, taps Learn the Coins, plays a full-screen Round of 5 and finishes on a plain end-of-Round overlay that saves 3 Bolts. The other two mode tiles show locked. This is the first build he plays on the iPad.

**Blocked by:** 02 (Voice pipeline)

**Status:** ready-for-human

- [x] Tile home: a header with the title and Bolt pile; a Garage tile; three Game Mode tiles with icon, name and Level dots; the portrait and landscape arrangements from the approved "Tile home" prototype
- [x] Count the Cash and Pay the Shop tiles are grey with a padlock
- [x] Learn the Coins works as in the current game, limited to Level 1 money (penny, nickel, dime)
- [x] The Round screen has the top bar (🏠, 5 ⭐ progress, Bolt pile) and one question card with 🔊 replay
- [x] Wrong answers cost only a retry; cheers play after a correct first try
- [x] The end-of-Round overlay says "You earned 3 Bolts!", saves them, and offers ▶ Play again and 🏠
- [x] The Bolts survive closing and reopening the app
- [ ] Checked on the iPad: portrait and landscape, no scrolling, voice plays after the start tap

## Comments

**2026-09-29, Claude:** implemented in `86a351a` on `wayfinder/monster-truck-garage`.
Still open:
- Checked on the iPad: needs the iPad
