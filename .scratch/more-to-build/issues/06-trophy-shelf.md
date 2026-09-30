# 06: Trophy Shelf

**What to build:** trophies he earns by playing well rather than buying them. They show on a shelf in the Garage. Unlike Mods and Bodies they never run out, because new trophies can be added any time without touching the economy, and they reward learning, not just time played.

**Blocked by:** none

**Status:** ready-for-human

## Open questions (decide before building)

1. **Which trophies?** Defaults, in three kinds:
   - *Learning:* reach Level 2 and Level 3 in each Game Mode; earn a Mode's star.
   - *Skill:* 5, 10 and 20 first-try answers in a row; a perfect Round (every answer first try without help).
   - *Sticking with it:* 10, 25, 50, 100 and 250 Rounds finished; play on 5 different days.
2. **Do trophies give Bolts?** Default: **no**. The trophy is the reward, and keeping it separate stops the Garage economy from inflating.
3. **Tiered trophies?** Default: a counting trophy upgrades in place (bronze → silver → gold) instead of taking a new spot on the shelf.

## Tasks

- [x] GLOSSARY.md: add **Trophy** (earned by play, never bought, never lost), and note that it isn't a Mod and isn't bought with Bolts
- [x] `src/trophies/trophies.ts`: the trophy list, each one a pure check over the save plus the counters below. Tested
- [x] The save gains `trophies` (earned ids plus the date each was earned) and the counters the checks need: `roundsFinished`, `bestStreak`, `currentStreak`, `daysPlayed`. `SAVE_VERSION` 3 with a migration. Backfill what the old save already proves (Levels and stars reached)
- [x] Check for trophies at the end of every Round. A new trophy gets its own moment in the end overlay: the trophy drops in with a chime and "You earned {Trophy}!"
- [x] A 🏆 shelf in the Garage: earned trophies shine, and unearned ones show as grey silhouettes with a short hint, read aloud when he taps one
- [ ] ~~Show Off can put a trophy next to the Truck~~ dropped: the Show Off stage is 3D, and a trophy there is a separate job
- [x] Trophy names and lines go in `phrases.ts` and get recorded
- [x] Vitest: each check, streak counting across Rounds, the migration and backfill
- [ ] Checked on the iPad

## Comments

Built with the defaults from the open questions: the trophy list as given, no Bolts for trophies, and counting trophies (the streak and Rounds finished) upgrading in place. The Rounds trophy has 5 tiers, so it goes bronze, silver, gold, platinum, diamond. A trophy's name is what it asks for ("10 in a Row", "25 Rounds"), so the name doubles as the goal. "First-try" means right on the first try without help, as for Bolts and Mastery, and a miss or help breaks the streak right away, even if he leaves the Round before answering. Days played count the days he finished a Round. Trophy moments play last at the end of a Round. Still to do: check it on the iPad.
