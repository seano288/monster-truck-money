// The Garage's parts: twelve Bodies (three starters, nine bought with Bolts), seven Slots, and in each Slot a free
// default plus four Mods: Rungs 1-3 bought with Bolts and a Legendary Rung 4 bought with money.
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
export const modId = (slot: SlotId, rung: BuyRung): ModId => `${slot}:${rung}`;
export const parseMod = (id: ModId) => { const [s, r] = id.split(':'); return { slot: s as SlotId, rung: Number(r) as BuyRung }; };
export const ALL_MODS: readonly ModId[] = SLOTS.flatMap(s => RUNGS.map(r => modId(s.id, r)));
export const isLegendary = (mod: ModId) => parseMod(mod).rung === LEGENDARY;

/** Something bought in the Garage: a Mod, or a Body that isn't a starter. */
export type BodyItem = `body:${BoughtBody}`;
export type Buyable = ModId | BodyItem;
export const bodyItem = (b: BoughtBody): BodyItem => `body:${b}`;
export const isBodyItem = (x: Buyable): x is BodyItem => x.startsWith('body:');
export const bodyOf = (x: BodyItem) => x.slice(5) as BoughtBody;
export const ALL_BUYABLES: readonly Buyable[] = [...ALL_MODS, ...BOUGHT_BODIES.map(bodyItem)];

export const slotById = (id: SlotId): Slot => SLOTS.find(s => s.id === id)!;
export const modName = (slot: SlotId, rung: Rung): ModName => slotById(slot).mods[rung];
export const buyableName = (x: Buyable): ModName | BodyName => {
  if (isBodyItem(x)) return BODY_NAMES[bodyOf(x)];
  const { slot, rung } = parseMod(x);
  return modName(slot, rung);
};

export type Fit = Record<SlotId, Rung>;
export const defaultFit = (): Fit => ({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 0, engine: 0, grille: 0 });
