// Pay the Shop: buy a shop item by tapping money into a tray until it adds up to the price.
import { int, pick, type Rng } from '../../game/rng';
import { LEVEL_MONEY, MONEY, total, type MoneyKey } from '../../money/money';
import type { Level } from '../ids';

/** Shop items that aren't Mods. */
export const SHOP_ITEMS = [
  { name: 'Fuel', icon: '⛽' }, { name: 'Snack', icon: '🍿' }, { name: 'Car Wash', icon: '🧽' },
  { name: 'Oil', icon: '🛢️' }, { name: 'Juice', icon: '🧃' }, { name: 'Battery', icon: '🔋' },
] as const;
export type ShopItem = (typeof SHOP_ITEMS)[number];

export interface PayProblem { item: ShopItem; price: number; bank: readonly MoneyKey[] }

const L3_CENTS = [5, 10, 15, 25, 30, 50, 75];

export function makePrice(level: Level, rng: Rng) {
  if (level === 1) return int(rng, 5, 25);
  if (level === 2) return int(rng, 10, 60);
  return int(rng, 1, 3) * 100 + pick(rng, L3_CENTS);
}

export function makePay(level: Level, rng: Rng): PayProblem {
  return { item: pick(rng, SHOP_ITEMS), price: makePrice(level, rng), bank: LEVEL_MONEY[level].filter(k => k !== 'b5') };
}

/** The money Help me pay puts in the tray: biggest first, one at a time. */
export function helpPayCoins(price: number, bank: readonly MoneyKey[]): MoneyKey[] {
  const out: MoneyKey[] = [];
  let left = price;
  for (const k of bank) while (MONEY[k].cents <= left) { out.push(k); left -= MONEY[k].cents; }
  return out;
}

export type PayCheck = { kind: 'paid' } | { kind: 'empty' } | { kind: 'short' | 'over'; by: number };

export function checkPay(p: Pick<PayProblem, 'price'>, tray: readonly MoneyKey[]): PayCheck {
  const paid = total(tray);
  if (!tray.length) return { kind: 'empty' };
  if (paid === p.price) return { kind: 'paid' };
  return paid < p.price ? { kind: 'short', by: p.price - paid } : { kind: 'over', by: paid - p.price };
}
