// The Round: 5 correct answers in one Game Mode, then 3 Bolts.
import { signal } from '@preact/signals';
import { sBad, sGood } from '../audio/sfx';
import { screen } from '../app/nav';
import { game, update } from '../game/store';
import { pick } from '../game/rng';
import type { Level, ModeId } from '../modes/ids';
import { modeById } from '../modes/modes';
import { toast } from '../ui/toast';
import { CHEERS } from '../voice/phrases';
import { hush } from '../voice/say';

export const ROUND_LENGTH = 5;
export const BOLTS_PER_ROUND = 3;

export interface Round {
  mode: ModeId;
  level: Level;
  stars: number;
  problem: unknown;
  /** Changes with every new problem, so the mode's screen starts fresh. */
  key: number;
  firstTry: boolean;
  helped: boolean;
  busy: boolean;
  ended: boolean;
}

export const round = signal<Round | null>(null);

let token = 0; // bumped when a Round starts or is left, so its timers stop touching it
const later = (ms: number, fn: () => void) => { const t = token; setTimeout(() => t === token && fn(), ms); };
const set = (patch: Partial<Round>) => { if (round.value) round.value = { ...round.value, ...patch }; };

export function startRound(mode: ModeId) {
  token++;
  hush();
  const level = game.value.modes[mode].level;
  update(s => ({ ...s, lastMode: mode }));
  round.value = { mode, level, stars: 0, problem: modeById(mode).makeProblem(level, Math.random), key: 0, firstTry: true, helped: false, busy: false, ended: false };
  screen.value = 'round';
}

export function leaveRound() {
  token++;
  hush();
  round.value = null;
}

function nextProblem() {
  const r = round.value!;
  set({ problem: modeById(r.mode).makeProblem(r.level, Math.random), key: r.key + 1, firstTry: true, helped: false, busy: false });
}

export function correct() {
  const r = round.value;
  if (!r || r.busy) return;
  const stars = r.stars + 1;
  set({ stars, busy: true });
  sGood();
  if (stars >= ROUND_LENGTH) return later(900, endRound);
  if (r.firstTry && !r.helped) { const c = pick(Math.random, CHEERS); void toast(c, c); }
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
  update(s => ({ ...s, bolts: s.bolts + BOLTS_PER_ROUND }));
  set({ ended: true });
}
