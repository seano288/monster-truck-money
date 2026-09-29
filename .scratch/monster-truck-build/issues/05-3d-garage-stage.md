# 05: 3D Garage stage

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Garage and the Bolt economy") · Port from the "3D Garage" prototype (`prototype/garage-screen` @ `9780a65`)

**What to build:** On first launch he chooses a Body. Tapping the Garage tile opens the full-screen 3D Garage: his Truck in the Real look, which he can spin, with a hotspot on each Slot that swings the camera to that part and opens its Mod sheet. At this stage every Slot shows only its free default. ◀ ▶ switch the Body.

**Blocked by:** 03 (First playable: a Learn the Coins Round)

**Status:** ready-for-human

- [ ] First launch only: choose Pickup, Big Foot or Dragster (spoken names), saved
- [ ] The three Bodies in the Real look, built in code with three.js (extruded profile, clear-coat, canvas paint texture, detailed chassis and wheels, per-Body extras), ported from the prototype into typed modules
- [ ] Drag to spin on a turntable; after 12 s idle it spins slowly by itself
- [ ] One hotspot per Slot follows the Truck and hides when its part faces away
- [ ] Opening a Slot swings the camera to the part, shifts the Truck clear, and opens a bottom sheet (portrait) or side panel (landscape) listing that Slot's 4 Mods, the default fitted
- [ ] The Horn can be tapped to hear it
- [ ] ◀ ▶ switch the Body free; the choice is saved
- [ ] 🏠 and ▶ (replay the last mode) sit in the top-right corner
- [ ] Checked on the iPad: smooth frame rate, no scrolling in either orientation
