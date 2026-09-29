// The single typed list of everything the game says. tools/make_voice.py records a clip for each entry,
// and the build fails if any is missing. say() accepts only these phrases (and amounts, joined from pieces).
import { BODY_NAMES, SLOTS, type BodyName, type ModName, type SlotName } from '../garage/catalog';
import { MONEY, MONEY_NAMES, MONEY_VALUES, type MoneyKey, type MoneyName, type MoneyValue } from '../money/money';
import { MODE_NAMES, type ModeName } from '../modes/ids';
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
/** "Quarter is 25¢." */
export const moneyIs = (k: MoneyKey) => `${MONEY[k].name} is ${MONEY[k].value}.` as NameValue;

// ---------- cheers after a correct first try, in every mode ----------
export const CHEERS = ['VROOM! Great job!', 'Monster move!', 'You got it!', 'Truck-tastic!', 'Crushing it!', 'Awesome counting!'] as const;

// ---------- Rounds ----------
const ROUNDS = [
  "Let's go!", 'How much money is this?', 'Not quite!', "Let's count together.", 'Tap some money first!',
  'Almost!', 'You need', 'more', 'Too much!', 'Take back', 'It costs',
] as const;

// ---------- introduction card ----------
const INTRO = ['Look!', 'New money!'] as const;
type IntroPhrase = Of<typeof INTRO> | `This is a ${MoneyName}.` | `It is worth ${MoneyValue}.`;
const introPhrases = (): IntroPhrase[] => [...INTRO, ...MONEY_NAMES.map(m => `This is a ${m}.` as const), ...MONEY_VALUES.map(v => `It is worth ${v}.` as const)];

// ---------- progress and end of Round ----------
const PROGRESS = ['You earned 3 Bolts!', 'Level up!', 'Now you get quarters!', 'Now you get dollar bills!'] as const;
type ModePhrase = `You are a ${ModeName} star!`;
const modePhrases = (): ModePhrase[] => MODE_NAMES.map(m => `You are a ${m} star!` as const);

// ---------- Garage ----------
const GARAGE = ['Garage!', 'You built everything!', 'You can build something new!', 'Wow!', "That's the best one!"] as const;
/** The 15 Mods that cost Bolts (not the free defaults). */
type RungModName = Exclude<ModName, (typeof SLOTS)[number]['mods'][0]>;
type BoltsPhrase = `You need 1 more Bolt.` | `You need ${number} more Bolts.`;
type GaragePhrase = Of<typeof GARAGE> | BodyName | SlotName | ModName | `You got ${RungModName}!` | `You can get ${RungModName}!` | BoltsPhrase;
export const MAX_PRICE = 18;
/** "You need 4 more Bolts." */
export const needBolts = (n: number): BoltsPhrase => (n === 1 ? 'You need 1 more Bolt.' : `You need ${n} more Bolts.`);
const garagePhrases = (): GaragePhrase[] => {
  const rungMods = SLOTS.flatMap(s => s.mods.slice(1)) as RungModName[];
  return [
    ...GARAGE, ...Object.values(BODY_NAMES), ...SLOTS.map(s => s.name), ...SLOTS.flatMap(s => s.mods),
    ...rungMods.map(m => `You got ${m}!` as const), ...rungMods.map(m => `You can get ${m}!` as const),
    ...Array.from({ length: MAX_PRICE }, (_, i) => needBolts(i + 1)),
  ];
};

export type Phrase = Of<typeof LEARN> | MoneyPhrase | Of<typeof CHEERS> | Of<typeof ROUNDS> | IntroPhrase | Of<typeof PROGRESS> | ModePhrase | GaragePhrase | AmountPiece;

export const LEARN_PHRASES: readonly Phrase[] = [...LEARN, ...moneyPhrases()];

export const PHRASES: readonly Phrase[] = [...new Set<Phrase>([...LEARN_PHRASES, ...CHEERS, ...ROUNDS, ...introPhrases(), ...PROGRESS, ...modePhrases(), ...garagePhrases(), ...allAmountPieces()])];
