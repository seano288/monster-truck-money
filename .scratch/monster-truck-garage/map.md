# Map: Monster Truck Garage

Label: wayfinder:map

## Destination

A build-ready spec (`.scratch/monster-truck-garage/spec.md`) for the next version of Monster Truck Money. It should be ready to split into implementation issues: the Garage replaces racing as the reward, all three Game Modes are back, the UI is redesigned to fit an iPad without scrolling, and the static stack is chosen so a native app stays possible later. The prototypes approved along the way are linked from the spec.

## Notes

- **Player**: a 6-year-old who can't count money well yet. Voice comes first: every prompt is spoken, every button has an icon, and short words only support the voice. Big tap targets.
- **Device**: Safari on iPad, saved to the Home Screen, working offline after the first load. The layout must fit portrait and landscape **with no scrolling**; phones should still work.
- **Constraints**: no backend, and everything loads statically (currently GitHub Pages). A native app (such as Capacitor) is a *requirement to keep possible*, not something to build now.
- **Vocabulary**: use the terms in `GLOSSARY.md` (Game Mode, Level, Round, Bolt, Truck, Body, Slot, Mod, Garage).
- **Skills**: UI and look-and-feel tickets use `prototype`. Design conversations use `grilling` + `domain-modeling`. Facts come from `research`.
- **Current app**: a single `monster-truck-money.html` (about 1.1 MB, with base64 coin images and neural-voice clips embedded by `tools/make_voice.py`). Count the Cash and Pay the Garage (now renamed Pay the Shop) are commented out near line 311. The reward is a 3-race Monster Cup saved in `localStorage`.
- **Settled at charting**: racing is removed completely. Progress starts fresh (no carry-over). The game raises the Level automatically, with no parent override. There is one Truck at a time, and unlocked Mods can be swapped freely. Mods are paid for with Bolts, not money.

## Decisions so far

<!-- one line per closed ticket: - [title](issues/NN-slug.md): gist -->

- [iPad Safari storage and offline for a Home Screen web app](issues/01-ipad-storage-and-offline.md): Home Screen app is exempt from 7-day eviction; install before play (storage is separate from the Safari tab); media goes in the Cache API; sound needs a tap to start; hide saving behind a small seam so it can switch to Capacitor storage later.
- [Static stack options that keep a native app possible](issues/02-static-stack-options.md): all four stacks can deploy to Pages and wrap with Capacitor; the real differences are base64 overhead and agent readability (single file), JS weight (vanilla 2 kB to React 69 kB), and extra precache config for offline with Vite.
- [Garage economy: starter Trucks, Mods and Reward Tokens](issues/03-garage-economy.md): Rounds of 5 earn a flat 3 Bolts; 3 switchable Bodies; 5 Slots × 3 Mods at 3/9/18 Bolts (about 50 Rounds for everything); no gating; one-tap final unlocks; a goal bar during Rounds.
- [How Game Modes and Levels progress automatically](issues/04-mode-and-level-progression.md): Pay the Garage renamed Pay the Shop; modes open in a chain at Level 2; he picks the mode; each mode has its own Level, raised by Mastery (8 of the last 10 right first try, no help) and never lowered; smaller ranges, spoken choices and running totals, a new Help me pay; a level-up voice line plus an introduction card for the new money.

## Not yet specified

- **New Game Modes**: once the Garage economy exists, there may be modes like "can I afford it?", making change or comparing amounts. They might end up folded into the Garage itself.
- **Voice for new content**: every new phrase (Mod names, Garage prompts, mode intros) needs a recorded clip. How that pipeline works depends on the stack decision.
- **Sound and celebration**: what unlocking a Mod feels like (animation, sound, voice), now that race wins are gone.
- **Assembling the spec**: pulling the resolved decisions into `spec.md`, and deciding how to split it into implementation issues.

## Out of scope

- **Native app packaging** (Capacitor, App Store): only keeping it possible is in scope.
- **Real-money shop** (paying for Mods by counting out cash): left for a future effort once he can count. The spec should just avoid making it hard.
- **Racing or test drives** with the built Truck.
- **Owning several Trucks**.
- **Carrying over** the old trophies and cup progress.
- **Parent override** of Levels.
- **Any backend**, accounts or sync.
