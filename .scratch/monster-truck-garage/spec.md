# Spec: Monster Truck Money, the Garage version

Map: [Monster Truck Garage](map.md) · Stack: [ADR 0001](../../docs/adr/0001-vite-preact-static-stack.md) · Terms: [GLOSSARY.md](../../GLOSSARY.md)

## Overview

The next version of Monster Truck Money for a 6-year-old who can't count money well yet. Racing is removed completely. The reward becomes the **Garage**: finishing a **Round** earns **Bolts**, and Bolts unlock **Mods** for his one 3D **Truck**. All three **Game Modes** are back (Learn the Coins, Count the Cash, Pay the Shop). Each has its own **Level**, which the game raises by itself on **Mastery**. It is a fresh build (Vite + Preact + strict TS + three.js) that replaces the old app at the same GitHub Pages URL. Progress starts fresh, and old trophies and cup saves are ignored.

## Player and device

- **Voice first.** Every prompt is spoken, every button has an icon, and short words only support the voice. Tap targets are big.
- **Safari on iPad, saved to the Home Screen**, working offline after the first load. Every screen fits portrait and landscape **with no scrolling** (checked at 820×1180, 1180×820 and 390×844 for phones).
- **Sound needs a tap to start**, so the app opens on a tap-to-start screen.
- **Install before play.** Safari-tab storage and Home Screen app storage are separate, so he installs at cutover and plays only from the Home Screen.

## Screens and flow

Approved layout: "Tile home" ([Prototype the app layout and the game screens](issues/07-app-shell-and-game-screens.md)).

1. **Tap to start** → on first launch only, **choose a Body** (Pickup, Big Foot or Dragster) → **Home**.
2. **Home**: a header with the title, Goal bar and Bolt pile. Below it are one big Garage tile (showing his Truck) and three Game Mode tiles, each with its icon, name and Level dots. In portrait the Garage tile sits on top with the mode tiles in a row below it. In landscape the mode tiles are stacked on the left and the Garage tile fills the right.
   - A **locked** mode is grey with a padlock, and tapping it plays its hint.
   - A **mastered** mode (Level 3 with Mastery) shows a ⭐ badge.
   - A **newly opened** tile pulses, and the "You opened …!" line plays again.
3. **Round**: one tap on a mode tile starts it. If that mode just levelled up, the **introduction card** for the new money comes first. The Round is full screen:
   - The top bar holds 🏠, the 5 ⭐ progress, the Goal bar and the Bolt pile.
   - One card below holds the question: 🔊 replay with the prompt, the money, the choices or the tray, and the helpers (🔎 Help me count or Help me pay, 👀 Show me all the money, ↩).
4. **End of Round**: a dark overlay with the celebration road (see Celebrations), followed by two big buttons, 🔧 **Garage** (pulsing if he can afford something) and ▶ **Play again**, plus a small 🏠. The buttons stay dimmed until every moment has played.
5. **Garage**: its own full screen, with 🏠 and ▶ (replay the last mode) in the top-right corner.

## Game Modes and Levels

From [How Game Modes and Levels progress automatically](issues/04-mode-and-level-progression.md).

- **A Round** is 5 correct answers. A wrong answer only costs a retry, and answers he gets right with help still count toward the 5. Every mode earns a flat **3 Bolts** per Round.
- **Unlock chain**: Learn the Coins is open from the start. Count the Cash opens when Learn the Coins reaches Level 2, and Pay the Shop opens when Count the Cash reaches Level 2. He picks any open mode.
- **Levels** (per mode, starting at 1, never going down, top is 3): Level 1 uses pennies, nickels and dimes, Level 2 adds quarters, and Level 3 adds $1 and $5 bills.
- **Mastery**: 8 of the last 10 problems in that mode right on the first try without help. The 10-problem window is saved across sessions and clears on Level up. Mastery at Level 3 gives the ⭐.
- **Struggle help**: if he has missed 5 of the last 10, help is offered after a single miss (for example, Help me count runs automatically).
- **Learn the Coins**: as in the current game (names, values, which is worth more or less), limited to the money of its Level.
- **Count the Cash**: piles are sorted biggest first. The prompt and each choice are read aloud with the choice's button lit.
  - Level 1: at most 5 pieces, up to 30¢
  - Level 2: at most 6 pieces, up to 75¢
  - Level 3: at most 6 pieces, up to $3, using $1 bills with a $5 bill now and then
