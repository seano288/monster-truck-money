import { describe, expect, it } from 'vitest';
import { freshSave, migrate, SAVE_VERSION } from './migrate';

describe('migrate', () => {
  it('starts fresh when there is no save', () => {
    expect(migrate(null)).toEqual(freshSave());
    expect(freshSave()).toMatchObject({ version: SAVE_VERSION, bolts: 0, lastMode: 'learn' });
  });

  it('starts fresh from something that is not a save', () => {
    expect(migrate('hello')).toEqual(freshSave());
    expect(migrate({ bolts: 7 })).toEqual(freshSave());
  });

  it('keeps a current save as it is', () => {
    const s = { ...freshSave(), bolts: 12, lastMode: 'learn' as const };
    expect(migrate(JSON.parse(JSON.stringify(s)))).toEqual(s);
  });

  it('reads what it can from a newer save rather than wiping it', () => {
    expect(migrate({ version: 99, bolts: 7 }).bolts).toBe(7);
  });

  it('fills in what a save is missing and drops what is broken', () => {
    const s = migrate({ version: 1, bolts: -4, lastMode: 'race', modes: { learn: { level: 7 } } });
    expect(s.bolts).toBe(0);
    expect(s.lastMode).toBe('learn');
    expect(s.modes.learn.level).toBe(1);
  });
});

describe('migrate: the Garage', () => {
  it('keeps the chosen Body, the Mods and the Goal', () => {
    const s = migrate({ version: 1, body: 'bigfoot', unlocked: ['paint:1', 'tires:2'], goal: 'horn:3', fitted: { bigfoot: { paint: 1, tires: 2 } } });
    expect(s.body).toBe('bigfoot');
    expect(s.unlocked).toEqual(['paint:1', 'tires:2']);
    expect(s.goal).toBe('horn:3');
    expect(s.fitted.bigfoot).toMatchObject({ paint: 1, tires: 2, horn: 0 });
    expect(s.fitted.pickup).toMatchObject({ paint: 0, tires: 0 });
  });

  it('never has a Mod fitted that is not unlocked', () => {
    const s = migrate({ version: 1, unlocked: [], fitted: { pickup: { paint: 3 } } });
    expect(s.fitted.pickup.paint).toBe(0);
  });

  it('drops a Goal that is already unlocked, and unknown Mods', () => {
    const s = migrate({ version: 1, unlocked: ['paint:1', 'wings:9'], goal: 'paint:1' });
    expect(s.unlocked).toEqual(['paint:1']);
    expect(s.goal).toBeNull();
  });
});
