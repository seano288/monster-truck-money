// The Garage: "Tap the truck". The 3D Truck fills the stage with a hotspot on each Slot's part; tapping one
// swings the camera there and opens that Slot's sheet of 5 Mods (bottom sheet in portrait, side panel in landscape).
// Along the bottom, the Body switcher shows every Body, the locked ones with their Bolt price; it scrolls, and keeps
// the Body he's driving in view. 📸 Show Off puts the Truck on stage, and 🏆 opens the Trophy Shelf.
import { useEffect, useRef, useState } from 'preact/hooks';
import { screen } from '../app/nav';
import { ENGINES, HORNS, sClink, sNope } from '../audio/sfx';
import { celebrateBody, celebrateUnlock } from '../celebrate/garageShow';
import { game } from '../game/store';
import { fmt } from '../money/money';
import { startRound } from '../round/round';
import { TrophyShelf } from '../trophies/TrophyShelf';
import { Bolt, BoltPile, IconButton } from '../ui/bits';
import { say } from '../voice/say';
import { BodyArt } from './BodyArt';
import { bodyItem, BODY_IDS, BODY_NAMES, isStarter, LEGENDARY, modId, modName, RUNGS, SLOTS, slotById, TOP, type BodyId, type Rung, type SlotId } from './catalog';
import { Checkout } from './Checkout';
import { CASH_PRICES, PRICES } from './economy';
import {
  buyLegendary, canAfford, canAffordBody, currentBody, currentFit, goal, gotLine, isUnlocked, needLines, owns, slotHasAffordable,
  stepBody, tapBody, tapMod, waitingFor, waitLines,
} from './garage';
import { GoalBar } from './GoalBar';
import { PartIcon } from './icons';
import { ShowOff } from './show/ShowOff';
import { GarageStage, spreadHotspots } from './three/stage';

