import { describe, expect, it } from 'vitest';
import { ALL_MODS, bodyItem, isLegendary } from './catalog';
import { affordable, boltsNeeded, builtEverything, goalOf, nextLegendary, priceOf, unlock, waitingOn, type Wallet } from './economy';

const wallet = (over: Partial<Wallet> = {}): Wallet => ({ bolts: 0, unlocked: [], ownedBodies: ['pickup', 'bigfoot', 'dragster'], goal: null, ...over });

describe('prices', () => {
  it('costs 5, 15 and 30 Bolts by Rung', () => {
    expect([priceOf('paint:1'), priceOf('paint:2'), priceOf('paint:3')]).toEqual([{ bolts: 5 }, { bolts: 15 }, { bolts: 30 }]);
  });

  it('adds up to 400 Bolts for the 24 Bolt Mods', () => {
    const boltMods = ALL_MODS.filter(m => !isLegendary(m));
    expect(boltMods).toHaveLength(24);
    expect(boltMods.reduce((n, m) => n + (priceOf(m).bolts ?? 0), 0)).toBe(400);
  });

  it('prices the Tires, Paint, Decals, Lights and Horn Legendaries in money, from $1.35 to $4.80', () => {
    expect(['tires:4', 'paint:4', 'decals:4', 'lights:4', 'horn:4'].map(m => priceOf(m as 'tires:4'))).toEqual([
      { cents: 135 }, { cents: 210 }, { cents: 275 }, { cents: 360 }, { cents: 480 },
    ]);
  });

  it('prices the Engine Legendary, Rocket, at $3.95', () => {
    expect(priceOf('engine:4')).toEqual({ cents: 395 });
    expect([priceOf('engine:1'), priceOf('engine:2'), priceOf('engine:3')]).toEqual([{ bolts: 5 }, { bolts: 15 }, { bolts: 30 }]);
  });

  it('prices the Grille Legendary, Dragon Jaw, at $2.45', () => {
    expect(priceOf('grille:4')).toEqual({ cents: 245 });
    expect([priceOf('grille:1'), priceOf('grille:2'), priceOf('grille:3')]).toEqual([{ bolts: 5 }, { bolts: 15 }, { bolts: 30 }]);
  });

  it('prices the Exhaust Legendary, Rainbow Blast, at $3.20', () => {
    expect(priceOf('exhaust:4')).toEqual({ cents: 320 });
    expect([priceOf('exhaust:1'), priceOf('exhaust:2'), priceOf('exhaust:3')]).toEqual([{ bolts: 5 }, { bolts: 15 }, { bolts: 30 }]);
  });

  it('costs 50, 75 and 100 Bolts for the new Bodies', () => {
    expect([priceOf('body:firetruck'), priceOf('body:schoolbus'), priceOf('body:jeep')]).toEqual([{ bolts: 50 }, { bolts: 75 }, { bolts: 100 }]);
  });

  it('costs 125 up to 300 Bolts for the second batch of Bodies', () => {
    const bodies = ['towtruck', 'dumptruck', 'police', 'icecream', 'tractor', 'racecar'] as const;
    expect(bodies.map(b => priceOf(bodyItem(b)).bolts)).toEqual([125, 150, 175, 200, 250, 300]);
  });
});

