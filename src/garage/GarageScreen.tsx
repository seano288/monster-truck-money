// The Garage: "Tap the truck". The 3D Truck fills the stage with a hotspot on each Slot's part; tapping one
// swings the camera there and opens that Slot's sheet of 4 Mods (bottom sheet in portrait, side panel in landscape).
import { useEffect, useRef, useState } from 'preact/hooks';
import { screen } from '../app/nav';
import { HORNS, sClink, sNope } from '../audio/sfx';
import { celebrateUnlock } from '../celebrate/garageShow';
import { game } from '../game/store';
import { startRound } from '../round/round';
import { Bolt, BoltPile, IconButton } from '../ui/bits';
import { say } from '../voice/say';
import { BODY_NAMES, modId, modName, SLOTS, slotById, type Rung, type SlotId } from './catalog';
import { PRICES } from './economy';
import { canAfford, currentBody, currentFit, goal, gotLine, isUnlocked, needLines, slotHasAffordable, stepBody, tapMod } from './garage';
import { GoalBar } from './GoalBar';
import { PartIcon } from './icons';
import { GarageStage } from './three/stage';

export function GarageScreen() {
  const canvas = useRef<HTMLCanvasElement>(null), stageEl = useRef<HTMLDivElement>(null);
  const hots = useRef<Partial<Record<SlotId, HTMLButtonElement | null>>>({});
  const [stage, setStage] = useState<GarageStage | null>(null);
  const [sheet, setSheet] = useState<SlotId | null>(null);
  const [wiggle, setWiggle] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false); // only for the length of an unlock jump
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

  function tap(slot: SlotId, rung: Rung) {
    const result = tapMod(slot, rung);
    if (result === 'fitted') {
      if (slot === 'horn') HORNS[rung]!();
      else { sClink(); void say(modName(slot, rung)); }
    } else if (result === 'unlocked') {
      const r = rung as 1 | 2 | 3;
      if (!stage) return;
      const ms = celebrateUnlock(stage, stageEl.current!, slot, r, gotLine(modId(slot, r)));
      setBlocked(true);
      setTimeout(() => setBlocked(false), ms);
    } else {
      sNope();
      void say(...needLines(modId(slot, rung as 1 | 2 | 3)));
      setWiggle(`${slot}:${rung}`);
      setTimeout(() => setWiggle(null), 450);
    }
  }

  const bodyStep = (d: 1 | -1) => { stepBody(d); void say(BODY_NAMES[currentBody()]); };

  return (
    <div class={`screen garage-screen ${sheet ? 'open' : ''}`}>
      <header class="garage-hud">
        <BoltPile count={game.value.bolts} />
        <GoalBar />
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
            <button key={s.id} ref={el => { hots.current[s.id] = el; }} class={`hot hidden ${sheet === s.id ? 'on' : ''} ${slotHasAffordable(s.id) ? 'aff' : ''}`} aria-label={s.name} onClick={() => openSheet(s.id)}>{s.icon}</button>
          ))}
        </div>
      </div>
      {sheet && (
        <div class="sheet">
          <div class="sheethead"><span>{slotById(sheet).icon}</span>{slotById(sheet).name}<button class="x" aria-label="Close" onClick={closeSheet}>✕</button></div>
          <div class="sheettiles">
            {([0, 1, 2, 3] as const).map(r => {
              const un = isUnlocked(sheet, r), fitted = f[sheet] === r, aff = canAfford(sheet, r), price = r ? PRICES[r] : 0;
              const cls = fitted ? 'fitted' : un ? 'owned' : aff ? 'afford' : 'locked';
              return (
                <button key={r} class={`mod-tile ${cls} ${wiggle === `${sheet}:${r}` ? 'wiggle' : ''}`} aria-label={modName(sheet, r)} onClick={() => tap(sheet, r)}>
                  <div class="ico"><PartIcon slot={sheet} rung={r} /></div>
                  <div class="nm">{modName(sheet, r)}</div>
                  {!un && <div class="cost"><Bolt size={20} />{price}</div>}
                  {fitted && <div class="check">✓</div>}
                  {cls === 'locked' && <><div class="lock">🔒</div><div class="prog"><i style={{ width: `${(game.value.bolts / price) * 100}%` }} /></div></>}
                  {r > 0 && goal() === modId(sheet, r as 1 | 2 | 3) && <div class="flag">🎯</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {blocked && <div class="blocker" />}
    </div>
  );
}
