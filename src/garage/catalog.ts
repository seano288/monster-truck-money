// The Garage's parts: twelve Bodies (three starters, nine bought with Bolts), ten Slots, and in each Slot a free
// default plus four Mods: Rungs 1-3 bought with Bolts and a Legendary Rung 4 bought with money. And twelve Colours.
export const BODY_IDS = [
  'pickup', 'bigfoot', 'dragster', 'firetruck', 'schoolbus', 'jeep', 'towtruck', 'dumptruck', 'police', 'icecream', 'tractor', 'racecar',
] as const;
export type BodyId = (typeof BODY_IDS)[number];
/** The Bodies he picks from on first launch, owned from the start. */
export const STARTER_BODIES = ['pickup', 'bigfoot', 'dragster'] as const satisfies readonly BodyId[];
export const BODY_NAMES = {
  pickup: 'Pickup', bigfoot: 'Big Foot', dragster: 'Dragster', firetruck: 'Fire Truck', schoolbus: 'School Bus', jeep: 'Jeep',
  towtruck: 'Tow Truck', dumptruck: 'Dump Truck', police: 'Police Truck', icecream: 'Ice Cream Truck', tractor: 'Tractor', racecar: 'Race Car',
} as const satisfies Record<BodyId, string>;
export type BodyName = (typeof BODY_NAMES)[BodyId];
export type StarterBody = (typeof STARTER_BODIES)[number];
export type BoughtBody = Exclude<BodyId, StarterBody>;
export const isStarter = (b: BodyId): b is StarterBody => (STARTER_BODIES as readonly BodyId[]).includes(b);
export const BOUGHT_BODIES = BODY_IDS.filter((b): b is BoughtBody => !isStarter(b));

export const SLOTS = [
  { id: 'tires', name: 'Tires', icon: '🛞', mods: ['Small', 'Chunky', 'Giant', 'Mega Spikes', 'Monster Treads'] },
  { id: 'paint', name: 'Paint', icon: '🎨', mods: ['Plain', 'Blue Blast', 'Fire Fade', 'Rainbow Chrome', 'Gold Flake'] },
  { id: 'decals', name: 'Decals', icon: '⚡', mods: ['No Decals', 'Stripes', 'Flames', 'Lightning', 'Skull & Wings'] },
  { id: 'lights', name: 'Lights', icon: '💡', mods: ['Basic', 'Fog Lights', 'Roof Bar', 'Glow Under', 'Laser Show'] },
  { id: 'horn', name: 'Horn', icon: '📣', mods: ['Beep', 'Honk', 'Air Horn', 'Roar', 'Train Horn'] },
  { id: 'engine', name: 'Engine', icon: '🔧', mods: ['Putt-Putt', 'Rumble', 'V8', 'Jet Turbine', 'Rocket'] },
  { id: 'grille', name: 'Grille', icon: '🦈', mods: ['Plain', 'Chrome Bars', 'Bull Bar', 'Shark Teeth', 'Dragon Jaw'] },
  { id: 'exhaust', name: 'Exhaust', icon: '💨', mods: ['Tailpipe', 'Twin Stacks', 'Smoke Stacks', 'Flame Stacks', 'Rainbow Blast'] },
  { id: 'topper', name: 'Roof Topper', icon: '🚩', mods: ['None', 'Antenna Flag', 'Spoiler', 'Bull Horns', 'Siren'] },
  { id: 'number', name: 'Door Number', icon: '#️⃣', mods: ['No Number', 'Plain', 'Outlined', 'Flaming', 'Glowing Gold'] },
] as const;
export type Slot = (typeof SLOTS)[number];
export type SlotId = Slot['id'];
export type SlotName = Slot['name'];
export type ModName = Slot['mods'][number];
/** 0 is the Slot's free default; 1-3 are the first, second and top Rung, bought with Bolts; 4 is Legendary, bought with money. */
export type Rung = 0 | 1 | 2 | 3 | 4;
export type BuyRung = Exclude<Rung, 0>;
export const RUNGS = [1, 2, 3, 4] as const;
export const BOLT_RUNGS = [1, 2, 3] as const;
export const LEGENDARY = 4;
/** The top Rung bought with Bolts: a Slot's Legendary waits on it. */
export const TOP = 3;

/** An unlockable Mod: its Slot and Rung. */
export type ModId = `${SlotId}:${BuyRung}`;
export const modId = <R extends BuyRung>(slot: SlotId, rung: R) => `${slot}:${rung}` as `${SlotId}:${R}`;
export const parseMod = (id: ModId) => { const [s, r] = id.split(':'); return { slot: s as SlotId, rung: Number(r) as BuyRung }; };
export const ALL_MODS: readonly ModId[] = SLOTS.flatMap(s => RUNGS.map(r => modId(s.id, r)));
export const isLegendary = (mod: ModId) => parseMod(mod).rung === LEGENDARY;

