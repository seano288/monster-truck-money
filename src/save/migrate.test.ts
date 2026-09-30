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
    expect(s.version).toBe(SAVE_VERSION);
    expect(s.ownedBodies).toEqual(['pickup', 'bigfoot', 'dragster']);
    expect(s.body).toBe('dragster');
    expect(s.bolts).toBe(40);
    expect(s.fitted.dragster.tires).toBe(3);
  });

  it('gives the new Bodies default fits', () => {
    const s = migrate({ version: 1 });
    expect(s.fitted.firetruck).toEqual({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 0, engine: 0, grille: 0, exhaust: 0, topper: 0, number: 0, doorNumber: 1 });
    expect(s.fitted.jeep).toEqual({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 0, engine: 0, grille: 0, exhaust: 0, topper: 0, number: 0, doorNumber: 1 });
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

describe('migrate: the Engine Slot', () => {
  it('loads a save from before the Engine with its fits kept and the Engine on Putt-Putt', () => {
    const old = { version: 2, bolts: 9, unlocked: ['horn:3', 'horn:4'], fitted: { pickup: { tires: 0, paint: 0, decals: 0, lights: 0, horn: 4 } } };
    const s = migrate(old);
    expect(s.version).toBe(SAVE_VERSION);
    expect(s.bolts).toBe(9);
    expect(s.unlocked).toEqual(['horn:3', 'horn:4']);
    expect(s.fitted.pickup).toEqual({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 4, engine: 0, grille: 0, exhaust: 0, topper: 0, number: 0, doorNumber: 1 });
  });

  it('keeps an Engine Mod he unlocked and fitted', () => {
    const s = migrate({ version: 2, unlocked: ['engine:2'], fitted: { jeep: { engine: 2 } } });
    expect(s.fitted.jeep.engine).toBe(2);
  });
});

describe('migrate: the Grille Slot', () => {
  it('loads a save from before the Grille with its fits kept and the Grille on Plain', () => {
    const old = { version: SAVE_VERSION, bolts: 12, unlocked: ['tires:2', 'paint:1', 'lights:3', 'engine:1'], fitted: { jeep: { tires: 2, paint: 1, decals: 0, lights: 3, horn: 0, engine: 1 } } };
    const s = migrate(old);
    expect(s.version).toBe(SAVE_VERSION);
    expect(s.bolts).toBe(12);
    expect(s.unlocked).toEqual(['tires:2', 'paint:1', 'lights:3', 'engine:1']);
    expect(s.fitted.jeep).toEqual({ tires: 2, paint: 1, decals: 0, lights: 3, horn: 0, engine: 1, grille: 0, exhaust: 0, topper: 0, number: 0, doorNumber: 1 });
    expect(s.fitted.pickup.grille).toBe(0);
  });

  it('keeps a Grille Mod he unlocked and fitted', () => {
    const s = migrate({ version: SAVE_VERSION, unlocked: ['grille:3'], fitted: { tractor: { grille: 3 } } });
    expect(s.fitted.tractor.grille).toBe(3);
  });
});

describe('migrate: the Exhaust Slot', () => {
  it('loads a save from before the Exhaust with its fits kept and the Exhaust on Tailpipe', () => {
    const old = { version: SAVE_VERSION, bolts: 7, unlocked: ['grille:3', 'grille:4', 'tires:1'], fitted: { racecar: { tires: 1, paint: 0, decals: 0, lights: 0, horn: 0, engine: 0, grille: 4 } } };
    const s = migrate(old);
    expect(s.version).toBe(SAVE_VERSION);
    expect(s.bolts).toBe(7);
    expect(s.unlocked).toEqual(['grille:3', 'grille:4', 'tires:1']);
    expect(s.fitted.racecar).toEqual({ tires: 1, paint: 0, decals: 0, lights: 0, horn: 0, engine: 0, grille: 4, exhaust: 0, topper: 0, number: 0, doorNumber: 1 });
    expect(s.fitted.pickup.exhaust).toBe(0);
  });

  it('keeps an Exhaust Mod he unlocked and fitted', () => {
    const s = migrate({ version: SAVE_VERSION, unlocked: ['exhaust:3'], fitted: { dragster: { exhaust: 3 } } });
    expect(s.fitted.dragster.exhaust).toBe(3);
  });
});

describe('migrate: the Roof Topper Slot', () => {
  it('loads a save from before the Roof Topper with its fits kept and no Topper fitted', () => {
    const old = { version: SAVE_VERSION, bolts: 3, unlocked: ['exhaust:1', 'lights:2'], fitted: { police: { tires: 0, paint: 0, decals: 0, lights: 2, horn: 0, engine: 0, grille: 0, exhaust: 1 } } };
    const s = migrate(old);
    expect(s.version).toBe(SAVE_VERSION);
    expect(s.bolts).toBe(3);
    expect(s.unlocked).toEqual(['exhaust:1', 'lights:2']);
    expect(s.fitted.police).toEqual({ tires: 0, paint: 0, decals: 0, lights: 2, horn: 0, engine: 0, grille: 0, exhaust: 1, topper: 0, number: 0, doorNumber: 1 });
    expect(s.fitted.pickup.topper).toBe(0);
  });

  it('keeps a Roof Topper he unlocked and fitted', () => {
    const s = migrate({ version: SAVE_VERSION, unlocked: ['topper:4'], fitted: { racecar: { topper: 4 } } });
    expect(s.fitted.racecar.topper).toBe(4);
  });
});

describe('migrate: the Door Number', () => {
  it('loads a save from before the Door Number with its fits kept, no number style fitted and number 1 on every door', () => {
    const old = { version: SAVE_VERSION, unlocked: ['topper:2'], fitted: { jeep: { tires: 0, paint: 0, decals: 0, lights: 0, horn: 0, engine: 0, grille: 0, exhaust: 0, topper: 2 } } };
    const s = migrate(old);
    expect(s.fitted.jeep).toEqual({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 0, engine: 0, grille: 0, exhaust: 0, topper: 2, number: 0, doorNumber: 1 });
    expect(s.fitted.pickup.doorNumber).toBe(1);
  });

  it('keeps a different number on each Body', () => {
    const s = migrate({ version: SAVE_VERSION, unlocked: ['number:2'], fitted: { pickup: { number: 2, doorNumber: 42 }, bigfoot: { doorNumber: 7 }, racecar: { doorNumber: 0 } } });
    expect([s.fitted.pickup.doorNumber, s.fitted.bigfoot.doorNumber, s.fitted.racecar.doorNumber, s.fitted.jeep.doorNumber]).toEqual([42, 7, 0, 1]);
    expect(s.fitted.pickup.number).toBe(2);
  });

  it('reads a number that is not 0 to 99 as 1', () => {
    const s = migrate({ version: SAVE_VERSION, fitted: { pickup: { doorNumber: 100 }, bigfoot: { doorNumber: -1 }, dragster: { doorNumber: 4.5 }, jeep: { doorNumber: '42' }, police: { doorNumber: 99 } } });
    expect([s.fitted.pickup, s.fitted.bigfoot, s.fitted.dragster, s.fitted.jeep, s.fitted.police].map(f => f.doorNumber)).toEqual([1, 1, 1, 1, 99]);
  });
});

describe('migrate: the second batch of Bodies', () => {
  it('loads a version-2 save from before them with its Bodies and fits kept, and default fits on the new ones', () => {
    const old = {
      version: 2, bolts: 140, body: 'jeep', ownedBodies: ['pickup', 'bigfoot', 'dragster', 'jeep'], unlocked: ['tires:1', 'paint:3'], goal: 'body:firetruck',
      fitted: Object.fromEntries(['pickup', 'bigfoot', 'dragster', 'firetruck', 'schoolbus', 'jeep'].map(b => [b, { tires: 1, paint: 3, decals: 0, lights: 0, horn: 0, engine: 0 }])),
    };
    const s = migrate(old);
    expect(s.version).toBe(SAVE_VERSION);
    expect(s.bolts).toBe(140);
    expect(s.body).toBe('jeep');
    expect(s.ownedBodies).toEqual(['pickup', 'bigfoot', 'dragster', 'jeep']);
    expect(s.goal).toBe('body:firetruck');
    expect(s.fitted.jeep).toEqual({ tires: 1, paint: 3, decals: 0, lights: 0, horn: 0, engine: 0, grille: 0, exhaust: 0, topper: 0, number: 0, doorNumber: 1 });
    for (const b of ['towtruck', 'dumptruck', 'police', 'icecream', 'tractor', 'racecar'] as const) {
      expect(s.fitted[b]).toEqual({ tires: 0, paint: 0, decals: 0, lights: 0, horn: 0, engine: 0, grille: 0, exhaust: 0, topper: 0, number: 0, doorNumber: 1 });
    }
  });

  it('keeps one he bought, and a locked one as the Goal', () => {
    const s = migrate({ version: 2, ownedBodies: ['racecar'], body: 'racecar', goal: 'body:tractor' });
    expect(s.ownedBodies).toEqual(['pickup', 'bigfoot', 'dragster', 'racecar']);
    expect(s.body).toBe('racecar');
    expect(s.goal).toBe('body:tractor');
  });
});

describe('migrate: version 2 to 3, the Trophy Shelf', () => {
  const today = '2026-09-30';

  it('starts the counters at nothing and keeps the rest of the save', () => {
    const s = migrate({ version: 2, bolts: 30, ownedBodies: ['jeep'], body: 'jeep' }, today);
    expect(s.version).toBe(3);
    expect(s.bolts).toBe(30);
    expect(s.body).toBe('jeep');
    expect(s).toMatchObject({ roundsFinished: 0, bestStreak: 0, currentStreak: 0, daysPlayed: 0, lastDay: null });
  });

  it('backfills the trophies the old save already proves: Levels and stars reached', () => {
    const s = migrate({ version: 2, modes: { learn: { level: 3, starred: true, opened: true }, count: { level: 2, opened: true } } }, today);
    expect(s.trophies).toEqual({ 'learn:2': today, 'learn:3': today, 'learn:star': today, 'count:2': today });
  });

  it('backfills nothing for a new player', () => {
    expect(migrate({ version: 2 }, today).trophies).toEqual({});
  });

  it('keeps earned trophies and counters, and drops unknown ones', () => {
    const s = migrate({
      version: 3, trophies: { 'streak:5': '2026-09-01', 'wings:9': '2026-09-01', perfect: 7 },
      roundsFinished: 12, bestStreak: 6, currentStreak: 2, daysPlayed: 3, lastDay: '2026-09-02',
    }, today);
    expect(s.trophies).toEqual({ 'streak:5': '2026-09-01' });
    expect(s).toMatchObject({ roundsFinished: 12, bestStreak: 6, currentStreak: 2, daysPlayed: 3, lastDay: '2026-09-02' });
  });

  it('does not backfill a current save again', () => {
    const s = migrate({ version: 3, trophies: {}, modes: { learn: { level: 2, opened: true } } }, today);
    expect(s.trophies).toEqual({});
  });
});
