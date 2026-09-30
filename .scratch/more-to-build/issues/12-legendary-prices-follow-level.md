# 12: Legendary prices follow his Level

**What to build:** cash prices that grow with his Pay the Shop Level, so the money checkout stays good practice as he improves. Legendaries in new Slots (04, 07-10) are priced the same way.

**Blocked by:** none (04 and 07-10 pick this up if it lands first)

**Status:** ready-for-human

## Open questions (decide before building)

1. **Fixed or by Level?** Today's `CASH_PRICES` are fixed ($1.35-$4.80). Default: each Legendary gets a price per Pay the Shop Level, using only the money that Level has (Level 1: pennies, nickels and dimes, under $1; Level 2: adds quarters, up to about $3; Level 3: bills, up to about $9). The price is set when the checkout opens.
2. **Should a Legendary need Level 3?** Default: no. Any Level can buy it; only the price changes.
3. **Something he can buy with money again and again?** Something that never runs out, like a "Car Wash" that makes the Truck sparkle for his next Show Off, or fireworks for the next Show Off, priced at his Level. The default is **not now**. If he wants it, it gets its own ticket, and it must not turn into grinding.

## Tasks

- [x] `CASH_PRICES` in `src/garage/economy.ts` becomes a price per Slot per Level, and `priceOf` takes his Pay the Shop Level. Every price is exactly payable with that Level's money
- [x] The checkout (`src/garage/Checkout.tsx`) uses his Level's bank, as Pay the Shop does
- [x] Legendary tiles and the Goal bar show the price at his current Level
- [x] `nextLegendary` picks the cheapest one at his Level
- [x] Voice: the price lines in `phrases.ts` cover the new amounts (check `tools/voice-check.ts`)
- [x] Vitest: every price payable with its Level's bank, `priceOf` by Level, exact-payment unlock at each Level
- [ ] Checked on the iPad

## Comments

Built with the defaults for all three open questions: a price per Legendary per Pay the Shop Level (Level 1 35¢-95¢, Level 2 $1.10-$2.90, Level 3 $3.35-$8.80), no Level needed to buy one, and nothing that can be bought again and again. The checkout sets the price and money from his Level when it opens, and the cash payment carries that Level to `unlock()`. The voice already has clips for every amount up to $9.99. Still to do: check it on the iPad.