describe('unlock', () => {
  const BOLTS = { kind: 'bolts' } as const;
  const cash = (cents: number) => ({ kind: 'cash', cents }) as const;

  it('spends the Bolts and unlocks the Mod', () => {
    const w = unlock(wallet({ bolts: 16 }), 'tires:2', BOLTS);
    expect(w.bolts).toBe(1);
    expect(w.unlocked).toEqual(['tires:2']);
  });

  it('refuses a Mod he cannot afford', () => {
    expect(() => unlock(wallet({ bolts: 8 }), 'tires:2', BOLTS)).toThrow();
  });

  it('refuses a Mod that is already unlocked', () => {
    expect(() => unlock(wallet({ bolts: 20, unlocked: ['tires:2'] }), 'tires:2', BOLTS)).toThrow();
  });

  it('clears the Goal once it is unlocked', () => {
    expect(unlock(wallet({ bolts: 30, goal: 'horn:3' }), 'horn:3', BOLTS).goal).toBeNull();
    expect(unlock(wallet({ bolts: 30, goal: 'horn:3' }), 'horn:1', BOLTS).goal).toBe('horn:3');
  });

  it('buys a Body with Bolts', () => {
    const w = unlock(wallet({ bolts: 80, goal: 'body:schoolbus' }), 'body:schoolbus', BOLTS);
    expect(w.bolts).toBe(5);
    expect(w.ownedBodies).toEqual(['pickup', 'bigfoot', 'dragster', 'schoolbus']);
    expect(w.unlocked).toEqual([]);
    expect(w.goal).toBeNull();
    expect(() => unlock(w, 'body:schoolbus', BOLTS)).toThrow();
    expect(() => unlock(wallet({ bolts: 44 }), 'body:schoolbus', BOLTS)).toThrow();
  });

  it('unlocks a Legendary only for the exact money, once the top Rung is unlocked', () => {
    const ready = wallet({ bolts: 99, unlocked: ['tires:3'] });
    const w = unlock(ready, 'tires:4', cash(135));
    expect(w.unlocked).toEqual(['tires:3', 'tires:4']);
    expect(w.bolts).toBe(99); // money, not Bolts
    expect(() => unlock(ready, 'tires:4', cash(130))).toThrow();
    expect(() => unlock(ready, 'tires:4', cash(140))).toThrow();
    expect(() => unlock(ready, 'tires:4', BOLTS)).toThrow();
    expect(() => unlock(wallet({ unlocked: ['tires:1', 'tires:2'] }), 'tires:4', cash(135))).toThrow();
  });

  it('never takes money for a Bolt Mod', () => {
    expect(() => unlock(wallet({ bolts: 99 }), 'tires:1', cash(3))).toThrow();
  });
});

describe('a Legendary', () => {
  it('waits on the top Rung in its Slot', () => {
    expect(waitingOn(wallet({ unlocked: ['paint:1'] }), 'paint:4')).toBe('paint:3');
    expect(waitingOn(wallet({ unlocked: ['paint:3'] }), 'paint:4')).toBeNull();
    expect(waitingOn(wallet(), 'paint:2')).toBeNull();
  });
});

