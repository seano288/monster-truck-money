import { game } from '../game/store';
import { MODE_IDS, MODE_NAMES, type ModeId } from '../modes/ids';
import { MODES } from '../modes/modes';
import { startRound } from '../round/round';
import { sBad } from '../audio/sfx';
import { BoltPile, LevelDots, TruckArt } from '../ui/bits';
import { screen } from './nav';

const ICONS: Record<ModeId, string> = { learn: '🪙', count: '💰', pay: '🛒' };

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
          <TruckArt />
          <span class="nm">🔧 Garage</span>
        </button>
        {MODE_IDS.map((id, i) => {
          const mode = MODES.find(m => m.id === id), open = !!mode && s.modes[id].opened;
          const tap = () => (open ? startRound(id) : sBad());
          return (
            <button key={id} class={`tile mode t-${id} ${open ? '' : 'locked'}`} aria-label={MODE_NAMES[i]} onClick={tap}>
              <span class="e">{ICONS[id]}</span>
              <span><span class="nm">{MODE_NAMES[i]}</span><br /><LevelDots level={s.modes[id].level} /></span>
              {!open && <span class="lock">🔒</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
