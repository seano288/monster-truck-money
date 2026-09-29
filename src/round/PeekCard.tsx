// 👀 Show me all the money: every piece of the Level's money, each one tappable to hear its name and value.
import { useEffect } from 'preact/hooks';
import { MONEY, type MoneyKey } from '../money/money';
import { Money } from '../ui/Money';
import { moneyIs } from '../voice/phrases';
import { say, speaking } from '../voice/say';

export function PeekCard({ money, onDone }: { money: readonly MoneyKey[]; onDone: () => void }) {
  useEffect(() => { void say('Tap a coin to hear its name.'); }, []);
  return (
    <div class="modal">
      <div class="modal-card">
        <div class="intro-money">
          {money.map(k => (
            <button key={k} class={`money-btn ${speaking.value === k ? 'speaking' : ''}`} aria-label={MONEY[k].name} onClick={() => void say({ parts: [moneyIs(k)], light: k })}>
              <Money k={k} />
            </button>
          ))}
        </div>
        <button class="big-btn go" aria-label="Done" onClick={onDone}><span class="e">👍</span></button>
      </div>
    </div>
  );
}
