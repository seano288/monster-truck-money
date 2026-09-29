// Garage actions on the saved game: choosing a Body and fitting Mods.
import { game, update } from '../game/store';
import { BODY_IDS, defaultFit, type BodyId, type Fit, type Rung, type SlotId } from './catalog';

export const currentBody = (): BodyId => game.value.body ?? 'pickup';
export const currentFit = (): Fit => game.value.fitted[currentBody()] ?? defaultFit();

export function chooseBody(body: BodyId) {
  update(s => ({ ...s, body }));
}

export function stepBody(d: 1 | -1) {
  const i = BODY_IDS.indexOf(currentBody());
  chooseBody(BODY_IDS[(i + d + BODY_IDS.length) % BODY_IDS.length]!);
}

export function fit(slot: SlotId, rung: Rung) {
  const body = currentBody();
  update(s => ({ ...s, fitted: { ...s.fitted, [body]: { ...s.fitted[body], [slot]: rung } } }));
}

export const isUnlocked = (slot: SlotId, rung: Rung) => rung === 0 || game.value.unlocked.includes(`${slot}:${rung}`);
