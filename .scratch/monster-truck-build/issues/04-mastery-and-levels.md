# 04: Mastery and Levels

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Game Modes and Levels")

**What to build:** Learn the Coins raises its own Level when he shows Mastery. A Level up plays "Level up!" and the new-money line, and the next Round opens with the introduction card for the new money. Struggle help steps in when he misses a lot. The mode logic sits behind one shared mode interface so the other two modes plug in.

**Blocked by:** 03 (First playable: a Learn the Coins Round)

**Status:** ready-for-agent

- [ ] A shared mode interface: make a problem, check an answer, its Level table, its intro money and its phrases; Home tiles are built from the list of modes
- [ ] Mastery: 8 of the last 10 right on the first try without help; the window is saved across sessions and clears on Level up
- [ ] Levels start at 1, never go down, top out at 3: Level 2 adds quarters, Level 3 adds $1 and $5 bills
- [ ] Level up plays "Level up!" then "Now you get quarters!" or "Now you get dollar bills!" in the end-of-Round overlay
- [ ] The introduction card ("Look! New money! This is a {money}. It is worth {value}.") comes before the next Round in that mode, and a pending card survives an app restart
- [ ] Mastery at Level 3 shows the ⭐ on the tile and plays "You are a Learn the Coins star!"
- [ ] Struggle help: after 5 misses in the last 10, help is offered after a single miss; problems solved with help don't count toward Mastery
- [ ] Level dots on the tile show the Level
- [ ] Vitest covers the window, Level up, never-lower, ⭐ and struggle rules
