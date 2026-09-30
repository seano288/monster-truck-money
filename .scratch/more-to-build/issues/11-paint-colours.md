# 11: Paint Colours

**What to build:** paint colours as a separate set of cheap unlocks, alongside the Paint Rungs, which become finishes. There are lots of small 3-5 Bolt buys, so there's nearly always something he can afford after a single Round.

**Blocked by:** none

**Status:** done (iPad check still to do)

## Open questions (decide before building)

1. **Colour or finish?** The Paint Rungs today (Blue Blast, Fire Fade, Rainbow Chrome, Gold Flake) are part colour, part finish. Options:
   - (a) keep the Rungs as they are and let a colour tint the base coat of Plain and Fire Fade only;
   - (b) rework the Rungs into finishes (Gloss, Fade, Chrome, Gold Flake) that apply to any colour.
   The default is **(a)**, because it leaves bought Mods looking as they did.
2. **Which colours, and how many?** Default 12: Red, Orange, Yellow, Lime, Green, Teal, Sky Blue, Navy, Purple, Pink, Black, White. The first (Red) is free.
3. **Price.** Default 3 Bolts each, for 33 Bolts in all.
4. **Does a colour count toward `builtEverything`?** Default: yes.

## Tasks

- [x] GLOSSARY.md: add **Colour**. Decide whether it's a Mod or its own thing. It isn't a Slot, because it sits alongside Paint
- [x] The catalog gets `COLOURS`, the economy prices them in the one Bolt prices table, and buying goes through `unlock`. The Goal skips colours unless he taps one, so cheap colours don't take over the Goal bar
- [x] The save gains unlocked colours and a colour per Body. Take the next save version and add a migration (old saves: Red on every Body)
- [x] A colour row in the Paint Mod sheet, as big swatches with a lock and price on locked ones
- [x] `drawPaint` in `src/garage/three/truck.ts` uses the Body's colour where the fitted Paint allows it
- [x] Colour names go in `phrases.ts` and get recorded
- [x] Vitest: prices, buying, the Goal skipping colours, migration
- [ ] Checked on the iPad

## Comments

**Decided (2026-09-30):** (a), so the Rungs keep their look and a Colour shows on Plain and Fire Fade. The fire fades into the Colour's deep shade, and Red's deep shade is the old `#a80000`. There are 12 Colours. Red is free and the default, and Plain Trucks, old saves included, now show Red instead of grey. The rest cost 3 Bolts each, and Colours count toward `builtEverything`.

**Also built:** a Colour becomes the Goal on its own only once nothing else bought with Bolts is left. Without that, the Goal bar would skip to Legendaries while Colours were still locked. Tapping a Colour while Blue Blast, Rainbow Chrome or Gold Flake is fitted puts the Paint back to Plain so he sees the Colour. Affordable Colours ping the Paint hotspot and count as something he can build at the end of a Round.
