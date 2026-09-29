# Assemble the spec and plan the split

Type: grilling
Status: resolved
Blocked by: 09
Map: [Monster Truck Garage](../map.md)

## Question

What goes into `spec.md`, and how does it split into implementation issues? Pull the resolved decisions into one build-ready spec that links the approved prototypes. Settle the final wording of every phrase in the phrase list (Mod names, Garage prompts, mode intros, level-up lines, celebration lines, amount pieces). Then decide how to slice the build into issues (order, which ones are AFK or HITL, and what the first playable slice is). The spec should also note the out-of-scope items it must not make harder: a real-money shop and new Game Modes.

## Answer

Resolved by grilling (all recommendations accepted). The spec is `spec.md`. Glossary updated with **Rung** and **Goal**.

- **Spec shape**: sections by area, with prototypes linked by branch and pinned commit (nothing from them is committed to `main`).
- **Phrase list**: grouped by use. Fixed lines are written out and template lines are given as patterns with their fill-ins (about 280 clips), and the build's missing-clip check is the authority. Learn the Coins prompts, the dime hint and the six cheers carry over, the cheers are used in all modes, and the race, trophy and cup lines are dropped. The Decals default is renamed **No Decals**. Locked hints are "Learn more coins to open this!" (Count the Cash) and "Count more cash to open this!" (Pay the Shop). All Body and Mod names are kept as prototyped.
- **Guardrails**: each Game Mode is a module behind one interface, with home tiles and the unlock chain built from the list of modes; Mod prices live in one table, and unlocking goes through a single `unlock(mod)` call, so a real-money shop can reuse Pay the Shop's tray.
- **Build plan**: 11 ordered slices, listed in the spec rather than written as issue files (that split is the hand-off). Slice 3 (a Learn the Coins Round with Bolts saved) is the first playable. Cutover is slice 7, after the Garage and Mods, and the build is preview-only until then. Celebrations come after cutover. A slice is HITL when its check needs the iPad, otherwise AFK. The three.js Truck and move code is ported from the pinned prototypes, and each slice records its own phrases.
- **Surfaced**: the Home Screen needs an icon and name, which became the new ticket [Prototype the Home Screen icon](11-home-screen-icon.md). The spec holds a placeholder section, and cutover slice 7 builds it.
