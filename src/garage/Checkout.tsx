// Buying a Legendary: Pay the Shop's counter with the Mod as the shop item. He taps money into the tray until it
// adds up to the price; short and over get the same replies as in Pay the Shop, and after two misses Help me pay
// steps in by itself. Paying exactly buys it.
import { useState } from 'preact/hooks';
import { sBad } from '../audio/sfx';
import type { RoundApi } from '../modes/mode';
import { PayCounter } from '../modes/pay/PayCounter';
import { fmt, MONEY_KEYS } from '../money/money';
import { Ask } from '../round/Ask';
import { TEACH_ON_MISS } from '../round/rules';
import { LEGENDARY, modName, type SlotId } from './catalog';
import { CASH_PRICES } from './economy';
import { costLines } from './garage';
import { PartIcon } from './icons';

/** onPaid gets the tray's total, which unlock() checks against the price. */
export function Checkout({ slot, onPaid, onClose }: { slot: SlotId; onPaid: (cents: number) => void; onClose: () => void }) {
  const [misses, setMisses] = useState(0);
  const cents = CASH_PRICES[slot], speech = costLines(slot);
  const api: RoundApi = {
    correct: () => {},
    miss: explain => { sBad(); setMisses(n => n + 1); void explain(misses + 1 >= TEACH_ON_MISS); },
    helped: () => {},
    busy: false,
  };
  return (
    <div class="modal checkout">
      <div class="modal-card checkout-card">
        <button class="x" aria-label="Close" onClick={onClose}>✕</button>
        <div class="game">
          <Ask text={`${modName(slot, LEGENDARY)} costs ${fmt(cents)}`} speech={speech} />
          <PayCounter price={cents} bank={MONEY_KEYS} icon={<PartIcon slot={slot} rung={LEGENDARY} />} peekMoney={MONEY_KEYS} speech={speech} api={api} onPaid={onPaid} />
        </div>
      </div>
    </div>
  );
}
