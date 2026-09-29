import { screen } from '../app/nav';
import { modeById } from '../modes/modes';
import { BoltPile, IconButton, Stars } from '../ui/bits';
import { EndOverlay } from './EndOverlay';
import { IntroCard } from './IntroCard';
import { correct, helped, introDone, isStruggling, leaveRound, miss, round } from './round';

export function RoundScreen() {
  const r = round.value;
  if (!r) return null;
  const mode = modeById(r.mode), View = mode.View;
  const api = { correct, miss, helped, busy: r.busy, struggling: isStruggling(r.mode) };
  return (
    <div class="screen round-screen">
      <div class="roundbar">
        <IconButton label="Home" onClick={() => { leaveRound(); screen.value = 'home'; }}>🏠</IconButton>
        <Stars n={r.stars} />
        <BoltPile />
      </div>
      <main class="card">
        {!r.intro && <View key={r.key} problem={r.problem} level={r.level} api={api} />}
      </main>
      {r.intro && r.level > 1 && <IntroCard money={mode.introMoney[r.level as 2 | 3]} onGo={introDone} />}
      {r.ended && <EndOverlay />}
    </div>
  );
}
