# Prototype the Truck art and the Garage screen

Type: prototype
Status: resolved
Blocked by: 03
Map: [Monster Truck Garage](../map.md)

## Question

What do the Truck and the Garage look like, and how does using the Garage feel? How is a Truck drawn so Mods can be layered onto it (body, wheels, paint, decals, lights)? How does a 6-year-old choose a Body, browse Mods, see what he can't afford yet, unlock one, and swap parts, with no scrolling on iPad in portrait and landscape? Build a rough, clickable prototype to react to (ideally with him).

## Answer

Prototypes are on the throwaway branch `prototype/garage-screen` (`.scratch/monster-truck-garage/prototypes/`; run `python3 -m http.server 8080` there). `garage-3d-prototype.html` is the approved one.

- **Layout: "Tap the truck"** (variant C of three). The Truck fills the stage, with one hotspot button on each Slot's part. Tapping a hotspot opens a sheet of that Slot's 4 Mods: a bottom sheet in portrait, a side panel in landscape. Nothing scrolls. ◀ ▶ arrows switch the Body. The Bolt pile and the goal bar sit in the top HUD.
- **The Truck is 3D and seen all the way round.** From the side only, Mods like Fog Lights went unnoticed. He drags to spin the Truck on a turntable. Opening a Slot swings the camera to that part (Lights goes to the front) and shifts the Truck clear of the sheet. The hotspots follow the Truck and hide when their part faces away. After 12 s idle the Truck slowly spins by itself.
- **Art technique: the "Real" look, built in code with three.js.** No modelling tool and no image assets.
  - Shell: each Body's side profile is extruded with rounded corners and a clear-coat paint material.
  - Paint and decals: one canvas texture projected from the side, so every Paint and Decal Mod fits every Body.
  - Detail: a tube chassis with 4-link suspension and coil-overs, tires with tread that grows per Tires Mod, beadlock rims, a grille, mirrors and mud.
  - Per-Body extras: stacks and a bed liner (Pickup), a spare wheel and side steps (Big Foot), a supercharger and a wheelie bar (Dragster).
  - Mods are meshes placed at anchor points set per Body.
  - Rejected looks: low-poly (too plain), cartoon with eyes, and toy bricks.
- **Stack impact (against ADR 0001):** this adds `three` as a dependency, about 170 kB gzipped plus OrbitControls and RoomEnvironment, precached like the rest. The Truck art question that ADR 0001 left open is settled here.
- **Unlock flow as prototyped:**
  - Tapping an owned Mod fits it.
  - Tapping an affordable Mod unlocks it in one tap (fanfare, the Truck hops, sparks, "You got X!").
  - Tapping a locked Mod makes it the goal and the voice says "You need N more Bolts".
  - Affordable tiles and hotspots pulse gold.
- **Still to check on the iPad:** the Real look's frame rate (it has the most meshes; merge geometry if it stutters), the phone layout, and a try-out with him.
