// The single typed list of everything the game says. tools/make_voice.py records a clip for each entry,
// and the build fails if any is missing. say() accepts only these phrases (and amounts, joined from pieces).
import { BODY_NAMES, BOUGHT_BODIES, MAX_DOOR_NUMBER, MIN_DOOR_NUMBER, SLOTS, type BodyName, type BoughtBody, type ModName, type SlotName } from '../garage/catalog';
import { PRICES } from '../garage/economy';
import { MONEY, MONEY_NAMES, MONEY_VALUES, type MoneyKey, type MoneyName, type MoneyValue } from '../money/money';
import { MODE_IDS, MODE_NAMES, type ModeId, type ModeName } from '../modes/ids';
import { SHOP_ITEMS, type ShopItem } from '../modes/pay/pay';
import { MAX_BOLTS } from '../round/rules';
import { DAYS, TROPHIES, type RoundsN, type StreakN, type TrophyStep } from '../trophies/trophies';
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

type BuyPhrase = `Buy the ${ShopItem['name']}!`;
const buyPhrases = (): BuyPhrase[] => SHOP_ITEMS.map(i => `Buy the ${i.name}!` as const);

// ---------- introduction card ----------
const INTRO = ['Look!', 'New money!'] as const;
type IntroPhrase = Of<typeof INTRO> | `This is a ${MoneyName}.` | `It is worth ${MoneyValue}.`;
const introPhrases = (): IntroPhrase[] => [...INTRO, ...MONEY_NAMES.map(m => `This is a ${m}.` as const), ...MONEY_VALUES.map(v => `It is worth ${v}.` as const)];

// ---------- progress and end of Round ----------
const PROGRESS = ['Level up!', 'Now you get quarters!', 'Now you get dollar bills!'] as const;
type EarnedPhrase = 'You earned 1 Bolt!' | `You earned ${number} Bolts!`;
/** "You earned 4 Bolts!" */
export const earnedBolts = (n: number): EarnedPhrase => (n === 1 ? 'You earned 1 Bolt!' : `You earned ${n} Bolts!`);
const earnedPhrases = () => Array.from({ length: MAX_BOLTS }, (_, i) => earnedBolts(i + 1));
type ModePhrase = `You are a ${ModeName} star!` | `You opened ${ModeName}!`;
const modePhrases = (): ModePhrase[] => MODE_NAMES.flatMap(m => [`You are a ${m} star!`, `You opened ${m}!`] as const);
/** Tapping a locked mode's tile. */
export const LOCKED_HINTS = ['Learn more coins to open this!', 'Count more cash to open this!'] as const;

// ---------- Garage ----------
const GARAGE = ['Garage!', 'You built everything!', 'You can build something new!', 'Wow!', "That's the best one!"] as const;
type Mods<I extends number> = (typeof SLOTS)[number]['mods'][I];
/** The 15 Mods that cost Bolts (not the free defaults or the Legendaries), the top ones, and the Legendaries. */
type BoltModName = Mods<1 | 2 | 3>;
type TopModName = Mods<3>;
type LegendaryName = Mods<4>;
type BoughtBodyName = (typeof BODY_NAMES)[BoughtBody];
type BoltsPhrase = `You need 1 more Bolt.` | `You need ${number} more Bolts.`;
type GaragePhrase = Of<typeof GARAGE> | BodyName | SlotName | ModName | `You got ${BoltModName | BoughtBodyName}!` | `You can get ${BoltModName | BoughtBodyName}!`
  | `${LegendaryName} costs` | `You bought ${LegendaryName}!` | `Get ${TopModName} first!` | BoltsPhrase | NumberPhrase;
/** The most Bolts anything costs. */
export const MAX_PRICE = Math.max(...Object.values(PRICES.rungs), ...Object.values(PRICES.bodies));
/** "You need 4 more Bolts." */
export const needBolts = (n: number): BoltsPhrase => (n === 1 ? 'You need 1 more Bolt.' : `You need ${n} more Bolts.`);
/** "42!": the Door Number, read aloud as he turns the wheels. */
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type NumberPhrase = `${Digit}!` | `${Exclude<Digit, 0>}${Digit}!`;
export const numberLine = (n: number) => `${n}!` as NumberPhrase;
const numberPhrases = () => Array.from({ length: MAX_DOOR_NUMBER - MIN_DOOR_NUMBER + 1 }, (_, i) => numberLine(MIN_DOOR_NUMBER + i));
const garagePhrases = (): GaragePhrase[] => {
  const boltMods = SLOTS.flatMap(s => s.mods.slice(1, 4)) as BoltModName[];
  const legendaries = SLOTS.map(s => s.mods[4]), tops = SLOTS.map(s => s.mods[3]);
  const bought = [...boltMods, ...BOUGHT_BODIES.map(b => BODY_NAMES[b])];
  return [
    ...GARAGE, ...Object.values(BODY_NAMES), ...SLOTS.map(s => s.name), ...SLOTS.flatMap(s => s.mods),
    ...bought.map(m => `You got ${m}!` as const), ...bought.map(m => `You can get ${m}!` as const),
    ...legendaries.map(m => `${m} costs` as const), ...legendaries.map(m => `You bought ${m}!` as const), ...tops.map(m => `Get ${m} first!` as const),
    ...Array.from({ length: MAX_PRICE }, (_, i) => needBolts(i + 1)), ...numberPhrases(),
  ];
};

