// The Pay the Shop counter: a price tag, the bank of money, the tray he taps it into, ✅ to pay, and
// "Help me pay". Pay the Shop Rounds use it, and so does buying a Legendary Mod in the Garage.
import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { sClink } from '../../audio/sfx';
import { biggestFirst, fmt, MONEY, total, type MoneyKey } from '../../money/money';
import { PeekCard } from '../../round/PeekCard';
import { Money } from '../../ui/Money';
import { toast } from '../../ui/toast';
import { say, type Item } from '../../voice/say';
import type { RoundApi } from '../mode';
import { checkPay, helpPayCoins } from './pay';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const MAX_TRAY = 12; // Help me pay needs at most 8

export interface PayCounterProps {
  price: number;
  bank: readonly MoneyKey[];
  /** What's being bought, on the price tag. */
  icon: ComponentChildren;
  /** The money 👀 shows, and what's said again after it. */
  peekMoney: readonly MoneyKey[];
  speech: Item[];
  api: RoundApi;
  /** Told what was in the tray when he paid exactly, before api.correct(). */
  onPaid?: (cents: number) => void;
}

export function PayCounter({ price, bank, icon, peekMoney, speech, api, onPaid }: PayCounterProps) {
  const [tray, setTray] = useState<MoneyKey[]>([]); // in the order he tapped them in
  const [peek, setPeek] = useState(false);
  const [done, setDone] = useState(false);
  const run = useRef(0); // bumped to stop a Help me pay in progress
  useEffect(() => () => { run.current++; }, []);

  const paid = total(tray);
  const sayTotal = (t: MoneyKey[]) => (t.length ? say({ cents: total(t) }) : Promise.resolve());

  function put(k: MoneyKey) {
    if (api.busy || done || tray.length >= MAX_TRAY) return;
    run.current++;
    const t = [...tray, k];
    setTray(t);
    sClink();
    void sayTotal(t);
  }
  function takeBack(i = tray.length - 1) {
    if (api.busy || done || i < 0) return;
    run.current++;
    const t = tray.filter((_, j) => j !== i);
    setTray(t);
    void sayTotal(t);
  }

  async function helpPay() {
    const me = ++run.current;
    api.helped();
    setTray([]);
    const t: MoneyKey[] = [];
    for (const k of helpPayCoins(price, bank)) {
      if (run.current !== me) return;
      t.push(k);
      setTray([...t]);
      sClink();
      await say({ cents: total(t) });
      await sleep(250);
    }
  }

  function check() {
    if (api.busy || done) return;
    const r = checkPay({ price }, tray);
    if (r.kind === 'paid') { run.current++; setDone(true); onPaid?.(paid); return api.correct(); }
    if (r.kind === 'empty') return void toast('Tap some money first!', 'Tap some money first!'); // not an answer, so not a miss
    api.miss(teach => {
      const said = r.kind === 'short'
        ? toast(`Almost! You need ${fmt(r.by)} more.`, 'Almost!', 'You need', { cents: r.by }, 'more')
        : toast(`Too much! Take back ${fmt(r.by)}.`, 'Too much!', 'Take back', { cents: r.by });
      return teach ? said.then(helpPay) : said;
    });
  }

  const shown = tray.map((k, i) => ({ k, i })).sort((a, b) => biggestFirst(a.k, b.k));

  return (
    <>
      <div class="price-tag"><span class="e">{icon}</span><span class="price">{fmt(price)}</span></div>
      <div class="bank">
        {bank.map(k => <button key={k} class="money-btn" aria-label={MONEY[k].name} onClick={() => put(k)}><Money k={k} /></button>)}
      </div>
      <div class="tray">
        {shown.length ? shown.map(({ k, i }) => (
          <button key={i} class="money-btn" aria-label={`Take back ${MONEY[k].name}`} onClick={() => takeBack(i)}><Money k={k} caption={false} scale={shown.length > 6 ? 0.55 : 0.8} /></button>
        )) : <span class="empty">👇 🪙</span>}
      </div>
      <div class="paidrow">
        <span>🪙 <b>{fmt(paid)}</b></span>
        <button class={`big-btn go ${done ? 'right' : ''}`} aria-label="Pay" onClick={check}><span class="e">✅</span></button>
      </div>
      <div class="helpers">
        <button class="help-btn" onClick={() => void helpPay()}>🔎 Help me pay</button>
        <button class="help-btn" aria-label="Take one back" onClick={() => takeBack()}>↩</button>
        <button class="help-btn" aria-label="Show me all the money" onClick={() => { api.helped(); setPeek(true); }}>👀</button>
      </div>
      {peek && <PeekCard money={peekMoney} onDone={() => { setPeek(false); void say(...speech); }} />}
    </>
  );
}