export function GarageScreen() {
  const canvas = useRef<HTMLCanvasElement>(null), stageEl = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const hots = useRef<Partial<Record<SlotId, HTMLButtonElement | null>>>({});
  const [stage, setStage] = useState<GarageStage | null>(null);
  const [sheet, setSheet] = useState<SlotId | null>(null);
  const [checkout, setCheckout] = useState<SlotId | null>(null);
  const [showing, setShowing] = useState(false);
  const [shelf, setShelf] = useState(false);
  const [wiggle, setWiggle] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false); // only for the length of an unlock jump
  const body = currentBody(), f = currentFit();

  useEffect(() => {
    // three.js is in the main bundle, not a lazy chunk: an update can't leave the Garage pointing at a chunk that's gone
    const st = new GarageStage(canvas.current!, stageEl.current!);
    st.onHotspots = places => {
      spreadHotspots(places, (Object.values(hots.current).find(Boolean)?.offsetWidth ?? 66) + 8);
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
  useEffect(() => { strip.current?.querySelector('.on')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); }, [body, showing]);

  function openSheet(slot: SlotId) {
    setSheet(slot);
    stage?.focus(slot);
    if (slot === 'horn') HORNS[f.horn]!();
    if (slot === 'engine') { ENGINES[f.engine]!(); stage?.puff(); } // he revs it
    if (slot === 'exhaust') stage?.puff();
    void say(slotById(slot).name);
  }
  function closeSheet() { setSheet(null); stage?.focus(null); }

  function block(ms: number) {
    setBlocked(true);
    setTimeout(() => setBlocked(false), ms);
  }
  function nope(key: string) {
    sNope();
    setWiggle(key);
    setTimeout(() => setWiggle(null), 450);
  }

  function tap(slot: SlotId, rung: Rung) {
    const result = tapMod(slot, rung);
    if (slot === 'engine' && result !== 'unlocked') { ENGINES[rung]!(); stage?.puff(); } // he hears an Engine before he buys it
    if (result === 'fitted') {
      if (slot === 'horn') HORNS[rung]!();
      else if (slot !== 'engine') { sClink(); void say(modName(slot, rung)); }
    } else if (result === 'unlocked') {
      const r = rung as 1 | 2 | 3;
      if (stage) block(celebrateUnlock(stage, stageEl.current!, slot, r, currentFit(), gotLine(modId(slot, r))));
    } else if (result === 'checkout') {
      setCheckout(slot);
    } else if (result === 'waiting') {
      nope(`${slot}:${rung}`);
      void say(...waitLines(slot, waitingFor(slot)!));
    } else {
      nope(`${slot}:${rung}`);
      void say(...needLines(modId(slot, rung as 1 | 2 | 3)));
    }
  }

  function paid(slot: SlotId, cents: number) {
    buyLegendary(slot, cents);
    setCheckout(null);
    if (stage) block(celebrateUnlock(stage, stageEl.current!, slot, LEGENDARY, currentFit(), gotLine(modId(slot, LEGENDARY))));
  }

  function tapBodyChip(b: BodyId) {
    const result = tapBody(b);
    if (result === 'switched') void say(BODY_NAMES[b]);
    else if (result === 'bought') { if (!isStarter(b) && stage) block(celebrateBody(stage, stageEl.current!, currentFit(), gotLine(bodyItem(b)))); }
    else { nope(`body:${b}`); if (!isStarter(b)) void say(...needLines(bodyItem(b))); }
  }

  function startShow() {
    closeSheet();
    setShowing(true);
    stage?.show(true);
  }
  function endShow() {
    setShowing(false);
    stage?.show(false);
  }

  const bodyStep = (d: 1 | -1) => { stepBody(d); void say(BODY_NAMES[currentBody()]); };

  return (
    <div class={`screen garage-screen ${sheet ? 'open' : ''} ${showing ? 'showing' : ''}`}>
      <header class="garage-hud">
        <BoltPile count={game.value.bolts} />
        <GoalBar />
        <div class="spacer" />
        <IconButton label="Trophies" class="trophies" onClick={() => { closeSheet(); setShelf(true); }}>🏆</IconButton>
        <IconButton label="Show Off" class="show" onClick={startShow}>📸</IconButton>
        <IconButton label="Home" onClick={() => (screen.value = 'home')}>🏠</IconButton>
        <IconButton label="Play" class="go" onClick={() => startRound(game.value.lastMode)}>▶</IconButton>
      </header>
      <div class="garage-stage" ref={stageEl}>
        <canvas ref={canvas} />
        {showing && stage ? <ShowOff stage={stage} canvas={canvas.current!} stageEl={stageEl.current!} body={body} horn={f.horn} engine={f.engine} topper={f.topper} onClose={endShow} /> : (
          <div class="garage-overlay">
            <div class="bodyname">{BODY_NAMES[body]}</div>
            <button class="arrow l" aria-label="Previous truck" onClick={() => bodyStep(-1)}>◀</button>
            <button class="arrow r" aria-label="Next truck" onClick={() => bodyStep(1)}>▶</button>
            {SLOTS.map(s => (
              <button key={s.id} ref={el => { hots.current[s.id] = el; }} class={`hot hidden ${sheet === s.id ? 'on' : ''} ${slotHasAffordable(s.id) ? 'aff' : ''}`} aria-label={s.name} onClick={() => openSheet(s.id)}>{s.icon}</button>
            ))}
            <div class="bodystrip" ref={strip}>
              {BODY_IDS.map(b => {
                const mine = owns(b), price = isStarter(b) ? 0 : PRICES.bodies[b];
                const cls = b === body ? 'on' : mine ? 'owned' : canAffordBody(b) ? 'afford' : 'locked';
                return (
                  <button key={b} class={`body-chip ${cls} ${wiggle === `body:${b}` ? 'wiggle' : ''}`} aria-label={BODY_NAMES[b]} onClick={() => tapBodyChip(b)}>
                    <BodyArt body={b} color={mine ? '#e63946' : '#6b7385'} />
                    {!mine && <span class="cost"><Bolt size={18} />{price}</span>}
                    {cls === 'locked' && <span class="lock">🔒</span>}
                    {!isStarter(b) && goal() === bodyItem(b) && <span class="flag">🎯</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {sheet && !showing && (
        <div class="sheet">
          <div class="sheethead"><span>{slotById(sheet).icon}</span>{slotById(sheet).name}<button class="x" aria-label="Close" onClick={closeSheet}>✕</button></div>
          <div class="sheettiles">
            {([0, ...RUNGS] as const).map(r => {
              const un = isUnlocked(sheet, r), fitted = f[sheet] === r, legend = r === LEGENDARY;
              if (legend) {
                const wait = waitingFor(sheet), cls = fitted ? 'fitted' : un ? 'owned' : wait ? 'locked' : 'open';
                return (
                  <button key={r} class={`mod-tile legend ${cls} ${wiggle === `${sheet}:${r}` ? 'wiggle' : ''}`} aria-label={modName(sheet, r)} onClick={() => tap(sheet, r)}>
                    <div class="ico"><PartIcon slot={sheet} rung={r} /></div>
                    <div class="nm">{modName(sheet, r)}</div>
                    {!un && <div class="cost money">{fmt(CASH_PRICES[sheet])}</div>}
                    {fitted && <div class="check">✓</div>}
                    {wait && <><div class="lock">🔒</div><div class="wait" aria-label={`Needs ${modName(sheet, TOP)}`}><PartIcon slot={sheet} rung={TOP} /></div></>}
                  </button>
                );
              }
              const aff = canAfford(sheet, r), price = r ? PRICES.rungs[r] : 0;
              const cls = fitted ? 'fitted' : un ? 'owned' : aff ? 'afford' : 'locked';
              return (
                <button key={r} class={`mod-tile ${cls} ${wiggle === `${sheet}:${r}` ? 'wiggle' : ''}`} aria-label={modName(sheet, r)} onClick={() => tap(sheet, r)}>
                  <div class="ico"><PartIcon slot={sheet} rung={r} /></div>
                  <div class="nm">{modName(sheet, r)}</div>
                  {!un && <div class="cost"><Bolt size={20} />{price}</div>}
                  {fitted && <div class="check">✓</div>}
                  {cls === 'locked' && <><div class="lock">🔒</div><div class="prog"><i style={{ width: `${(game.value.bolts / price) * 100}%` }} /></div></>}
                  {r !== 0 && goal() === modId(sheet, r) && <div class="flag">🎯</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {shelf && <TrophyShelf onClose={() => setShelf(false)} />}
      {checkout && <Checkout slot={checkout} onPaid={cents => paid(checkout, cents)} onClose={() => setCheckout(null)} />}
      {blocked && <div class="blocker" />}
    </div>
  );
}
