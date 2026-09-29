import { LEVEL_MONEY } from '../../money/money';
import { PAY_PHRASES } from '../../voice/phrases';
import type { GameMode } from '../mode';
import { checkPay, makePay, type PayProblem } from './pay';
import { PayView } from './PayView';

export const payMode: GameMode<PayProblem, Parameters<typeof checkPay>[1]> = {
  id: 'pay',
  name: 'Pay the Shop',
  icon: '🛒',
  opensAfter: 'count',
  lockedHint: 'Count more cash to open this!',
  levels: LEVEL_MONEY,
  introMoney: { 2: ['q'], 3: ['b1'] }, // no $5 bill: no price needs one
  phrases: PAY_PHRASES,
  makeProblem: makePay,
  checkAnswer: (p, tray) => checkPay(p, tray).kind === 'paid',
  View: PayView,
};
