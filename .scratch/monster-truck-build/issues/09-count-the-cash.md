# 09: Count the Cash

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Game Modes and Levels")

**What to build:** Count the Cash opens when Learn the Coins reaches Level 2, with a plain "You opened Count the Cash!" and a pulsing tile. Until then its tile is locked and tapping it plays the hint. The mode shows a pile of money and asks how much it is, with its own Level ranges, Help me count and struggle help.

**Blocked by:** 04 (Mastery and Levels)

**Status:** ready-for-agent

- [ ] The mode plugs into the shared mode interface; the unlock chain is built from the list of modes
- [ ] Locked tile: grey with a padlock; tapping plays "Learn more coins to open this!"
- [ ] Opening plays "You opened Count the Cash!" in the end-of-Round overlay; the tile pulses and replays the line on Home until he taps it (saved)
- [ ] Piles are sorted biggest first; the prompt and each choice are read aloud with the choice's button lit
- [ ] Level ranges: L1 at most 5 pieces up to 30¢; L2 at most 6 up to 75¢; L3 at most 6 up to $3 with $1 bills and a $5 now and then
- [ ] 🔎 Help me count, 👀 Show me all the money and ↩ work; using help marks the problem "with help"; struggle help runs Help me count automatically
- [ ] Its own Level, Mastery, intro cards and ⭐ work as in 04
- [ ] Vitest covers problem generation within each Level's range and the unlock chain
