import { game } from '../game/store';
import { MODES } from '../modes/modes';
import { startRound } from '../round/round';
import { sBad } from '../audio/sfx';
import { BoltPile, LevelDots, TruckArt } from '../ui/bits';
import { currentFit } from '../garage/garage';
import { screen } from './nav';

const PAINT = ['#8d96a3', '#1e7bff', '#ff6a00', '#c04dff'];

export function Home() {
  const s = game.value;
  return (
    <div class="screen home-screen">
      <header class="home-head">
        <h1>Monster Truck Money</h1>
        <BoltPile />
      </header>
      <div class="home">
        <button class="tile t-garage" aria-label="Garage" onClick={() => (screen.value = 'garage')}>
          <TruckArt color={PAINT[currentFit().paint]} />
          <span class="nm">🔧 Garage</span>
        </button>
        {MODES.map(({ id, name, icon }) => {
          const open = s.modes[id].opened;
          const tap = () => (open ? startRound(id) : sBad());
          return (
            <button key={id} class={`tile mode t-${id} ${open ? '' : 'locked'}`} aria-label={name} onClick={tap}>
              <span class="e">{icon}</span>
              <span><span class="nm">{name}</span><br /><LevelDots level={s.modes[id].level} /></span>
              {!open ? <span class="lock">🔒</span> : s.modes[id].starred && <span class="badge">⭐</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
