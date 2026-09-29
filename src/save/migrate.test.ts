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

describe('migrate: version 1 to 2', () => {
  it('gives an old save the 3 starter Bodies and keeps its fits', () => {
    const s = migrate({ version: 1, body: 'dragster', bolts: 40, unlocked: ['tires:3'], fitted: { dragster: { tires: 3 } } });
    expect(s.version).toBe(2);
    expect(s.ownedBodies).toEqual(['pickup', 'bigfoot', 'dragster']);
    expect(s.body).toBe('dragster');
    expect(s.bolts).toBe(40);
    expect(s.fitted.dragster.tires).toBe(3);
  });

  it('gives the new Bodies default fits', () => {
    const s = migrate({ version: 1 });
    expect(s.fitted.firetruck).toEqual({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 0 });
    expect(s.fitted.jeep).toEqual({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 0 });
  });

  it('shows the Legendaries locked', () => {
    const s = migrate({ version: 1, unlocked: ['horn:3'] });
    expect(s.unlocked).toEqual(['horn:3']);
  });
});

describe('migrate: Bodies and Legendaries', () => {
  it('keeps the Bodies he bought, and always the starters', () => {
    const s = migrate({ version: 2, ownedBodies: ['jeep', 'tank'], body: 'jeep' });
    expect(s.ownedBodies).toEqual(['pickup', 'bigfoot', 'dragster', 'jeep']);
    expect(s.body).toBe('jeep');
  });

  it('never has him driving a Body he does not own', () => {
    expect(migrate({ version: 2, ownedBodies: [], body: 'jeep' }).body).toBe('pickup');
  });

  it('keeps a Legendary he bought and fitted', () => {
    const s = migrate({ version: 2, unlocked: ['paint:3', 'paint:4'], fitted: { pickup: { paint: 4 }, bigfoot: { paint: 4 } } });
    expect(s.fitted.pickup.paint).toBe(4);
    const t = migrate({ version: 2, unlocked: [], fitted: { pickup: { paint: 4 } } });
    expect(t.fitted.pickup.paint).toBe(0);
  });

  it('keeps a locked Body as the Goal, but never a Legendary', () => {
    expect(migrate({ version: 2, goal: 'body:schoolbus' }).goal).toBe('body:schoolbus');
    expect(migrate({ version: 2, goal: 'body:schoolbus', ownedBodies: ['schoolbus'] }).goal).toBeNull();
    expect(migrate({ version: 2, goal: 'lights:4' }).goal).toBeNull();
  });
});
