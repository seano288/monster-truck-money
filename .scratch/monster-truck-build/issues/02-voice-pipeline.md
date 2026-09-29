# 02: Voice pipeline: every phrase spoken from a recorded clip

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Voice and the phrase list")

**What to build:** One typed phrase list drives recording and playback. Every spoken line is a recorded clip in the game's voice (`en-US-AvaNeural`, rate -8%), and the build fails if any phrase lacks a clip. `say()` accepts only phrases from the list and joins money amounts from pieces. Tapping start plays the first line.

**Blocked by:** 01 (Skeleton)

**Status:** ready-for-agent

- [ ] A typed phrase list is the single source; `say()` accepts only its type
- [ ] The existing voice tool (`tools/make_voice.py`) records clips from that list as separate audio files plus a generated clip index
- [ ] The build fails with the missing phrase's text when a clip is missing
- [ ] Spoken text goes through the existing `speakable()` rewrites
- [ ] `say()` joins amounts from pieces ("It costs" + "2 dollars" + "25 cents"); Vitest covers the amount-to-pieces maths (singulars, cents only, dollars only)
- [ ] The base set is recorded: amount pieces, Learn the Coins lines, cheers and shared Round lines
- [ ] There is no browser-voice fallback
- [ ] Tapping start speaks "Let's go!"
