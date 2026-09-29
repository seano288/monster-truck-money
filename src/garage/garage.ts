// Garage actions on the saved game: choosing a Body, fitting and unlocking Mods, and the Goal.
import { game, update } from '../game/store';
import { needBolts, type Phrase } from '../voice/phrases';
import { BODY_IDS, defaultFit, modId, modName, parseMod, type BodyId, type Fit, type ModId, type Rung, type SlotId } from './catalog';
import { affordable, boltsNeeded, goalOf, priceOf, unlock } from './economy';

export const currentBody = (): BodyId => game.value.body ?? 'pickup';
export const currentFit = (): Fit => game.value.fitted[currentBody()] ?? defaultFit();

export function chooseBody(body: BodyId) {
  update(s => ({ ...s, body }));
}

export function stepBody(d: 1 | -1) {
  const i = BODY_IDS.indexOf(currentBody());
  chooseBody(BODY_IDS[(i + d + BODY_IDS.length) % BODY_IDS.length]!);
}

function fit(slot: SlotId, rung: Rung) {
  const body = currentBody();
  update(s => ({ ...s, fitted: { ...s.fitted, [body]: { ...s.fitted[body], [slot]: rung } } }));
}

export const isUnlocked = (slot: SlotId, rung: Rung) => rung === 0 || game.value.unlocked.includes(modId(slot, rung));
export const canAfford = (slot: SlotId, rung: Rung) => rung !== 0 && !isUnlocked(slot, rung) && game.value.bolts >= priceOf(modId(slot, rung));
export const slotHasAffordable = (slot: SlotId) => ([1, 2, 3] as const).some(r => canAfford(slot, r));
export const affordableCount = () => affordable(game.value).length;
export const goal = () => goalOf(game.value);

export type TapResult = 'fitted' | 'unlocked' | 'goal';

/** Tapping a Mod tile: an owned Mod is fitted; an affordable one is unlocked and fitted in one tap; a locked one becomes the Goal. */
export function tapMod(slot: SlotId, rung: Rung): TapResult {
  if (isUnlocked(slot, rung)) { fit(slot, rung); return 'fitted'; }
  const mod = modId(slot, rung as 1 | 2 | 3);
  if (canAfford(slot, rung)) {
    update(s => unlock(s, mod));
    fit(slot, rung);
    return 'unlocked';
  }
  update(s => ({ ...s, goal: mod }));
  return 'goal';
}

/** "Chunky. You need 2 more Bolts." */
export function needLines(mod: ModId): Phrase[] {
  const { slot, rung } = parseMod(mod);
  return [modName(slot, rung), needBolts(boltsNeeded(game.value, mod))];
}

export const gotLine = (mod: ModId) => { const { slot, rung } = parseMod(mod); return `You got ${modName(slot, rung)}!` as Phrase; };

/** What tapping the Goal bar says. */
export function goalLines(): Phrase[] {
  const g = goal();
  if (!g) return ['You built everything!'];
  if (boltsNeeded(game.value, g) > 0) return needLines(g);
  const { slot, rung } = parseMod(g);
  return [`You can get ${modName(slot, rung)}!` as Phrase];
}
