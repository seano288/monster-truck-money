import { LEVEL_MONEY } from '../../money/money';
import { COUNT_PHRASES } from '../../voice/phrases';
import type { GameMode } from '../mode';
import { checkCount, makeCount, type CountProblem } from './count';
import { CountView } from './CountView';

export const countMode: GameMode<CountProblem, number> = {
  id: 'count',
  name: 'Count the Cash',
  icon: '💰',
  opensAfter: 'learn',
  lockedHint: 'Learn more coins to open this!',
  levels: LEVEL_MONEY,
  introMoney: { 2: ['q'], 3: ['b1', 'b5'] },
  phrases: COUNT_PHRASES,
  makeProblem: makeCount,
  checkAnswer: checkCount,
  View: CountView,
};
