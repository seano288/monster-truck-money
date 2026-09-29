// Unlocking a Mod makes the 3D Truck jump, bigger for higher Rungs: a hop with sparks, a crouch and a 360° spin
// jump, or (top Rung) "Wow!", a big double-spin jump, fireworks and a shake, then "That's the best one!".
// A Legendary gets the big jump with more fireworks and confetti. A Horn Mod plays its horn on landing.
// Buying a Body gets the biggest show of all. Ported from the "Celebrations" prototype (variant C).
import { HORNS, sBigFanfare, sCheer, sBoing, sChime, sEngine, sFanfare, sThud, sWhoosh } from '../audio/sfx';
import type { BuyRung, SlotId } from '../garage/catalog';
import { MOVES, type GarageStage, type Move } from '../garage/three/stage';
import type { Phrase } from '../voice/phrases';
import { say, sayMore } from '../voice/say';
import { confetti, firework, shake, sparks } from './effects';

const KIND: Record<BuyRung, Move> = { 1: 'hop', 2: 'jump', 3: 'mega', 4: 'mega' };

/** Plays the unlock moment and returns how long taps are blocked for (the length of the jump). */
export function celebrateUnlock(stage: GarageStage, stageEl: HTMLElement, slot: SlotId, rung: BuyRung, got: Phrase): number {
  const kind = KIND[rung], ms = MOVES[kind].dur;
  const burst = () => { const r = stageEl.getBoundingClientRect(); sparks(stage.truckPoint(), { w: r.width, h: r.height }); };
  stage.play(kind);
  if (slot === 'horn') setTimeout(() => HORNS[rung]!(), ms); // on landing
  if (rung === 1) {
    sBoing(); sChime(); burst();
    void say(got);
    return ms;
  }
  if (rung >= 3) void say('Wow!');
  sEngine(rung >= 3 ? 1.1 : 0.6);
  setTimeout(() => sWhoosh(0.6), 250);
  setTimeout(() => {
    burst();
    if (rung === 2) { sFanfare(); void say(got); return; }
    setTimeout(burst, 200);
    sThud(); sBigFanfare(); shake(stageEl);
    if (rung === 4) return finale(got);
    [0, 300, 650].forEach(t => setTimeout(() => firework(), t));
    void sayMore(got, "That's the best one!");
  }, ms - 150);
  return ms;
}

/** The end of the biggest moments: a crowd cheer, a run of fireworks and a lot of confetti. */
function finale(got: Phrase) {
  [0, 250, 500, 800, 1100, 1400].forEach(t => setTimeout(() => firework(), t));
  confetti(140); sCheer();
  void sayMore(got);
}

/** He bought a new Body: "Wow!", the big jump, a crowd cheer, fireworks and confetti. Returns how long taps are blocked. */
export function celebrateBody(stage: GarageStage, stageEl: HTMLElement, got: Phrase): number {
  const ms = MOVES.mega.dur;
  void say('Wow!');
  stage.play('mega');
  sEngine(1.2);
  setTimeout(() => sWhoosh(0.6), 250);
  setTimeout(() => {
    const r = stageEl.getBoundingClientRect();
    sparks(stage.truckPoint(), { w: r.width, h: r.height });
    sThud(); sBigFanfare(); shake(stageEl);
    finale(got);
  }, ms - 150);
  return ms;
}
