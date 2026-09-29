# 10: Pay the Shop

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Game Modes and Levels")

**What to build:** Pay the Shop opens when Count the Cash reaches Level 2. He is asked to buy a shop item and taps coins into a tray; each tap speaks the running total. Help me pay fills the tray for him one coin at a time.

**Blocked by:** 09 (Count the Cash)

**Status:** ready-for-agent

- [ ] The mode plugs into the shared mode interface and opens via the unlock chain; locked hint "Count more cash to open this!"
- [ ] Items: Fuel, Snack, Car Wash, Oil, Juice, Battery ("Buy the {item}!", "It costs {amount}.")
- [ ] Prices: 5–25¢ at L1, 10–60¢ at L2, $1–$3 plus some cents at L3
- [ ] Each coin tap speaks the new running total; ↩ takes one back
- [ ] Checking says "Almost! You need {amount} more." or "Too much! Take back {amount}."; "Tap some money first!" on an empty tray
- [ ] 🔎 Help me pay fills the tray one coin at a time, biggest first, saying the total, and marks the problem "with help"; struggle help runs it automatically
- [ ] Its own Level, Mastery, intro cards and ⭐ work as in 04
- [ ] Vitest covers prices per Level and the Help me pay coin choice
