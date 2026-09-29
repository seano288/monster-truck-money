# How Game Modes and Levels progress automatically

Type: grilling
Status: resolved
Map: [Monster Truck Garage](../map.md)

## Question

Now that all three Game Modes are back and the game raises the Level automatically (with no parent override), how does progress work?

- Are Count the Cash and Pay the Garage open from the start, or unlocked as he masters Learn the Coins?
- Does each Game Mode have its own Level, or is there one Level overall?
- What counts as "mastery" for going up a Level (for example, N correct in a row, or accuracy over the last M problems)? Can he go back down a Level?
- Do Count the Cash and Pay the Garage need changes to suit a 6-year-old who can't count money well yet? Consider the existing help features ("Help me count", "Show me all the money") and the ranges in `LEVELS`.
- Who picks the Game Mode for each Round: him, or the game?

## Answer

Resolved by grilling (all recommendations accepted). Glossary updated: **Pay the Shop** replaces "Pay the Garage"; **Level** is per Game Mode and never goes down; new term **Mastery**.

- **Rename**: Pay the Garage becomes **Pay the Shop**, so "Garage" only means the place where Bolts are spent. Its items are shop things that aren't Mods (fuel, snacks, car wash and so on); Race Ticket is dropped.
- **Unlocking Game Modes**: a chain. Learn the Coins is open from the start. Count the Cash opens when Learn the Coins reaches Level 2, and Pay the Shop opens when Count the Cash reaches Level 2. A locked mode shows a padlock, and tapping it plays a voice hint ("Learn more coins to open this!").
- **Choosing**: he picks any open Game Mode from big icon tiles. Every mode earns the same 3 Bolts per Round.
- **Levels**: each Game Mode has its own Level, starting at 1 and saved with his progress.
- **Mastery**: 8 of the last 10 problems in that mode right on the first try without help. Answers he gets right with help still count toward the 5 that finish a Round. The 10-problem window is saved across sessions and clears when the Level goes up. Level 3 is the top; a mastered mode's tile gets a ⭐ badge.
- **No going down**: the Level never drops. If he's struggling (5 of the last 10 missed), help is offered after a single miss instead (for example, Help me count runs automatically).
- **Count the Cash ranges** (piles sorted biggest-first):
  - Level 1: at most 5 pieces, up to 30¢
  - Level 2: at most 6 pieces, up to 75¢
  - Level 3: at most 6 pieces, up to $3, using $1 bills with a $5 bill now and then
  - No hidden difficulty ramp inside a Level unless playtesting shows the jumps are too steep.
- **Pay the Shop**: prices are 5–25¢ at Level 1, 10–60¢ at Level 2, and $1–$3 plus some cents at Level 3. Each tap on a coin speaks the new running total. A new 🔎 **Help me pay** button fills the tray one coin at a time, biggest first, saying the total as it goes; using it marks the problem as "with help".
- **Voice**: Count the Cash and Pay the Shop speak their prompt and read each choice aloud with its button lit, the same as Learn the Coins. How the clips are made is still fog ("Voice for new content").
- **Level-up and mode opening**: at the end of the Round that earned it, the voice says "Level up! Now you get quarters!" The next Round in that mode starts with an introduction card showing the new money, big and tappable, with its name and value spoken. When a mode opens, its tile loses the padlock and the voice says "You opened Count the Cash!" The animation and sound are left to the "Sound and celebration" fog.
