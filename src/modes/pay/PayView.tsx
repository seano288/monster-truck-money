import { LEVEL_MONEY } from '../../money/money';
import { Ask } from '../../round/Ask';
import type { Item } from '../../voice/say';
import type { ModeViewProps } from '../mode';
import type { PayProblem } from './pay';
import { PayCounter } from './PayCounter';

export function PayView({ problem: p, level, api }: ModeViewProps<PayProblem>) {
  const buy = `Buy the ${p.item.name}!` as const;
  const speech: Item[] = [buy, 'It costs', { cents: p.price }];
  return (
    <div class="game">
      <Ask text={buy} speech={speech} />
      <PayCounter price={p.price} bank={p.bank} icon={p.item.icon} peekMoney={LEVEL_MONEY[level]} speech={speech} api={api} />
    </div>
  );
}
