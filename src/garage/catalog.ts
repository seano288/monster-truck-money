// The Garage's parts: three Bodies, five Slots, and in each Slot a free default plus three Mods (Rungs 1-3).
export const BODY_IDS = ['pickup', 'bigfoot', 'dragster'] as const;
export type BodyId = (typeof BODY_IDS)[number];
export const BODY_NAMES = { pickup: 'Pickup', bigfoot: 'Big Foot', dragster: 'Dragster' } as const satisfies Record<BodyId, string>;
export type BodyName = (typeof BODY_NAMES)[BodyId];

export const SLOTS = [
  { id: 'tires', name: 'Tires', icon: '🛞', mods: ['Small', 'Chunky', 'Giant', 'Mega Spikes'] },
  { id: 'paint', name: 'Paint', icon: '🎨', mods: ['Plain', 'Blue Blast', 'Fire Fade', 'Rainbow Chrome'] },
  { id: 'decals', name: 'Decals', icon: '⚡', mods: ['No Decals', 'Stripes', 'Flames', 'Lightning'] },
  { id: 'lights', name: 'Lights', icon: '💡', mods: ['Basic', 'Fog Lights', 'Roof Bar', 'Glow Under'] },
  { id: 'horn', name: 'Horn', icon: '📣', mods: ['Beep', 'Honk', 'Air Horn', 'Roar'] },
] as const;
export type Slot = (typeof SLOTS)[number];
export type SlotId = Slot['id'];
export type SlotName = Slot['name'];
export type ModName = Slot['mods'][number];
/** 0 is the Slot's free default; 1-3 are the first, second and top Rung. */
export type Rung = 0 | 1 | 2 | 3;
export const RUNGS = [1, 2, 3] as const;

/** An unlockable Mod: its Slot and Rung. */
export type ModId = `${SlotId}:${1 | 2 | 3}`;
export const modId = (slot: SlotId, rung: 1 | 2 | 3): ModId => `${slot}:${rung}`;
export const parseMod = (id: ModId) => { const [s, r] = id.split(':'); return { slot: s as SlotId, rung: Number(r) as 1 | 2 | 3 }; };
export const ALL_MODS: readonly ModId[] = SLOTS.flatMap(s => RUNGS.map(r => modId(s.id, r)));

export const slotById = (id: SlotId): Slot => SLOTS.find(s => s.id === id)!;
export const modName = (slot: SlotId, rung: Rung): ModName => slotById(slot).mods[rung];

export type Fit = Record<SlotId, Rung>;
export const defaultFit = (): Fit => ({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 0 });