- **Pay the Shop**: shop items that aren't Mods (Fuel, Snack, Car Wash, Oil, Juice, Battery). Prices are 5–25¢ at Level 1, 10–60¢ at Level 2, and $1–$3 plus some cents at Level 3. Each coin tap speaks the new running total. **🔎 Help me pay** fills the tray one coin at a time, biggest first, saying the total as it goes, and using it marks the problem as "with help".
- **No hidden difficulty ramp** inside a Level unless playtesting shows the jumps are too steep.

## Garage and the Bolt economy

From [Garage economy](issues/03-garage-economy.md) and [Prototype the Truck art and the Garage screen](issues/06-truck-art-and-garage-screen.md).

- **Bodies**: Pickup, Big Foot and Dragster. He can switch free at any time with ◀ ▶. Unlocked Mods are shared across Bodies, and each Body remembers its fitted Mods. Every Mod fits all 3 Bodies.
- **Slots and Mods** (the free default first, then Rungs costing 3 / 9 / 18 Bolts): 15 Mods and 150 Bolts in all, which works out to the first Mod after 1 Round, a top Rung after 6 Rounds and everything after about 50 Rounds.

| Slot | Default | First (3) | Second (9) | Top (18) |
|---|---|---|---|---|
| Tires | Small | Chunky | Giant | Mega Spikes |
| Paint | Plain | Blue Blast | Fire Fade | Rainbow Chrome |
| Decals | No Decals | Stripes | Flames | Lightning |
| Lights | Basic | Fog Lights | Roof Bar | Glow Under |
| Horn | Beep | Honk | Air Horn | Roar |

- **No gating**: Level and Game Mode never lock a Mod. Bolts are the only way to unlock one.
- **Layout: "Tap the truck"**. The 3D Truck fills the stage, with one hotspot on each Slot's part. Tapping a hotspot opens that Slot's sheet of 4 Mods: a bottom sheet in portrait, a side panel in landscape.
  - He drags to spin the Truck on a turntable.
  - Opening a Slot swings the camera to that part and shifts the Truck clear of the sheet.
  - Hotspots follow the Truck and hide when their part faces away.
  - After 12 s idle, the Truck slowly spins by itself.
  - The Horn can be tapped to hear it.
- **Tapping a Mod**:
  - An **owned** Mod is fitted.
  - An **affordable** one is unlocked in one tap and fitted straight away. It's final, with no confirm and no refunds.
  - A **locked** one becomes the **Goal**, and the voice says "{Mod}. You need N more Bolts."
  - Affordable tiles and hotspots pulse gold.
- **Goal**: by default it's the cheapest locked Mod. The Goal bar shows on Home, in Rounds and in the Garage, and tapping it speaks the Goal. Once every Mod is unlocked, it says "You built everything!"
- **The look: "Real", built in code with three.js**, with no image assets.
  - Each Body's side profile is extruded with rounded corners and a clear-coat material.
  - Paint and Decals are one canvas texture projected from the side.
  - The chassis has a tube frame, 4-link suspension and coil-overs. Tires have tread that grows per Mod, with beadlock rims, plus a grille, mirrors and mud.
  - Per-Body extras: stacks and a bed liner (Pickup), a spare wheel and side steps (Big Foot), a supercharger and a wheelie bar (Dragster).
  - Mods are meshes placed at anchor points set per Body.
  - If the frame rate stutters on the iPad, merge geometry.

## Celebrations

From [Prototype the sound and celebration moments](issues/08-sound-and-celebration.md): the "Truck show". The Truck acts out each moment on a small road in the end-of-Round overlay, and the 3D Truck does it in the Garage.

| Tier | Moments |
|---|---|
| 1 | Round done; first-Rung Mod |
| 2 | Level up; Game Mode opens; second-Rung Mod |
| 3 | Game Mode reaches ⭐; top-Rung Mod |

**In the overlay**:
- **Round done** (~2.3 s): the Truck drives in with 3 Bolts in its bed, and they fly onto the pile with a clink each.
- **Level up** (+~2 s): a wheelie with a honk, and the new money pops up with a chime and confetti.
- **Mode opens** (+~2.9 s): the Truck crushes the mode's padlock, with a crunch, a shake and flying bits.
- **⭐** (+~4.3 s): a ramp flip through a giant star, with fireworks and the long fanfare.

**In the Garage**:
- **First Rung** (0.6 s): a hop with sparks.
- **Second Rung** (1.3 s): a crouch, then a 360° spin jump.
- **Top Rung** (2.1 s): a big double-spin jump, then fireworks and a shake.
- A Horn Mod plays its horn on landing.

**Rules**:
- Several events in one Round play smallest first. A ~7 s combo is fine.
- Moments can't be skipped, and no tap is taken while one plays. In the Garage, input is blocked only for the length of the jump.
- Sounds are made in code (Web Audio), with no sound-effect files.

