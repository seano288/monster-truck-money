// The Goal bar: the Mod he's saving toward and how close he is. Tapping it says so.
import { game } from '../game/store';
import { say } from '../voice/say';
import { parseMod } from './catalog';
import { priceOf } from './economy';
import { goal, goalLines } from './garage';
import { PartIcon } from './icons';

export function GoalBar() {
  const g = goal(), bolts = game.value.bolts;
  if (!g) return <button class="goalchip done" aria-label="Goal" onClick={() => void say(...goalLines())}>🏆</button>;
  const { slot, rung } = parseMod(g), cost = priceOf(g);
  return (
    <button class={`goalchip ${bolts >= cost ? 'ready' : ''}`} aria-label="Goal" onClick={() => void say(...goalLines())}>
      <span class="gi"><PartIcon slot={slot} rung={rung} /></span>
      <span class="track"><i style={{ width: `${Math.min(100, (bolts / cost) * 100)}%` }} /></span>
      <span class="num">{Math.min(bolts, cost)}/{cost}</span>
    </button>
  );
}
