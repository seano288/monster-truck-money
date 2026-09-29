import { describe, expect, it } from 'vitest';
import { ALL_MODS } from './catalog';
import { affordable, boltsNeeded, builtEverything, goalOf, priceOf, unlock, type Wallet } from './economy';

const wallet = (over: Partial<Wallet> = {}): Wallet => ({ bolts: 0, unlocked: [], goal: null, ...over });

describe('prices', () => {
  it('costs 3, 9 and 18 Bolts by Rung', () => {
    expect([priceOf('paint:1'), priceOf('paint:2'), priceOf('paint:3')]).toEqual([3, 9, 18]);
  });

  it('adds up to 150 Bolts for all 15 Mods', () => {
    expect(ALL_MODS).toHaveLength(15);
    expect(ALL_MODS.reduce((n, m) => n + priceOf(m), 0)).toBe(150);
  });
});

describe('unlock', () => {
  it('spends the Bolts and unlocks the Mod', () => {
    const w = unlock(wallet({ bolts: 10 }), 'tires:2');
    expect(w.bolts).toBe(1);
    expect(w.unlocked).toEqual(['tires:2']);
  });

  it('refuses a Mod he cannot afford', () => {
    expect(() => unlock(wallet({ bolts: 8 }), 'tires:2')).toThrow();
  });

  it('refuses a Mod that is already unlocked', () => {
    expect(() => unlock(wallet({ bolts: 20, unlocked: ['tires:2'] }), 'tires:2')).toThrow();
  });

  it('clears the Goal once it is unlocked', () => {
    expect(unlock(wallet({ bolts: 18, goal: 'horn:3' }), 'horn:3').goal).toBeNull();
    expect(unlock(wallet({ bolts: 18, goal: 'horn:3' }), 'horn:1').goal).toBe('horn:3');
  });
});

describe('the Goal', () => {
  it('defaults to the cheapest locked Mod', () => {
    expect(goalOf(wallet())).toBe('tires:1');
    expect(goalOf(wallet({ unlocked: ['tires:1', 'paint:1', 'decals:1', 'lights:1', 'horn:1'] }))).toBe('tires:2');
  });

  it('is the Mod he chose while it is still locked', () => {
    expect(goalOf(wallet({ goal: 'lights:3' }))).toBe('lights:3');
    expect(goalOf(wallet({ goal: 'lights:3', unlocked: ['lights:3'] }))).toBe('tires:1');
  });

  it('is gone once he has built everything', () => {
    const all = wallet({ unlocked: [...ALL_MODS] });
    expect(goalOf(all)).toBeNull();
    expect(builtEverything(all)).toBe(true);
    expect(builtEverything(wallet())).toBe(false);
  });

  it('says how many more Bolts he needs', () => {
    expect(boltsNeeded(wallet({ bolts: 5 }), 'paint:2')).toBe(4);
    expect(boltsNeeded(wallet({ bolts: 12 }), 'paint:2')).toBe(0);
  });
});

describe('affordable', () => {
  it('lists the locked Mods he has enough Bolts for', () => {
    expect(affordable(wallet({ bolts: 9, unlocked: ['tires:1'] }))).toEqual(['tires:2', 'paint:1', 'paint:2', 'decals:1', 'decals:2', 'lights:1', 'lights:2', 'horn:1', 'horn:2']);
    expect(affordable(wallet({ bolts: 2 }))).toEqual([]);
  });
});