// ---------- Trophies ----------
export type TrophyName = `${ModeName} Level ${2 | 3}` | `${ModeName} Star` | `${StreakN} in a Row` | 'Perfect Round' | `${RoundsN} Rounds` | `${typeof DAYS} Days`;
/** Read aloud when he taps a trophy he hasn't earned yet. */
type TrophyHint = `Reach Level ${2 | 3} in ${ModeName}!` | `Be a ${ModeName} star!` | `Get ${StreakN} right in a row on the first try!`
  | 'Get every answer right on the first try in one Round!' | `Finish ${RoundsN} Rounds!` | `Play on ${typeof DAYS} different days!`;
type TrophyPhrase = 'Trophies!' | TrophyName | TrophyHint | `You earned ${TrophyName}!`;
const modeName = (m: ModeId) => MODE_NAMES[MODE_IDS.indexOf(m)]!;
/** "10 in a Row" */
export function trophyName(s: TrophyStep): TrophyName {
  switch (s.kind) {
    case 'level': return `${modeName(s.mode)} Level ${s.level}`;
    case 'star': return `${modeName(s.mode)} Star`;
    case 'streak': return `${s.n} in a Row`;
    case 'perfect': return 'Perfect Round';
    case 'rounds': return `${s.n} Rounds`;
    case 'days': return `${s.n} Days`;
  }
}
/** "Get 10 right in a row on the first try!" */
export function trophyHint(s: TrophyStep): TrophyHint {
  switch (s.kind) {
    case 'level': return `Reach Level ${s.level} in ${modeName(s.mode)}!`;
    case 'star': return `Be a ${modeName(s.mode)} star!`;
    case 'streak': return `Get ${s.n} right in a row on the first try!`;
    case 'perfect': return 'Get every answer right on the first try in one Round!';
    case 'rounds': return `Finish ${s.n} Rounds!`;
    case 'days': return `Play on ${s.n} different days!`;
  }
}
/** "You earned 10 in a Row!" */
export const earnedTrophy = (s: TrophyStep) => `You earned ${trophyName(s)}!` as const;
const trophyPhrases = (): TrophyPhrase[] => ['Trophies!', ...TROPHIES.flatMap(t => t.steps).flatMap(s => [trophyName(s), trophyHint(s), earnedTrophy(s)])];

// ---------- Show Off ----------
const SHOW = ['Show time!'] as const;

export type Phrase = Of<typeof LEARN> | MoneyPhrase | Of<typeof CHEERS> | Of<typeof ROUNDS> | BuyPhrase | IntroPhrase | Of<typeof PROGRESS> | EarnedPhrase | ModePhrase | Of<typeof LOCKED_HINTS> | GaragePhrase | Of<typeof SHOW> | TrophyPhrase | AmountPiece;

export const LEARN_PHRASES: readonly Phrase[] = [...LEARN, ...moneyPhrases()];
export const PAY_PHRASES: readonly Phrase[] = [...buyPhrases(), 'It costs', 'Tap some money first!', 'Almost!', 'You need', 'more', 'Too much!', 'Take back', 'Tap a coin to hear its name.', 'Count more cash to open this!'];
export const COUNT_PHRASES: readonly Phrase[] = ['How much money is this?', 'Not quite!', "Let's count together.", 'Tap a coin to hear its name.', 'Learn more coins to open this!'];

export const PHRASES: readonly Phrase[] = [...new Set<Phrase>([...LEARN_PHRASES, ...CHEERS, ...ROUNDS, ...buyPhrases(), ...introPhrases(), ...PROGRESS, ...earnedPhrases(), ...modePhrases(), ...LOCKED_HINTS, ...garagePhrases(), ...SHOW, ...trophyPhrases(), ...allAmountPieces()])];
