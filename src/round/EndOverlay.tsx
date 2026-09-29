import { useEffect } from 'preact/hooks';
import { screen } from '../app/nav';
import { sClink, sFanfare } from '../audio/sfx';
import { game } from '../game/store';
import { Bolt, IconButton } from '../ui/bits';
import type { Phrase } from '../voice/phrases';
import { say } from '../voice/say';
import { eventLines, smallestFirst } from './events';
import { leaveRound, round, startRound } from './round';

export function EndOverlay() {
  const r = round.value!;
  const lines: Phrase[] = ['You earned 3 Bolts!', ...smallestFirst(r.events).flatMap(eventLines)];
  useEffect(() => {
    sFanfare();
    [0.6, 0.75, 0.9].forEach(sClink);
    void say(...lines);
  }, []);
  return (
    <div class="reward">
      <h2>Round done!</h2>
      <div class="bigpile"><Bolt size={80} /><span>{game.value.bolts}</span></div>
      <div class="lines">{lines.map(l => <div key={l}>{l}</div>)}</div>
      <div class="btns">
        <button class="big-btn go" aria-label="Play again" onClick={() => startRound(r.mode)}><span class="e">▶</span></button>
      </div>
      <IconButton label="Home" onClick={() => { leaveRound(); screen.value = 'home'; }}>🏠</IconButton>
    </div>
  );
}
