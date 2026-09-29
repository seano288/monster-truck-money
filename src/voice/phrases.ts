// The single typed list of everything the game says. tools/make_voice.py records a clip for each entry,
// and the build fails if any is missing. say() accepts only these phrases (and amounts, joined from pieces).
import { MONEY_NAMES, MONEY_VALUES, type MoneyName, type MoneyValue } from '../money/money';
import { allAmountPieces, type AmountPiece } from './amount';

type Of<T extends readonly string[]> = T[number];

// ---------- Learn the Coins ----------
const LEARN = [
  'What is this called?', 'How much is this worth?', 'Which is worth more?', 'Which is worth less?',
  'Try again!', 'The dime is small, but it is worth more!', 'Tap a coin to hear its name.',
] as const;

// "{money} is {value}." only for the right pairs
type NameValue = { [I in keyof typeof MONEY_NAMES & `${number}`]: `${(typeof MONEY_NAMES)[I]} is ${(typeof MONEY_VALUES)[I]}.` }[keyof typeof MONEY_NAMES & `${number}`];
type MoneyPhrase = `Tap the ${MoneyName}!` | `${MoneyName}?` | `${MoneyValue}?` | `That's a ${MoneyName}.` | `Find the ${MoneyName}!` | NameValue;
const moneyPhrases = (): MoneyPhrase[] =>
  MONEY_NAMES.flatMap((m, i) => {
    const v = MONEY_VALUES[i]!;
    return [`Tap the ${m}!`, `${m}?`, `${v}?`, `That's a ${m}.`, `Find the ${m}!`, `${m} is ${v}.` as NameValue] as const;
  });

// ---------- cheers after a correct first try, in every mode ----------
export const CHEERS = ['VROOM! Great job!', 'Monster move!', 'You got it!', 'Truck-tastic!', 'Crushing it!', 'Awesome counting!'] as const;

// ---------- Rounds ----------
const ROUNDS = [
  "Let's go!", 'How much money is this?', 'Not quite!', "Let's count together.", 'Tap some money first!',
  'Almost!', 'You need', 'more', 'Too much!', 'Take back', 'It costs',
] as const;

// ---------- progress and end of Round ----------
const PROGRESS = ['You earned 3 Bolts!'] as const;

export type Phrase = Of<typeof LEARN> | MoneyPhrase | Of<typeof CHEERS> | Of<typeof ROUNDS> | Of<typeof PROGRESS> | AmountPiece;

export const LEARN_PHRASES: readonly Phrase[] = [...LEARN, ...moneyPhrases()];

export const PHRASES: readonly Phrase[] = [...new Set<Phrase>([...LEARN_PHRASES, ...CHEERS, ...ROUNDS, ...PROGRESS, ...allAmountPieces()])];
