// The Garage: "Tap the truck". The 3D Truck fills the stage with a hotspot on each Slot's part; tapping one
// swings the camera there and opens that Slot's sheet of 4 Mods (bottom sheet in portrait, side panel in landscape).
import { useEffect, useRef, useState } from 'preact/hooks';
import { screen } from '../app/nav';
import { HORNS, sClink } from '../audio/sfx';
import { game } from '../game/store';
import { startRound } from '../round/round';
import { BoltPile, IconButton } from '../ui/bits';
import { say } from '../voice/say';
import { BODY_NAMES, modName, SLOTS, slotById, type Rung, type SlotId } from './catalog';
import { currentBody, currentFit, fit, isUnlocked, stepBody } from './garage';
import { PartIcon } from './icons';
import { GarageStage } from './three/stage';

export function GarageScreen() {
  const canvas = useRef<HTMLCanvasElement>(null), stageEl = useRef<HTMLDivElement>(null);
  const hots = useRef<Partial<Record<SlotId, HTMLButtonElement | null>>>({});
  const [stage, setStage] = useState<GarageStage | null>(null);
  const [sheet, setSheet] = useState<SlotId | null>(null);
  const body = currentBody(), f = currentFit();

  useEffect(() => {
    // three.js is in the main bundle, not a lazy chunk: an update can't leave the Garage pointing at a chunk that's gone
    const st = new GarageStage(canvas.current!, stageEl.current!);
    st.onHotspots = places => {
      for (const [slot, p] of Object.entries(places) as [SlotId, (typeof places)[SlotId]][]) {
        const el = hots.current[slot];
        if (!el) continue;
        el.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px) translate(-50%,-50%)`;
        el.classList.toggle('hidden', !p.visible);
      }
    };
    setStage(st);
    void say('Garage!');
    return () => st.dispose();
  }, []);

  useEffect(() => { stage?.setTruck(body, f); }, [stage, body, JSON.stringify(f)]);

  function openSheet(slot: SlotId) {
    setSheet(slot);
    stage?.focus(slot);
    if (slot === 'horn') HORNS[f.horn]!();
    void say(slotById(slot).name);
  }
  function closeSheet() { setSheet(null); stage?.focus(null); }

  function tapMod(slot: SlotId, rung: Rung) {
    if (!isUnlocked(slot, rung)) return void say(modName(slot, rung));
    fit(slot, rung);
    if (slot === 'horn') HORNS[rung]!();
    else { sClink(); void say(modName(slot, rung)); }
  }

  const bodyStep = (d: 1 | -1) => { stepBody(d); void say(BODY_NAMES[currentBody()]); };

  return (
    <div class={`screen garage-screen ${sheet ? 'open' : ''}`}>
      <header class="garage-hud">
        <BoltPile count={game.value.bolts} />
        <div class="spacer" />
        <IconButton label="Home" onClick={() => (screen.value = 'home')}>🏠</IconButton>
        <IconButton label="Play" class="go" onClick={() => startRound(game.value.lastMode)}>▶</IconButton>
      </header>
      <div class="garage-stage" ref={stageEl}>
        <canvas ref={canvas} />
        <div class="garage-overlay">
          <div class="bodyname">{BODY_NAMES[body]}</div>
          <button class="arrow l" aria-label="Previous truck" onClick={() => bodyStep(-1)}>◀</button>
          <button class="arrow r" aria-label="Next truck" onClick={() => bodyStep(1)}>▶</button>
          {SLOTS.map(s => (
            <button key={s.id} ref={el => { hots.current[s.id] = el; }} class={`hot hidden ${sheet === s.id ? 'on' : ''}`} aria-label={s.name} onClick={() => openSheet(s.id)}>{s.icon}</button>
          ))}
        </div>
      </div>
      {sheet && (
        <div class="sheet">
          <div class="sheethead"><span>{slotById(sheet).icon}</span>{slotById(sheet).name}<button class="x" aria-label="Close" onClick={closeSheet}>✕</button></div>
          <div class="sheettiles">
            {([0, 1, 2, 3] as const).map(r => {
              const un = isUnlocked(sheet, r), fitted = f[sheet] === r;
              return (
                <button key={r} class={`mod-tile ${fitted ? 'fitted' : un ? 'owned' : 'locked'}`} aria-label={modName(sheet, r)} onClick={() => tapMod(sheet, r)}>
                  <div class="ico"><PartIcon slot={sheet} rung={r} /></div>
                  <div class="nm">{modName(sheet, r)}</div>
                  {fitted && <div class="check">✓</div>}
                  {!un && <div class="lock">🔒</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
