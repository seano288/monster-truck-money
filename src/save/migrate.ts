// Save migrations are pure: raw JSON in, a current Save out. Anything that isn't a save starts fresh,
// and a save's missing or broken fields fall back to their fresh values.
import { ALL_BUYABLES, ALL_MODS, BODY_IDS, bodyOf, defaultFit, isBodyItem, isLegendary, isStarter, SLOTS, STARTER_BODIES, type BodyId, type Buyable, type Fit, type ModId, type Rung } from '../garage/catalog';
import { MODE_IDS, type Level, type ModeId } from '../modes/ids';
import { backfill, dayOf, STEP_IDS, type Earned } from '../trophies/trophies';

export const SAVE_VERSION = 3;

/** One problem's result in a mode's 10-problem window. */
export type Outcome = 'clean' | 'helped' | 'missed';

export interface ModeSave {
  level: Level;
  /** The last 10 problems, oldest first. */
  window: Outcome[];
  opened: boolean;
  starred: boolean;
  /** The introduction card for the new money still has to be shown before the next Round. */
  introPending: boolean;
  /** Newly opened: the tile pulses and replays "You opened …!" until he taps it. */
  fresh: boolean;
}

export interface Save {
  version: typeof SAVE_VERSION;
  bolts: number;
  /** The Body he's driving: chosen from the starters on first launch (null until then). */
  body: BodyId | null;
  /** The starter Bodies and the ones he bought with Bolts. */
  ownedBodies: BodyId[];
  /** The Mods fitted on each Body. */
  fitted: Record<BodyId, Fit>;
  /** Unlocked Mods, shared across Bodies. */
  unlocked: ModId[];
  /** The locked Mod or Body he chose to save toward; null means the cheapest one. */
  goal: Buyable | null;
  modes: Record<ModeId, ModeSave>;
  lastMode: ModeId;
  /** The trophy steps he has earned, and the day each was earned. */
  trophies: Earned;
  roundsFinished: number;
  /** First-try answers without help in a row, across Rounds. */
  currentStreak: number;
  bestStreak: number;
  /** Different days he finished a Round on. */
  daysPlayed: number;
  /** The last day he finished a Round ("2026-09-30"). */
  lastDay: string | null;
}

const freshMode = (id: ModeId): ModeSave => ({ level: 1, window: [], opened: id === 'learn', starred: false, introPending: false, fresh: false });

const freshFitted = () => Object.fromEntries(BODY_IDS.map(b => [b, defaultFit()])) as Record<BodyId, Fit>;

export const freshSave = (): Save => ({
  version: SAVE_VERSION,
  bolts: 0,
  body: null,
  ownedBodies: [...STARTER_BODIES],
  fitted: freshFitted(),
  unlocked: [],
  goal: null,
  modes: Object.fromEntries(MODE_IDS.map(id => [id, freshMode(id)])) as Record<ModeId, ModeSave>,
  lastMode: 'learn',
  trophies: {},
  roundsFinished: 0,
  currentStreak: 0,
  bestStreak: 0,
  daysPlayed: 0,
  lastDay: null,
});

type Raw = Record<string, unknown>;
// MIGRATIONS[n] turns a version-n save into a version-(n+1) save
const MIGRATIONS: Record<number, (old: Raw) => Raw> = {
  // Bodies can be bought: the 3 starters count as owned
  1: old => ({ ...old, version: 2, ownedBodies: [...STARTER_BODIES] }),
  // Trophies: the ones the Levels and stars already prove are backfilled once the modes are read, below
  2: old => ({ ...old, version: 3 }),
};

const isRecord = (x: unknown): x is Raw => typeof x === 'object' && x !== null && !Array.isArray(x);
const count = (x: unknown) => (typeof x === 'number' && Number.isInteger(x) && x >= 0 ? x : 0);
const bool = (x: unknown, fallback: boolean) => (typeof x === 'boolean' ? x : fallback);
const oneOf = <T extends string, F>(xs: readonly T[], x: unknown, fallback: F): T | F => (xs.includes(x as T) ? (x as T) : fallback);

