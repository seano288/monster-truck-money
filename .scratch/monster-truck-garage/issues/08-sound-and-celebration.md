# Prototype the sound and celebration moments

Type: prototype
Status: resolved
Blocked by: 06, 07
Map: [Monster Truck Garage](../map.md)

## Question

Now that racing is gone, what do the big moments look, sound and feel like? These are: finishing a Round (the Bolts landing on the pile in the end-of-Round overlay), unlocking a Mod in the Garage, a Level going up, a Game Mode opening, and a Game Mode reaching ⭐. For each, what is the animation, the sound and the voice line, and how long does it take before he can tap again? Should the moments get bigger for bigger events (a top-rung Mod compared with a first one)? Build on the "Tile home" prototype on `prototype/app-shell` so each moment can be triggered and compared on the iPad.

## Answer

The prototype is on the throwaway branch `prototype/celebrations` (`.scratch/monster-truck-garage/prototypes/celebration-prototype.html`; run `python3 -m http.server 8080` there). It is built on the Tile home shell, and the ⋯ menu on the floating bar triggers each moment. There were three variants: A Quick pop (small and the same size for everything), B Big show (a full-screen card for each event) and C Truck show. **C won.**

- **The Truck does the celebrating.** The end-of-Round overlay has a small road under the Bolt pile, and the Truck acts out each moment on it. In the Garage, the 3D Truck does the moves.
- **Moments grow with the event**, in three tiers:
  - Tier 1: finishing a Round, a first-rung Mod.
  - Tier 2: a second-rung Mod, a Level going up, a Game Mode opening.
  - Tier 3: a top-rung Mod, a Game Mode reaching ⭐.
- **Each moment as prototyped** (timings are from a headless run):
  - **Round done** (about 2.3 s): the Truck drives in with the 3 Bolts in its bed (engine), stops and rocks, and the Bolts fly onto the pile one at a time with a clink each while the count goes up. Voice: "You earned 3 Bolts!"
  - **Level up** (+ about 2 s): a wheelie on the rear wheels with a honk, and the new money pops up beside the Truck with a chime and confetti. Voice: "Level up! Now you get quarters!"
  - **Game Mode opens** (+ about 2.9 s): the mode's icon appears with a padlock, and the Truck jumps onto it and crushes the padlock (crunch, screen shake, bits flying). Voice: "You opened Count the Cash!" It is celebrated in the overlay, because he may tap ▶ Play again and never see Home. On Home the tile just pulses and the voice line plays again.
  - **Game Mode reaches ⭐** (+ about 4.3 s): a ramp appears, the Truck backs up, speeds at it (drumroll), and does a full flip through a giant star with fireworks and the long fanfare, then lands with a thud and a shake. Voice: "You are a Count the Cash star!"
  - **Mod unlock** in the Garage, by rung:
    - First rung: a hop with sparks, a boing and a chime (0.6 s).
    - Second rung: a crouch, then a jump with a 360° spin, with engine and whoosh sounds and a fanfare on landing (1.3 s).
    - Top rung: a big jump with two spins and the nose up, then a landing thud, fireworks, the long fanfare and a shake (2.1 s).
    - Voice: "You got X!". A top-rung Mod adds "Wow!" before it and "That's the best one!" after it. A Horn Mod plays its horn on landing.
- **Tapping again**: nothing takes a tap while a moment plays. The overlay's 🔧 Garage and ▶ Play again buttons stay dimmed until every event has played. When several events come in one Round they play smallest first; a Level up plus a mode opening came to about 7 s. In the Garage, input is blocked only for the length of the jump.
- **Sounds** are made in code (Web Audio) with no audio files. The voice lines are recorded clips in the game's voice, and the prototype added "Wow!" and "That's the best one!".
- **Still to check on the iPad**: the 3D Truck moves have not been seen yet (headless Chromium was too slow to render them), whether the long combo Rounds feel too long for him, and whether a tap should skip the rest of a moment (the prototype has no skip).
