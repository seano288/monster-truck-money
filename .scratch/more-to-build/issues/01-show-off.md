# 01: Show Off

**What to build:** a Show Off button in the Garage that puts his Truck on stage and lets him save a photo of it. He loves showing his trucks off, and right now there's no moment made for that.

**Blocked by:** none

**Status:** ready-for-human

- [x] A 📸 Show Off button in the Garage opens a full-screen show of the current Truck (current Body, fitted Mods)
- [x] The show: the lights dim, a spotlight falls on the Truck, the turntable spins slowly, and it plays the crowd cheer and his fitted Horn (`HORNS` in `src/audio/sfx.ts`). Build it from the existing `GarageStage` (`src/garage/three/stage.ts`) and the moves and effects in `src/celebrate/`
- [x] Tapping the Truck during the show plays a move (`hop` / `jump` / `mega` from `MOVES`) and the horn, so he can perform it for someone
- [x] A camera button saves a picture of the Truck to Photos. On iPad Safari and the installed app, use `navigator.share({ files: [png] })` (the share sheet has "Save Image"), with a download as the fallback. Capturing the canvas needs `preserveDrawingBuffer: true` on the `WebGLRenderer`, or a render right before `toBlob()`
- [x] The photo has the Truck on a bright show background (no hotspots or UI), with his Body's name on it
- [x] A shutter flash plays when the photo is taken, and he hears "Say cheese!" when he taps the camera
- [x] A big ✕ goes back to the Garage
- [x] New phrases ("Show time!", "Say cheese!") go in `src/voice/phrases.ts` and get recorded with `tools/make_voice.py`
- [x] Vitest covers anything with logic (e.g. choosing the share or fallback path); the show itself is checked by eye
- [ ] Checked on the iPad: the photo lands in Photos from the installed Home Screen app

## Comments

- 2026-09-29: Built. 📸 in the Garage HUD puts the stage into show mode (`GarageStage.show`), and `ShowOff.tsx` adds the ✕, the camera and the tap-to-perform (hop → jump → mega, with the horn). `GarageStage.photo()` renders on a bright background and reads the canvas back in the same task, so `preserveDrawingBuffer` isn't needed. It encodes synchronously so the share sheet opens inside the tap. `savePhoto` (`src/garage/show/photo.ts`, tested) shares when `canShare({ files })` allows, stops if he closes the sheet, and downloads otherwise. In headless Chromium it downloaded the PNG. The iPad check is still to do: confirm the photo reaches Photos from the Home Screen app, and that the share sheet still opens after the encode.
