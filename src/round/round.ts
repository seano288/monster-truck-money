// The Round: 5 correct answers in one Game Mode, then 3 Bolts. Each problem's result feeds the mode's
// Mastery window, and any Level up, opened mode or star is celebrated at the end.
import { signal } from '@preact/signals';
import { sBad, sGood } from '../audio/sfx';
import { screen } from '../app/nav';
import { pick } from '../game/rng';
import { game, update } from '../game/store';
import { affordableCount } from '../garage/garage';
import { opensWith } from '../modes/chain';
import type { Level, ModeId } from '../modes/ids';
import { modeById, MODES } from '../modes/modes';
import { recordOutcome, struggling } from '../modes/progress';
import type { Outcome } from '../save/migrate';
import { toast } from '../ui/toast';
import { CHEERS } from '../voice/phrases';
import { hush } from '../voice/say';

export const ROUND_LENGTH = 5;
export const BOLTS_PER_ROUND = 3;

export type RoundEvent = { kind: 'levelUp'; mode: ModeId; level: 2 | 3 } | { kind: 'open'; mode: ModeId } | { kind: 'star'; mode: ModeId };

export interface Round {
  mode: ModeId;
  level: Level;
  /** The introduction card for the mode's new money comes before the first problem. */
  intro: boolean;
  stars: number;
  problem: unknown;
  /** Changes with every new problem, so the mode's screen starts fresh. */
  key: number;
  firstTry: boolean;
  helped: boolean;
  busy: boolean;
  events: RoundEvent[];
  ended: boolean;
  /** The Bolts from this Round made a new Mod affordable. */
  canBuild: boolean;
}

export const round = signal<Round | null>(null);

let token = 0; // bumped when a Round starts or is left, so its timers stop touching it
const later = (ms: number, fn: () => void) => { const t = token; setTimeout(() => t === token && fn(), ms); };
const set = (patch: Partial<Round>) => { if (round.value) round.value = { ...round.value, ...patch }; };

export function startRound(mode: ModeId) {
  token++;
  hush();
  const m = game.value.modes[mode];
  update(s => ({ ...s, lastMode: mode }));
  round.value = {
    mode, level: m.level, intro: m.introPending, stars: 0, problem: modeById(mode).makeProblem(m.level, Math.random),
    key: 0, firstTry: true, helped: false, busy: false, events: [], ended: false, canBuild: false,
  };
  screen.value = 'round';
}

/** He's seen the introduction card: on to the first problem. */
export function introDone() {
  const r = round.value;
  if (!r) return;
  update(s => ({ ...s, modes: { ...s.modes, [r.mode]: { ...s.modes[r.mode], introPending: false } } }));
  set({ intro: false });
}

export function leaveRound() {
  token++;
  hush();
  round.value = null;
}

export const isStruggling = (mode: ModeId) => struggling(game.value.modes[mode]);

function nextProblem() {
  const r = round.value!;
  set({ problem: modeById(r.mode).makeProblem(r.level, Math.random), key: r.key + 1, firstTry: true, helped: false, busy: false });
}

function record(r: Round, outcome: Outcome): RoundEvent[] {
  const { mode, event } = recordOutcome(game.value.modes[r.mode], outcome);
  const events: RoundEvent[] = [];
  const opened = event === 'levelUp' ? opensWith(MODES, r.mode, mode.level) : [];
  if (event === 'levelUp') events.push({ kind: 'levelUp', mode: r.mode, level: mode.level as 2 | 3 });
  if (event === 'star') events.push({ kind: 'star', mode: r.mode });
  for (const o of opened) events.push({ kind: 'open', mode: o });
  update(s => {
    const modes = { ...s.modes, [r.mode]: mode };
    for (const o of opened) modes[o] = { ...modes[o], opened: true, fresh: true };
    return { ...s, modes };
  });
  return events;
}

export function correct() {
  const r = round.value;
  if (!r || r.busy) return;
  const clean = r.firstTry && !r.helped;
  const events = [...r.events, ...record(r, !r.firstTry ? 'missed' : r.helped ? 'helped' : 'clean')];
  const stars = r.stars + 1;
  set({ stars, busy: true, events });
  sGood();
  if (stars >= ROUND_LENGTH) return later(900, endRound);
  if (clean) { const c = pick(Math.random, CHEERS); void toast(c, c); }
  later(1500, nextProblem);
}

export function miss() {
  set({ firstTry: false });
  sBad();
}

export function helped() {
  set({ helped: true });
}

function endRound() {
  const before = affordableCount();
  update(s => ({ ...s, bolts: s.bolts + BOLTS_PER_ROUND }));
  set({ ended: true, canBuild: affordableCount() > before });
}
