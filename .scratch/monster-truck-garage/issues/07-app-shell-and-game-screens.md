# Prototype the app layout and the game screens

Type: prototype
Status: resolved
Blocked by: 03, 04
Map: [Monster Truck Garage](../map.md)

## Question

How is the whole app laid out, and how does he move around it? That includes the home screen, getting into a Round, the three Game Mode screens, the end-of-Round reward, and moving between the game and the Garage. It all has to fit the iPad with no scrolling in portrait and landscape, still work on a phone, and look more polished than the current app. Build a rough, clickable prototype of the screens and how they connect.

## Answer

The prototype is on the throwaway branch `prototype/app-shell` (`.scratch/monster-truck-garage/prototypes/app-shell-prototype.html`; run `python3 -m http.server 8080` there). There were three variants: A Tile home, B Garage home (the 3D Garage is home and the Round slides over it), and C Road trip (a road with one stop per Game Mode). **A won.**

- **Home (Tile home)**: a header with the title, goal bar and Bolt pile, then one big Garage tile showing the Truck and three Game Mode tiles, each with its icon, name and Level dots. In portrait the Garage tile is on top with the three mode tiles in a row below it; in landscape the mode tiles are stacked on the left and the Garage tile fills the right. A locked mode is grey with a padlock and plays its voice hint when tapped. A mastered mode shows a ⭐. A newly opened tile pulses and the voice says "You opened …!".
- **Getting into a Round**: one tap on a mode tile. If that mode just levelled up, its introduction card for the new money comes first.
- **Round screen**: full screen. A top bar has 🏠, the 5 ⭐ progress, the goal bar and the Bolt pile. Below it, one card holds the question: the 🔊 replay button with the prompt, the money, the choices or the tray, and the helper buttons (🔎 Help me count or Help me pay, 👀, ↩).
- **End of Round**: a dark overlay. The Bolts fly onto a big pile with a clink each, the voice lines play (Bolts earned, then any level-up or opened mode, then "You can build something new!"), and there are two big buttons, 🔧 Garage (pulsing if he can afford something) and ▶ Play again, plus a small 🏠.
- **Garage**: its own full screen, the approved 3D Garage as it is, with 🏠 and ▶ (replay the last mode) in the top-right corner.
- **No scrolling** on any screen at iPad portrait (820×1180), iPad landscape (1180×820) or phone (390×844), checked in headless Chromium. It hasn't been tried on a real iPad yet.
- **Voice must be the same everywhere** (user feedback): browser-voice fallback sounded different from the game, so every phrase is a recorded clip in the game's voice (`en-US-AvaNeural`, rate -8%, as in `tools/make_voice.py`), the Garage included. Money amounts are too many to record whole, so they are joined from "N dollars" + "N cents" clips ("It costs" + "2 dollars" + "25 cents"). The prototype has one shared voice engine (`say.js`), and a headless playthrough of every screen found no sentence without a clip. For the spec: the phrase list must include the amount pieces, and the build should fail on a missing clip (as ADR 0001 already says) instead of falling back to the browser voice.
