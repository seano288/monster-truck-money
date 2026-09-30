// Count the Cash: a pile of money, sorted biggest first; how much is it?
import { int, pick, shuffle, type Rng } from '../../game/rng';
import { biggestFirst, total, type MoneyKey } from '../../money/money';
import type { Level } from '../ids';

export interface CountRule {
  money: readonly MoneyKey[];
  maxPieces: number;
  /** Most the pile adds up to (a $5 bill at Level 3 goes over it). */
  cap: number;
  /** How far the wrong choices are from the right one. */
  deltas: readonly number[];
}

export const COUNT_LEVELS: Record<Level, CountRule> = {
  1: { money: ['d', 'n', 'p'], maxPieces: 5, cap: 30, deltas: [1, 5, 10] },
  2: { money: ['q', 'd', 'n', 'p'], maxPieces: 6, cap: 75, deltas: [1, 5, 10, 25] },
  3: { money: ['b1', 'q', 'd', 'n', 'p'], maxPieces: 6, cap: 300, deltas: [5, 10, 25, 100] },
};
const FIVE_CHANCE = 0.15; // a $5 bill now and then at Level 3

export interface CountProblem { pile: MoneyKey[]; total: number; choices: number[] }

export function makeCount(level: Level, rng: Rng): CountProblem {
  const rule = COUNT_LEVELS[level];
  for (;;) {
    const pile = Array.from({ length: int(rng, 2, rule.maxPieces) }, () => pick(rng, rule.money));
    if (level === 3) {
      if (!pile.some(k => k === 'b1')) pile[0] = 'b1';
      if (rng() < FIVE_CHANCE) pile[0] = 'b5';
    }
    const sum = total(pile);
    if (sum > rule.cap + (pile.includes('b5') ? 500 : 0)) continue;
    pile.sort(biggestFirst);
    const choices = new Set([sum]);
    while (choices.size < 4) {
      const c = sum + pick(rng, rule.deltas) * pick(rng, [-1, 1]);
      if (c > 0 && c < 1000) choices.add(c);
    }
    return { pile, total: sum, choices: shuffle(rng, [...choices]) };
  }
}

/** The same pile again with its choices in a new order. */
export const replayCount = (p: CountProblem, rng: Rng): CountProblem => ({ ...p, choices: shuffle(rng, p.choices) });

export const checkCount = (p: CountProblem, answer: number) => answer === p.total;
