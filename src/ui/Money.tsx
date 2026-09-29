import { MONEY, type MoneyKey } from '../money/money';
import d from '../money/coins/d.png';
import n from '../money/coins/n.jpg';
import p from '../money/coins/p.png';
import q from '../money/coins/q.jpg';

const COIN_IMG: Partial<Record<MoneyKey, string>> = { p, n, d, q };

/** A coin or bill, optionally with its name and value underneath. */
export function Money({ k, caption = true, scale = 1 }: { k: MoneyKey; caption?: boolean; scale?: number }) {
  const m = MONEY[k], dollars = m.cents / 100;
  return (
    <div class="money">
      {m.bill ? (
        <div class="bill" style={{ '--b': scale }}>
          <span class="c tl">{dollars}</span><span class="c br">{dollars}</span><span class="oval">${dollars}</span>
        </div>
      ) : (
        <div class="coin" style={{ '--s': `${Math.round(m.size * scale)}px` }}><img src={COIN_IMG[k]} alt="" /></div>
      )}
      <div class={`cap${caption ? '' : ' hide'}`}>{m.name} · {m.value}</div>
    </div>
  );
}
