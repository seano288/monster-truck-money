import { useEffect } from 'preact/hooks';
import { sBad } from '../audio/sfx';
import { currentFit } from '../garage/garage';
import { GoalBar } from '../garage/GoalBar';
import { game, update } from '../game/store';
import type { ModeId } from '../modes/ids';
import { MODES } from '../modes/modes';
import { startRound } from '../round/round';
import { BoltPile, LevelDots, TruckArt } from '../ui/bits';
import { say, sayMore } from '../voice/say';
import { screen } from './nav';

const PAINT = ['#8d96a3', '#1e7bff', '#ff6a00', '#c04dff'];

function tapMode(id: ModeId) {
  const m = game.value.modes[id], mode = MODES.find(x => x.id === id)!;
  if (!m.opened) { sBad(); if (mode.lockedHint) void say(mode.lockedHint); return; }
  if (m.fresh) update(s => ({ ...s, modes: { ...s.modes, [id]: { ...s.modes[id], fresh: false } } }));
  startRound(id);
}

export function Home() {
  const s = game.value;
  useEffect(() => { // a newly opened mode says so again until he taps it
    const fresh = MODES.filter(m => s.modes[m.id].opened && s.modes[m.id].fresh);
    if (fresh.length) void sayMore(...fresh.map(m => `You opened ${m.name}!` as const));
  }, []);
  return (
    <div class="screen home-screen">
      <header class="home-head">
        <h1>Monster Truck Money</h1>
        <GoalBar />
        <BoltPile />
      </header>
      <div class="home">
        <button class="tile t-garage" aria-label="Garage" onClick={() => (screen.value = 'garage')}>
          <TruckArt color={PAINT[currentFit().paint]} />
          <span class="nm">🔧 Garage</span>
        </button>
        {MODES.map(({ id, name, icon }) => {
          const m = s.modes[id];
          return (
            <button key={id} class={`tile mode t-${id} ${m.opened ? '' : 'locked'} ${m.opened && m.fresh ? 'fresh' : ''}`} aria-label={name} onClick={() => tapMode(id)}>
              <span class="e">{icon}</span>
              <span><span class="nm">{name}</span><br /><LevelDots level={m.level} /></span>
              {!m.opened ? <span class="lock">🔒</span> : m.starred && <span class="badge">⭐</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