function readFit(raw: unknown, unlocked: readonly ModId[]): Fit {
  const f = defaultFit();
  if (!isRecord(raw)) return f;
  for (const { id } of SLOTS) {
    const r = raw[id];
    if (r === 0 || ((r === 1 || r === 2 || r === 3 || r === 4) && unlocked.includes(`${id}:${r}`))) f[id] = r as Rung;
  }
  return f;
}

function readTrophies(raw: unknown): Earned {
  if (!isRecord(raw)) return {};
  return Object.fromEntries(STEP_IDS.filter(id => typeof raw[id] === 'string').map(id => [id, raw[id]]));
}

function readMode(id: ModeId, raw: unknown): ModeSave {
  const f = freshMode(id);
  if (!isRecord(raw)) return f;
  const outcomes = ['clean', 'helped', 'missed'] as const;
  return {
    level: ([1, 2, 3] as const).find(l => l === raw.level) ?? f.level,
    window: Array.isArray(raw.window) ? raw.window.filter((o): o is Outcome => outcomes.includes(o as Outcome)).slice(-10) : f.window,
    opened: bool(raw.opened, f.opened),
    starred: bool(raw.starred, f.starred),
    introPending: bool(raw.introPending, f.introPending),
    fresh: bool(raw.fresh, f.fresh),
  };
}

/** `today` dates the trophies an older save is backfilled with. */
export function migrate(raw: unknown, today = dayOf(new Date())): Save {
  if (!isRecord(raw) || typeof raw.version !== 'number') return freshSave();
  let data = raw;
  for (let v = raw.version; v < SAVE_VERSION; v++) {
    const step = MIGRATIONS[v];
    if (!step) return freshSave();
    data = step(data);
  }
  const modes = isRecord(data.modes) ? data.modes : {};
  const unlocked = Array.isArray(data.unlocked) ? [...new Set(data.unlocked.filter((m): m is ModId => ALL_MODS.includes(m as ModId)))] : [];
  const fitted = isRecord(data.fitted) ? data.fitted : {};
  const bought = Array.isArray(data.ownedBodies) ? data.ownedBodies.filter((b): b is BodyId => BODY_IDS.includes(b as BodyId)) : [];
  const ownedBodies = BODY_IDS.filter(b => isStarter(b) || bought.includes(b));
  const body = oneOf(BODY_IDS, data.body, null);
  const goal = oneOf(ALL_BUYABLES, data.goal, null);
  const modeSaves = Object.fromEntries(MODE_IDS.map(id => [id, readMode(id, modes[id])])) as Record<ModeId, ModeSave>;
  const trophies = raw.version < 3 ? { ...backfill(modeSaves, today), ...readTrophies(data.trophies) } : readTrophies(data.trophies);
  const goalLocked = goal && (isBodyItem(goal) ? !ownedBodies.includes(bodyOf(goal)) : !unlocked.includes(goal) && !isLegendary(goal));
  return {
    version: SAVE_VERSION,
    bolts: count(data.bolts),
    body: body && !ownedBodies.includes(body) ? 'pickup' : body,
    ownedBodies,
    fitted: Object.fromEntries(BODY_IDS.map(b => [b, readFit(fitted[b], unlocked)])) as Record<BodyId, Fit>,
    unlocked,
    goal: goalLocked ? goal : null,
    modes: modeSaves,
    lastMode: oneOf(MODE_IDS, data.lastMode, 'learn'),
    trophies,
    roundsFinished: count(data.roundsFinished),
    currentStreak: count(data.currentStreak),
    bestStreak: count(data.bestStreak),
    daysPlayed: count(data.daysPlayed),
    lastDay: typeof data.lastDay === 'string' ? data.lastDay : null,
  };
}