describe('the Goal', () => {
  const allBoltMods = ALL_MODS.filter(m => !isLegendary(m));

  it('defaults to the cheapest locked Mod', () => {
    expect(goalOf(wallet())).toBe('tires:1');
    expect(goalOf(wallet({ unlocked: ['tires:1', 'paint:1', 'decals:1', 'lights:1', 'horn:1'] }))).toBe('engine:1');
    expect(goalOf(wallet({ unlocked: ['tires:1', 'paint:1', 'decals:1', 'lights:1', 'horn:1', 'engine:1'] }))).toBe('grille:1');
    expect(goalOf(wallet({ unlocked: ['tires:1', 'paint:1', 'decals:1', 'lights:1', 'horn:1', 'engine:1', 'grille:1'] }))).toBe('exhaust:1');
    expect(goalOf(wallet({ unlocked: ['tires:1', 'paint:1', 'decals:1', 'lights:1', 'horn:1', 'engine:1', 'grille:1', 'exhaust:1'] }))).toBe('tires:2');
  });

  it('is the Mod or Body he chose while it is still locked', () => {
    expect(goalOf(wallet({ goal: 'lights:3' }))).toBe('lights:3');
    expect(goalOf(wallet({ goal: 'lights:3', unlocked: ['lights:3'] }))).toBe('tires:1');
    expect(goalOf(wallet({ goal: 'body:jeep' }))).toBe('body:jeep');
  });

  it('is never a Legendary, which is bought with money', () => {
    expect(goalOf(wallet({ goal: 'horn:4', unlocked: ['horn:3'] }))).toBe('tires:1');
    expect(goalOf(wallet({ unlocked: allBoltMods }))).toBe('body:firetruck');
  });

  it('moves on to the next Body once the Mods are bought', () => {
    expect(goalOf(wallet({ unlocked: allBoltMods, ownedBodies: ['pickup', 'bigfoot', 'dragster', 'firetruck'] }))).toBe('body:schoolbus');
  });

  it('moves on to the second batch, cheapest first, once the first Bodies are his', () => {
    const first = ['pickup', 'bigfoot', 'dragster', 'firetruck', 'schoolbus', 'jeep'] as const;
    expect(goalOf(wallet({ unlocked: allBoltMods, ownedBodies: first }))).toBe('body:towtruck');
    expect(goalOf(wallet({ unlocked: allBoltMods, ownedBodies: [...first, 'towtruck', 'dumptruck', 'police', 'icecream', 'tractor'] }))).toBe('body:racecar');
  });

  it('is gone once he has built everything, Legendaries and Bodies too', () => {
    const bodies = ['pickup', 'bigfoot', 'dragster', 'firetruck', 'schoolbus', 'jeep', 'towtruck', 'dumptruck', 'police', 'icecream', 'tractor', 'racecar'] as const;
    expect(goalOf(wallet({ unlocked: allBoltMods, ownedBodies: bodies }))).toBeNull();
    expect(builtEverything(wallet({ unlocked: allBoltMods, ownedBodies: bodies }))).toBe(false);
    expect(builtEverything(wallet({ unlocked: [...ALL_MODS] }))).toBe(false);
    expect(builtEverything(wallet({ unlocked: [...ALL_MODS], ownedBodies: bodies }))).toBe(true);
    expect(builtEverything(wallet({ unlocked: ALL_MODS.filter(m => !m.startsWith('engine:')), ownedBodies: bodies }))).toBe(false);
    expect(builtEverything(wallet({ unlocked: ALL_MODS.filter(m => m !== 'grille:4'), ownedBodies: bodies }))).toBe(false);
    expect(builtEverything(wallet({ unlocked: ALL_MODS.filter(m => m !== 'exhaust:4'), ownedBodies: bodies }))).toBe(false);
    expect(builtEverything(wallet({ unlocked: [...ALL_MODS], ownedBodies: bodies.filter(b => b !== 'racecar') }))).toBe(false);
    expect(builtEverything(wallet())).toBe(false);
  });

  it('says how many more Bolts he needs', () => {
    expect(boltsNeeded(wallet({ bolts: 5 }), 'paint:2')).toBe(10);
    expect(boltsNeeded(wallet({ bolts: 15 }), 'paint:2')).toBe(0);
    expect(boltsNeeded(wallet({ bolts: 12 }), 'body:firetruck')).toBe(38);
  });
});

describe('affordable', () => {
  it('lists the locked Mods and Bodies he has enough Bolts for, never a Legendary', () => {
    expect(affordable(wallet({ bolts: 15, unlocked: ['tires:1'] }))).toEqual(['tires:2', 'paint:1', 'paint:2', 'decals:1', 'decals:2', 'lights:1', 'lights:2', 'horn:1', 'horn:2', 'engine:1', 'engine:2', 'grille:1', 'grille:2', 'exhaust:1', 'exhaust:2']);
    expect(affordable(wallet({ bolts: 4 }))).toEqual([]);
    expect(affordable(wallet({ bolts: 50, unlocked: ALL_MODS.filter(m => !isLegendary(m)) }))).toEqual(['body:firetruck']);
  });
});

describe('the next Legendary', () => {
  it('is the cheapest one still to buy, whether or not it is waiting', () => {
    expect(nextLegendary(wallet())).toBe('tires');
    expect(nextLegendary(wallet({ unlocked: ['tires:4', 'paint:4'] }))).toBe('grille');
    expect(nextLegendary(wallet({ unlocked: ['tires:4', 'grille:4', 'paint:4'] }))).toBe('decals');
    expect(nextLegendary(wallet({ unlocked: ['tires:4', 'grille:4', 'paint:4', 'decals:4'] }))).toBe('exhaust');
    expect(nextLegendary(wallet({ unlocked: ALL_MODS.filter(isLegendary) }))).toBeNull();
  });
});
