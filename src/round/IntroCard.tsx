// "Look! New money!" before the first Round at a new Level.
import { useEffect } from 'preact/hooks';
import { MONEY, type MoneyKey } from '../money/money';
import { Money } from '../ui/Money';
import { moneyIs } from '../voice/phrases';
import { say, speaking } from '../voice/say';

export function IntroCard({ money, onGo }: { money: readonly MoneyKey[]; onGo: () => void }) {
  useEffect(() => {
    void say('Look!', 'New money!', ...money.map(k => ({ parts: [`This is a ${MONEY[k].name}.`, `It is worth ${MONEY[k].value}.`] as const, light: k })));
  }, []);
  return (
    <div class="modal">
      <div class="modal-card">
        <h2>New money!</h2>
        <div class="intro-money">
          {money.map(k => (
            <button key={k} class={`money-btn ${speaking.value === k ? 'speaking' : ''}`} aria-label={MONEY[k].name}
              onClick={() => void say({ parts: [moneyIs(k)], light: k })}>
              <Money k={k} scale={2} />
            </button>
          ))}
        </div>
        <button class="big-btn go" aria-label="Play" onClick={onGo}><span class="e">▶</span></button>
      </div>
    </div>
  );
}
