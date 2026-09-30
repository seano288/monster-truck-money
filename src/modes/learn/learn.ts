// Learn the Coins: names, values, and which is worth more or less, using the money of the Level.
import { pick, shuffle, type Rng } from '../../game/rng';
import { LEVEL_MONEY, MONEY, type MoneyKey } from '../../money/money';
import type { Level } from '../ids';

export type LearnProblem =
  | { kind: 'find'; target: MoneyKey; options: MoneyKey[] } // tap the named coin among up to 4
  | { kind: 'name' | 'value'; target: MoneyKey; choices: MoneyKey[] } // one coin shown, pick its name or value
  | { kind: 'more' | 'less'; target: MoneyKey; options: MoneyKey[] }; // two coins, tap the one worth more or less

export function makeLearn(level: Level, rng: Rng): LearnProblem {
  const pool = LEVEL_MONEY[level];
  const target = pick(rng, pool);
  const withOthers = (t: MoneyKey) => shuffle(rng, [t, ...shuffle(rng, pool.filter(k => k !== t)).slice(0, 3)]);
  const kind = pick(rng, ['find', 'find', 'name', 'value', 'compare'] as const);
  if (kind === 'find') return { kind, target, options: withOthers(target) };
  if (kind !== 'compare') return { kind, target, choices: withOthers(target) };
  const [a, b] = shuffle(rng, pool) as [MoneyKey, MoneyKey];
  const more = rng() < 0.6;
  return { kind: more ? 'more' : 'less', target: MONEY[a].cents > MONEY[b].cents === more ? a : b, options: [a, b] };
}

/** The same question again with its coins or answers in a new order. */
export const replayLearn = (p: LearnProblem, rng: Rng): LearnProblem =>
  'choices' in p ? { ...p, choices: shuffle(rng, p.choices) } : { ...p, options: shuffle(rng, p.options) };

export const checkLearn = (p: LearnProblem, answer: MoneyKey) => answer === p.target;

/** The penny or nickel mixed up with the dime: say that the small dime is worth more. */
export const dimeTip = (a: MoneyKey, b: MoneyKey) => (a === 'd' && (b === 'p' || b === 'n')) || (b === 'd' && (a === 'p' || a === 'n'));
