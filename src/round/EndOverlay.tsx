// End of a Round: the Truck show plays every moment, then 🔧 Garage, ▶ Play again and 🏠 wake up.
// No tap is taken until every moment has played.
import { useEffect, useRef, useState } from 'preact/hooks';
import { screen } from '../app/nav';
import { playRoundShow } from '../celebrate/roundShow';
import { affordableCount, truckColor } from '../garage/garage';
import { game } from '../game/store';
import { Bolt, IconButton, TruckArt } from '../ui/bits';
import type { Phrase } from '../voice/phrases';
import { leaveRound, round, startRound } from './round';

export function EndOverlay() {
  const r = round.value!;
  const [pile, setPile] = useState(game.value.bolts - 3);
  const [bump, setBump] = useState(false);
  const [lines, setLines] = useState<Phrase[]>([]);
  const [awake, setAwake] = useState(false);
  const els = { reward: useRef<HTMLDivElement>(null), moment: useRef<HTMLDivElement>(null), truck: useRef<HTMLDivElement>(null), load: useRef<HTMLDivElement>(null), pile: useRef<HTMLDivElement>(null) };

  useEffect(() => {
    let alive = true;
    void playRoundShow({
      reward: els.reward.current!, moment: els.moment.current!, truck: els.truck.current!, load: els.load.current!, pile: els.pile.current!,
      bump: n => { setPile(n); setBump(true); setTimeout(() => setBump(false), 150); },
      line: p => setLines(ls => [...ls, ...p]),
      alive: () => alive,
    }, r, game.value.bolts).then(() => { if (alive) setAwake(true); });
    return () => { alive = false; };
  }, []);

  const go = (fn: () => void) => () => { if (awake) fn(); };
  return (
    <div class="reward" ref={els.reward}>
      <h2>Round done!</h2>
      <div class="bigpile" ref={els.pile}><Bolt size={80} /><span class={bump ? 'bump' : ''}>{pile}</span></div>
      <div class="moment" ref={els.moment}>
        <div class="road" />
        <div class="ctruck" ref={els.truck}>
          <TruckArt color={truckColor()} />
          <div class="load" ref={els.load}><Bolt size={34} /><Bolt size={34} /><Bolt size={34} /></div>
        </div>
      </div>
      <div class="lines">{lines.map((l, i) => <div key={i}>{l}</div>)}</div>
      <div class={`btns ${awake ? '' : 'asleep'}`}>
        <button class={`big-btn garage ${awake && affordableCount() > 0 ? 'pulse' : ''}`} aria-label="Garage" onClick={go(() => { leaveRound(); screen.value = 'garage'; })}><span class="e">🔧</span></button>
        <button class="big-btn go" aria-label="Play again" onClick={go(() => startRound(r.mode))}><span class="e">▶</span></button>
      </div>
      <IconButton label="Home" class={awake ? '' : 'asleep'} onClick={go(() => { leaveRound(); screen.value = 'home'; })}>🏠</IconButton>
    </div>
  );
}
