// The Bolt economy. Mod prices live in one table, and unlocking goes only through unlock(), which spends Bolts
// (a later "pay with cash" flow can reuse it). Level and Game Mode never lock a Mod.
import { ALL_MODS, parseMod, type ModId } from './catalog';

export const PRICES = { 1: 3, 2: 9, 3: 18 } as const;

export interface Wallet { bolts: number; unlocked: readonly ModId[]; goal: ModId | null }

export const priceOf = (mod: ModId) => PRICES[parseMod(mod).rung];
const isLocked = (w: Wallet, mod: ModId) => !w.unlocked.includes(mod);

/** Spend the Bolts and unlock the Mod. Final: no refunds. */
export function unlock<W extends Wallet>(w: W, mod: ModId): W {
  if (!isLocked(w, mod)) throw new Error(`${mod} is already unlocked`);
  if (w.bolts < priceOf(mod)) throw new Error(`${mod} costs ${priceOf(mod)} Bolts`);
  return { ...w, bolts: w.bolts - priceOf(mod), unlocked: [...w.unlocked, mod], goal: w.goal === mod ? null : w.goal };
}

/** The Mod he's saving toward: the one he chose while it's locked, otherwise the cheapest locked Mod. */
export function goalOf(w: Wallet): ModId | null {
  if (w.goal && isLocked(w, w.goal)) return w.goal;
  let best: ModId | null = null;
  for (const m of ALL_MODS) if (isLocked(w, m) && (!best || priceOf(m) < priceOf(best))) best = m;
  return best;
}

export const affordable = (w: Wallet) => ALL_MODS.filter(m => isLocked(w, m) && priceOf(m) <= w.bolts);
export const boltsNeeded = (w: Wallet, mod: ModId) => Math.max(0, priceOf(mod) - w.bolts);
export const builtEverything = (w: Wallet) => ALL_MODS.every(m => !isLocked(w, m));
