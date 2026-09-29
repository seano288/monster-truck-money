// The list of Game Modes, in unlock order. Home tiles and the unlock chain are built from it.
import type { ModeId } from './ids';
import type { GameMode } from './mode';
import { countMode } from './count/mode';
import { learnMode } from './learn/mode';

export const MODES: readonly GameMode<any, any>[] = [learnMode, countMode];

export function modeById(id: ModeId) {
  const m = MODES.find(m => m.id === id);
  if (!m) throw new Error(`No mode ${id}`);
  return m;
}