/**
 * The Colour of a Body's base coat, alongside Paint rather than a Slot of its own. Red is free and the rest cost
 * Bolts. It shows on Plain and Fire Fade (whose fire fades into its deep shade); the other Paint Rungs cover it.
 */
export const COLOURS = [
  { id: 'red', name: 'Red', hex: '#d62828', deep: '#a80000' },
  { id: 'orange', name: 'Orange', hex: '#ff7b1c', deep: '#b34700' },
  { id: 'yellow', name: 'Yellow', hex: '#ffd23f', deep: '#b88a00' },
  { id: 'lime', name: 'Lime', hex: '#9be22d', deep: '#4f8a00' },
  { id: 'green', name: 'Green', hex: '#2a9d4b', deep: '#0f5c26' },
  { id: 'teal', name: 'Teal', hex: '#1bb5a8', deep: '#08665e' },
  { id: 'sky', name: 'Sky Blue', hex: '#4cc3ff', deep: '#0f6fa8' },
  { id: 'navy', name: 'Navy', hex: '#1f3a8a', deep: '#0b1a4d' },
  { id: 'purple', name: 'Purple', hex: '#8e44d9', deep: '#4b1a85' },
  { id: 'pink', name: 'Pink', hex: '#ff6fb5', deep: '#b3246b' },
  { id: 'black', name: 'Black', hex: '#23262b', deep: '#0b0c0e' },
  { id: 'white', name: 'White', hex: '#f2f4f7', deep: '#9aa3b0' },
] as const;
export type Colour = (typeof COLOURS)[number];
export type ColourId = Colour['id'];
export type ColourName = Colour['name'];
export const FREE_COLOUR = 'red' satisfies ColourId;
export type BoughtColour = Exclude<ColourId, typeof FREE_COLOUR>;
export const BOUGHT_COLOURS = COLOURS.map(c => c.id).filter((c): c is BoughtColour => c !== FREE_COLOUR);
export const colourById = (id: ColourId): Colour => COLOURS.find(c => c.id === id)!;
/** Plain and Fire Fade show the Body's Colour. */
export const paintShowsColour = (paint: Rung) => paint === 0 || paint === 2;

/** Something bought in the Garage: a Mod, a Body that isn't a starter, or a Colour that isn't free. */
export type BodyItem = `body:${BoughtBody}`;
export type ColourItem = `colour:${BoughtColour}`;
export type Buyable = ModId | BodyItem | ColourItem;
export const bodyItem = (b: BoughtBody): BodyItem => `body:${b}`;
export const isBodyItem = (x: Buyable): x is BodyItem => x.startsWith('body:');
export const bodyOf = (x: BodyItem) => x.slice(5) as BoughtBody;
export const colourItem = (c: BoughtColour): ColourItem => `colour:${c}`;
export const isColourItem = (x: Buyable): x is ColourItem => x.startsWith('colour:');
export const colourOf = (x: ColourItem) => x.slice(7) as BoughtColour;
export const isModItem = (x: Buyable): x is ModId => !isBodyItem(x) && !isColourItem(x);
export const ALL_BUYABLES: readonly Buyable[] = [...ALL_MODS, ...BOUGHT_BODIES.map(bodyItem), ...BOUGHT_COLOURS.map(colourItem)];

export const slotById = (id: SlotId): Slot => SLOTS.find(s => s.id === id)!;
export const modName = (slot: SlotId, rung: Rung): ModName => slotById(slot).mods[rung];
export const buyableName = (x: Buyable): ModName | BodyName | ColourName => {
  if (isBodyItem(x)) return BODY_NAMES[bodyOf(x)];
  if (isColourItem(x)) return colourById(colourOf(x)).name;
  const { slot, rung } = parseMod(x);
  return modName(slot, rung);
};

/** The racing number on the door, which he picks himself. The Door Number Slot's Mods are its style. */
export const MIN_DOOR_NUMBER = 0, MAX_DOOR_NUMBER = 99, DEFAULT_DOOR_NUMBER = 1;
export const isDoorNumber = (n: unknown): n is number => Number.isInteger(n) && (n as number) >= MIN_DOOR_NUMBER && (n as number) <= MAX_DOOR_NUMBER;

/** The Mods fitted on a Body, the number on its door and its Colour. */
export type Fit = Record<SlotId, Rung> & { doorNumber: number; colour: ColourId };
export const defaultFit = (): Fit => ({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 0, engine: 0, grille: 0, exhaust: 0, topper: 0, number: 0, doorNumber: DEFAULT_DOOR_NUMBER, colour: FREE_COLOUR });
