// First launch only: he chooses his Truck's Body. Each is spoken when tapped; ▶ keeps it.
import { useState } from 'preact/hooks';
import { screen } from '../app/nav';
import { say } from '../voice/say';
import { BODY_IDS, BODY_NAMES, type BodyId } from './catalog';
import { chooseBody } from './garage';
import { BODIES, parsePath } from './three/bodies';

/** A Body's side profile with two wheels, flat, for the picker. */
function BodyShape({ body }: { body: BodyId }) {
  const B = BODIES[body], d = parsePath(B.path).map(p => 'M' + p.map(q => q.join(',')).join(' L') + ' Z').join(' ');
  return (
    <svg viewBox="10 -130 360 190" class="body-art" aria-hidden="true">
      <path d={d} fill="#e63946" stroke="#000" stroke-width="5" stroke-linejoin="round" transform="translate(0,6)" />
      <path d={B.win} fill="#bfe3ff" stroke="#000" stroke-width="3" transform="translate(0,6)" />
      {B.wheels.map(x => <g key={x}><circle cx={x} cy="18" r="40" fill="#1a1a1a" /><circle cx={x} cy="18" r="16" fill="#bbb" /></g>)}
    </svg>
  );
}

export function BodyPicker() {
  const [pick, setPick] = useState<BodyId | null>(null);
  return (
    <div class="screen picker-screen">
      <div class="bodies">
        {BODY_IDS.map(b => (
          <button key={b} class={`body-card ${pick === b ? 'on' : ''}`} aria-label={BODY_NAMES[b]} onClick={() => { setPick(b); void say(BODY_NAMES[b]); }}>
            <BodyShape body={b} />
            <span class="nm">{BODY_NAMES[b]}</span>
          </button>
        ))}
      </div>
      <button class={`big-btn go ${pick ? 'pulse' : 'asleep'}`} aria-label="Choose" disabled={!pick}
        onClick={() => { if (pick) { chooseBody(pick); screen.value = 'home'; } }}>
        <span class="e">▶</span>
      </button>
    </div>
  );
}
