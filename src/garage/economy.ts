// The Garage economy. Bolt prices (Mods on Rungs 1-3 and the new Bodies) live in one table and Legendary cash
// prices in another. Buying goes only through unlock(): Bolts for everything except a Legendary, which takes
// an exact payment in money. Level and Game Mode never lock anything.
import { ALL_BUYABLES, bodyOf, isBodyItem, LEGENDARY, modId, parseMod, SLOTS, TOP, type BodyId, type Buyable, type ModId, type SlotId } from './catalog';

export const PRICES = {
  rungs: { 1: 5, 2: 15, 3: 30 },
  bodies: { firetruck: 50, schoolbus: 75, jeep: 100, towtruck: 125, dumptruck: 150, police: 175, icecream: 200, tractor: 250, racecar: 300 },
} as const;
/** Legendary Mods, in cents: $1.35 to $4.80, using everything up to the $5 bill. */
export const CASH_PRICES = { tires: 135, paint: 210, decals: 275, lights: 360, engine: 395, horn: 480 } as const satisfies Record<SlotId, number>;

export type Price = { bolts: number; cents?: never } | { cents: number; bolts?: never };

export function priceOf(x: Buyable): Price {
  if (isBodyItem(x)) return { bolts: PRICES.bodies[bodyOf(x)] };
  const { slot, rung } = parseMod(x);
  return rung === LEGENDARY ? { cents: CASH_PRICES[slot] } : { bolts: PRICES.rungs[rung] };
}

export interface Wallet { bolts: number; unlocked: readonly ModId[]; ownedBodies: readonly BodyId[]; goal: Buyable | null }

/** How he pays: Bolts, or money tapped into the Pay the Shop tray (its total, in cents). */
export type Payment = { kind: 'bolts' } | { kind: 'cash'; cents: number };

export const isLocked = (w: Wallet, x: Buyable) => (isBodyItem(x) ? !w.ownedBodies.includes(bodyOf(x)) : !w.unlocked.includes(x));

/** The top-Rung Mod a Legendary is waiting on: it opens for purchase only once that one is unlocked. */
export function waitingOn(w: Wallet, mod: ModId): ModId | null {
  const { slot, rung } = parseMod(mod), top = modId(slot, TOP);
  return rung === LEGENDARY && isLocked(w, top) ? top : null;
}

/** Pay for it and unlock it. Final: no refunds. */
export function unlock<W extends Wallet>(w: W, x: Buyable, pay: Payment): W {
  if (!isLocked(w, x)) throw new Error(`${x} is already unlocked`);
  const price = priceOf(x);
  if (price.cents !== undefined) {
    if (!isBodyItem(x) && waitingOn(w, x)) throw new Error(`${x} waits on ${waitingOn(w, x)}`);
    if (pay.kind !== 'cash' || pay.cents !== price.cents) throw new Error(`${x} costs exactly ${price.cents}¢`);
  } else {
    if (pay.kind !== 'bolts') throw new Error(`${x} costs Bolts`);
    if (w.bolts < price.bolts) throw new Error(`${x} costs ${price.bolts} Bolts`);
  }
  const bolts = w.bolts - (price.bolts ?? 0), goal = w.goal === x ? null : w.goal;
  return isBodyItem(x)
    ? { ...w, bolts, ownedBodies: [...w.ownedBodies, bodyOf(x)], goal }
    : { ...w, bolts, unlocked: [...w.unlocked, x], goal };
}

/** Locked things bought with Bolts: every Mod but the Legendaries, and every Body he doesn't own. */
const forBolts = (x: Buyable) => priceOf(x).bolts !== undefined;
const lockedForBolts = (w: Wallet) => ALL_BUYABLES.filter(x => isLocked(w, x) && forBolts(x));

/** What he's saving Bolts toward: the one he chose while it's locked, otherwise the cheapest locked Mod or Body. */
export function goalOf(w: Wallet): Buyable | null {
  if (w.goal && isLocked(w, w.goal) && forBolts(w.goal)) return w.goal;
  let best: Buyable | null = null;
  for (const x of lockedForBolts(w)) if (!best || priceOf(x).bolts! < priceOf(best).bolts!) best = x;
  return best;
}

export const affordable = (w: Wallet) => lockedForBolts(w).filter(x => priceOf(x).bolts! <= w.bolts);
export const boltsNeeded = (w: Wallet, x: Buyable) => Math.max(0, (priceOf(x).bolts ?? 0) - w.bolts);
export const builtEverything = (w: Wallet) => ALL_BUYABLES.every(x => !isLocked(w, x));

/** The cheapest Legendary still to buy, for once everything bought with Bolts is his. */
export function nextLegendary(w: Wallet): SlotId | null {
  const left = SLOTS.map(s => s.id).filter(id => isLocked(w, modId(id, LEGENDARY)));
  return left.length ? left.reduce((a, b) => (CASH_PRICES[b] < CASH_PRICES[a] ? b : a)) : null;
}