## Voice and the phrase list

- **One voice everywhere**: every phrase is a recorded clip in `en-US-AvaNeural` at rate -8% (as `tools/make_voice.py`). There is no browser-voice fallback, and a missing clip fails the build.
- **Money amounts are joined from pieces** ("It costs" + "2 dollars" + "25 cents"), which the device test confirmed sounds natural.
- `voice/phrases.ts` is the single typed list, and `say()` accepts only its type. The patterns below map one-to-one onto it. Spoken text goes through the existing `speakable()` rewrites ($1 → "one dollar", 25¢ → "25 cents", VROOM → "Vroom" and so on).

**Money names and values**: `{money}` is Penny, Nickel, Dime, Quarter, $1 Bill or $5 Bill. `{value}` is 1¢, 5¢, 10¢, 25¢, $1 or $5.

**Learn the Coins** (carried over)
- What is this called? · How much is this worth? · Which is worth more? · Which is worth less? · Try again! · The dime is small, but it is worth more! · Tap a coin to hear its name.
- Per money: Tap the {money}! · {money}? · {value}? · That's a {money}. · Find the {money}! · {money} is {value}.

**Cheers** after a correct first try, in every mode (carried over)
- VROOM! Great job! · Monster move! · You got it! · Truck-tastic! · Crushing it! · Awesome counting!

**Rounds**
- Let's go! · How much money is this? · Not quite! · Let's count together. · Tap some money first! · Almost! · You need · more · Too much! · Take back · It costs
- Buy the {item}! for Fuel, Snack, Car Wash, Oil, Juice and Battery
- Used as "Almost! You need {amount} more." / "Too much! Take back {amount}." / "It costs {amount}."

**Introduction card**
- Look! · New money! · This is a {money}. · It is worth {value}.

**Progress and end of Round**
- You earned 3 Bolts! · You can build something new! · Level up! · Now you get quarters! (Level 2) · Now you get dollar bills! (Level 3)
- You opened {mode}! and You are a {mode} star! for each of the three modes
- Locked hints: Count the Cash → "Learn more coins to open this!", Pay the Shop → "Count more cash to open this!"

**Amount pieces**
- {n} cents for 1–99 (1 cent singular) · {n} dollars for 1–9 (1 dollar singular)

**Garage**
- Garage! · Body names (3) · Slot names (5) · Mod names including the defaults (20)
- You got {Mod}! and You can get {Mod}! for each of the 15 unlockable Mods
- You need {n} more Bolts. for 1–18 (1 Bolt singular) · You built everything!
- Top Rung only: Wow! (before) and That's the best one! (after)

By this count that's about 280 clips. The build's missing-clip check, not this number, decides whether any are missing.

**Dropped from the old game**: Ready, set, go! · You won the race! · Get ready for the next race! · You won a trophy! · You won the Monster Cup! · You crushed it!

## Save data

- `localStorage` behind an async `load()`/`save()` seam, with a schema `version` and one `navigator.storage.persist()` call. It uses new keys, so old saves are ignored. The seam is the swap point for Capacitor Preferences later.
- **Saved state**: the chosen Body; the Mods fitted per Body; the unlocked Mods; the Bolts; the Goal; each mode's Level and 10-problem window; which modes are opened and starred; pending intro cards; and which newly opened tiles still need to pulse.
- Save migrations are pure functions covered by Vitest.

## Stack

As ADR 0001, plus `three` (~170 kB gzipped, with OrbitControls and RoomEnvironment) for the Truck.
- Vite with `base: './'` and hashed separate assets.
- Preact with `@preact/signals`, in strict TS.
- `vite-plugin-pwa` precache with `autoUpdate` applied on the next launch, never mid-Round. The service worker registers only on the web, and nothing reads the Cache API.
- CI runs `tsc --noEmit` and Vitest on the pure logic (Mastery, Levels, economy, coin maths, save migration).
- Layout and feel are checked by hand on the iPad.

## Home Screen icon and name

Decided in [Prototype the Home Screen icon](issues/11-home-screen-icon.md). The build ships it in the cutover slice.

