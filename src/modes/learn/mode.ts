import { LEVEL_MONEY } from '../../money/money';
import { LEARN_PHRASES } from '../../voice/phrases';
import type { GameMode } from '../mode';
import { checkLearn, makeLearn, type LearnProblem } from './learn';
import { LearnView } from './LearnView';

export const learnMode: GameMode<LearnProblem, Parameters<typeof checkLearn>[1]> = {
  id: 'learn',
  name: 'Learn the Coins',
  icon: '🪙',
  opensAfter: null,
  lockedHint: null,
  levels: LEVEL_MONEY,
  introMoney: { 2: ['q'], 3: ['b1', 'b5'] },
  phrases: LEARN_PHRASES,
  makeProblem: makeLearn,
  checkAnswer: checkLearn,
  View: LearnView,
};
