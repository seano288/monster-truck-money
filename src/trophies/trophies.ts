// Trophies: earned by playing well, never bought and never lost. Each one is a pure check over the save (and the
// Round just finished), so new ones can be added any time without touching the Garage economy. A counting trophy
// takes one spot on the shelf and upgrades in place, bronze to silver to gold and on, one step at a time.
import { MODE_IDS, type ModeId } from '../modes/ids';
import type { ModeSave, Outcome, Save } from '../save/migrate';

export const STREAKS = [5, 10, 20] as const;
export const ROUND_COUNTS = [10, 25, 50, 100, 250] as const;
export const DAYS = 5;
export type StreakN = (typeof STREAKS)[number];
export type RoundsN = (typeof ROUND_COUNTS)[number];

export type TrophyStep =
  | { kind: 'level'; mode: ModeId; level: 2 | 3 }
  | { kind: 'star'; mode: ModeId }
  | { kind: 'streak'; n: StreakN }
  | { kind: 'perfect' }
  | { kind: 'rounds'; n: RoundsN }
  | { kind: 'days'; n: typeof DAYS };

export type StepId = `${ModeId}:${2 | 3 | 'star'}` | `streak:${StreakN}` | 'perfect' | `rounds:${RoundsN}` | `days:${typeof DAYS}`;

/** Earned steps and the day each was earned ("2026-09-30"). */
export type Earned = Partial<Record<StepId, string>>;

export interface Trophy {
  id: string;
  kind: 'learning' | 'skill' | 'sticking';
  /** One step, or one per metal for a counting trophy. */
  steps: readonly TrophyStep[];
}

export const TROPHIES: readonly Trophy[] = [
  ...MODE_IDS.flatMap((mode): Trophy[] => [
    { id: `${mode}:2`, kind: 'learning', steps: [{ kind: 'level', mode, level: 2 }] },
    { id: `${mode}:3`, kind: 'learning', steps: [{ kind: 'level', mode, level: 3 }] },
    { id: `${mode}:star`, kind: 'learning', steps: [{ kind: 'star', mode }] },
  ]),
  { id: 'streak', kind: 'skill', steps: STREAKS.map(n => ({ kind: 'streak', n })) },
  { id: 'perfect', kind: 'skill', steps: [{ kind: 'perfect' }] },
  { id: 'rounds', kind: 'sticking', steps: ROUND_COUNTS.map(n => ({ kind: 'rounds', n })) },
  { id: 'days', kind: 'sticking', steps: [{ kind: 'days', n: DAYS }] },
];

export function stepId(s: TrophyStep): StepId {
  switch (s.kind) {
    case 'level': return `${s.mode}:${s.level}`;
    case 'star': return `${s.mode}:star`;
    case 'perfect': return 'perfect';
    default: return `${s.kind}:${s.n}` as StepId;
  }
}

export const STEP_IDS: readonly StepId[] = TROPHIES.flatMap(t => t.steps.map(stepId));

/** The trophy this step belongs to, and how many of its steps it makes (1 for the first). */
export function trophyOf(s: TrophyStep): { trophy: Trophy; earned: number } {
  const id = stepId(s), trophy = TROPHIES.find(t => t.steps.some(x => stepId(x) === id))!;
  return { trophy, earned: trophy.steps.findIndex(x => stepId(x) === id) + 1 };
}

/** What the checks read from the save. */
type Progress = Pick<Save, 'modes' | 'bestStreak' | 'roundsFinished' | 'daysPlayed'>;

/** Has he done what this step asks? `round` is the Round just finished, if any. */
export function reached(s: TrophyStep, save: Progress, round: readonly Outcome[] | null): boolean {
  switch (s.kind) {
    case 'level': return save.modes[s.mode].level >= s.level;
    case 'star': return save.modes[s.mode].starred;
    case 'streak': return save.bestStreak >= s.n;
    case 'perfect': return !!round?.length && round.every(o => o === 'clean');
    case 'rounds': return save.roundsFinished >= s.n;
    case 'days': return save.daysPlayed >= s.n;
  }
}

/** How many of this trophy's steps he has earned. */
export const earnedCount = (t: Trophy, save: Save) => t.steps.filter(s => save.trophies[stepId(s)]).length;

/** An answered problem: a first-try answer without help adds to the streak, anything else breaks it. */
export function countAnswer(save: Save, outcome: Outcome): Save {
  const currentStreak = outcome === 'clean' ? save.currentStreak + 1 : 0;
  return { ...save, currentStreak, bestStreak: Math.max(save.bestStreak, currentStreak) };
}

/** The end of a Round: count it and the day, then earn every trophy step newly reached. */
export function finishRound(save: Save, round: readonly Outcome[], day: string): { save: Save; earned: TrophyStep[] } {
  const counted = { ...save, roundsFinished: save.roundsFinished + 1, daysPlayed: save.daysPlayed + (save.lastDay === day ? 0 : 1), lastDay: day };
  const earned = TROPHIES.flatMap(t => t.steps).filter(s => !save.trophies[stepId(s)] && reached(s, counted, round));
  return { save: { ...counted, trophies: { ...save.trophies, ...Object.fromEntries(earned.map(s => [stepId(s), day])) } }, earned };
}

/** The Learning trophies an older save already proves: the Levels and stars it reached. */
export function backfill(modes: Record<ModeId, ModeSave>, day: string): Earned {
  const progress = { modes, bestStreak: 0, roundsFinished: 0, daysPlayed: 0 };
  const steps = TROPHIES.filter(t => t.kind === 'learning').flatMap(t => t.steps).filter(s => reached(s, progress, null));
  return Object.fromEntries(steps.map(s => [stepId(s), day]));
}

/** The local calendar day, as "2026-09-30". */
export const dayOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
