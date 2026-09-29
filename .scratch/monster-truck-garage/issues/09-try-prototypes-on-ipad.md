# Try the prototypes on the real iPad

Type: task
Status: resolved
Map: [Monster Truck Garage](../map.md)

## Question

So far the prototypes have only run in headless Chromium. Before the spec settles the voice and the celebrations, play them on the real iPad in Safari, with him if possible, and record what happens:

- **Joined amounts**: do phrases built from pieces ("It costs" + "2 dollars" + "25 cents") sound natural, or do the gaps between clips sound choppy enough that whole phrases need recording?
- **3D Truck moves**: do the Garage turntable, the camera moves per Slot and the Mod-unlock jumps run smoothly?
- **Combo Rounds**: when several events land in one Round (about 7 s for a Level up plus a mode opening), does he wait, or is it too long?
- **Skip**: should a tap skip the rest of a moment? (The prototype has no skip.)
- **No scrolling**: do the Tile home, Round and Garage screens fit in portrait and landscape on the real device?

Prototypes: `prototype/app-shell` (layout and voice), `prototype/garage-screen` (3D Garage), `prototype/celebrations` (moments).

## Answer

Tried on the real iPad in Safari, and everything checks out (user report, 2026-09-29):

- **Joined amounts** sound natural enough, so money amounts stay joined from "N dollars" + "N cents" clips and there's no need to record whole phrases.
- **The 3D Truck moves** (turntable, camera moves per Slot, Mod-unlock jumps) run smoothly.
- **Combo Rounds** of about 7 s are fine as they are.
- **Skip**: no skip is needed. Moments stay unskippable, as prototyped.
- **No scrolling** holds for Home, Round and Garage in portrait and landscape.