- **Icon: "Truck head-on"**. A red Truck seen from the front on two big black tires, with a blue windshield, headlights and a grille, black cartoon outlines, on a yellow (`#ffd23f`) sunburst. The prototype's SVG is the reference art.
- **Made in code**: one 512×512 SVG (a background layer and an art layer), rasterised to PNG at build time. There are no image assets. It is a full square with no transparency, because iOS masks it itself.
- **Files**: `apple-touch-icon` 180×180; manifest icons 192 and 512 (`purpose: any`); a maskable 512 with the art scaled to 80% inside the safe zone, on the same yellow.
- **Name**: "Truck Money" under the icon (`apple-mobile-web-app-title`, manifest `short_name`). "Monster Truck Money" is the manifest `name` and the page `<title>`.
- **Colours**: `theme_color` and `background_color` are `#23252b`, the app's dark background, and the page paints that colour first so the launch screen matches the app.

## Guardrails for future work

These are out of scope now, but the build must not make them harder.

- **New Game Modes** (follow-ups: "can I afford it?", making change, comparing amounts):
  - Each mode is a module behind one shared interface: make a problem, check an answer, its Level table, its intro money and its phrases.
  - Home tiles and the unlock chain are built from the list of modes, so adding a mode means adding a module and a list entry.
- **Real-money shop**: Mod prices live in one table, and unlocking goes through a single `unlock(mod)` call that spends Bolts. A later "pay with cash" flow can then reuse Pay the Shop's tray to pay that price.
- **Native app**: `dist/` has an `index.html` with relative paths, storage sits behind the seam, and nothing depends on the service worker.

## Build plan

Ordered slices. **HITL** means the done-check needs the iPad or the owner's eye, and **AFK** means tests and a headless run can prove it. Each slice adds its own phrases to `phrases.ts` and records them, and the missing-clip check catches any gaps. Slices 5, 6, 10 and 11 **port** the three.js Truck-building and move code from the pinned prototype commits into typed modules. The app shell is written fresh in Preact.

| # | Slice | Type | Contents |
|---|---|---|---|
| 1 | Skeleton | AFK | Vite + Preact + strict TS; CI (`tsc`, Vitest); Pages preview deploy with `base: './'`; tap-to-start screen; save seam |
| 2 | Voice pipeline | AFK | `phrases.ts` → `make_voice.py` → `public/voice/*.mp3` + `voice.gen.ts`; build fails on a missing clip; `say()` with amount joining; base set recorded (amount pieces, Learn the Coins, cheers, shared lines) |
| 3 | First playable: Learn the Coins Round | HITL | Tile home (other modes locked); full-screen Round; plain end-of-Round overlay saving 3 Bolts; first iPad check |
| 4 | Mastery and Levels | AFK | 8-of-10 window, Level up, intro card, struggle help, starting with Learn the Coins |
| 5 | 3D Garage stage | HITL | three Bodies in the Real look, turntable, hotspots, Mod sheet, defaults, first-launch Body choice, idle spin |
| 6 | Mods and unlocking | HITL | all 15 Mods on every Body, `unlock(mod)`, Goal and Goal bar, "You need N more Bolts", Garage button pulse, "You can build something new!" |
| 7 | ✂ Cutover | HITL | offline precache; Home Screen icon and name (from [Prototype the Home Screen icon](issues/11-home-screen-icon.md)); replace the old app at the Pages URL; install on the iPad |
| 8 | Count the Cash | AFK | the mode, the unlock chain, padlocks and hints, "You opened …!" (plain) |
| 9 | Pay the Shop | AFK | the mode, running totals, Help me pay |
| 10 | Round celebrations | HITL | the Truck show in the overlay, three tiers, smallest first, input blocked, Web Audio sounds |
| 11 | Garage celebrations | HITL | unlock moves by Rung, Horn on landing, Wow! / That's the best one! |

The **first playable slice** is 3. Until slice 7 the build runs only as a preview, and he keeps the old app. Celebrations come after cutover, so he gets the Garage sooner with a plain overlay.

## Prototype links

The prototypes live on throwaway branches, pinned by commit. To run one, check out the commit and run `python3 -m http.server 8080` in `.scratch/monster-truck-garage/prototypes/`.

| What | Branch @ commit | File |
|---|---|---|
| App layout and voice ("Tile home") | `prototype/app-shell` @ `de182c4` | `app-shell-prototype.html`, `say.js`, `make_prototype_voice.py` |
| 3D Garage ("Tap the truck", Real look) | `prototype/garage-screen` @ `9780a65` | `garage-3d-prototype.html` |
| Celebrations ("Truck show") | `prototype/celebrations` @ `6175229` | `celebration-prototype.html` (built on the other two) |
| Home Screen icon ("Truck head-on") | `prototype/home-icon` @ `f426946` | `home-icon-prototype.html` |

Research: `research/ipad-storage-and-offline` @ `3f2dad0`, `research/static-stack-options` @ `9905ee2`.
