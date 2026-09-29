import { screen } from '../app/nav';
import { game } from '../game/store';
import { modeById } from '../modes/modes';
import { BoltPile, IconButton, Stars } from '../ui/bits';
import { EndOverlay } from './EndOverlay';
import { correct, helped, leaveRound, miss, round } from './round';

export function RoundScreen() {
  const r = round.value;
  if (!r) return null;
  const mode = modeById(r.mode), View = mode.View;
  const w = game.value.modes[r.mode].window;
  const api = { correct, miss, helped, busy: r.busy, struggling: w.filter(o => o === 'missed').length >= 5 };
  return (
    <div class="screen round-screen">
      <div class="roundbar">
        <IconButton label="Home" onClick={() => { leaveRound(); screen.value = 'home'; }}>🏠</IconButton>
        <Stars n={r.stars} />
        <BoltPile />
      </div>
      <main class="card">
        <View key={r.key} problem={r.problem} level={r.level} api={api} />
      </main>
      {r.ended && <EndOverlay />}
    </div>
  );
}
