// Save migrations are pure: raw JSON in, a current Save out. Anything that isn't a save starts fresh.

export const SAVE_VERSION = 1;

export interface Save {
  version: typeof SAVE_VERSION;
  bolts: number;
}

export const freshSave = (): Save => ({ version: SAVE_VERSION, bolts: 0 });

type Raw = Record<string, unknown>;
// MIGRATIONS[n] turns a version-n save into a version-(n+1) save
const MIGRATIONS: Record<number, (old: Raw) => Raw> = {};

const isRecord = (x: unknown): x is Raw => typeof x === 'object' && x !== null && !Array.isArray(x);
const count = (x: unknown) => (typeof x === 'number' && Number.isInteger(x) && x >= 0 ? x : 0);

export function migrate(raw: unknown): Save {
  if (!isRecord(raw) || typeof raw.version !== 'number') return freshSave();
  let data = raw;
  for (let v = raw.version; v < SAVE_VERSION; v++) {
    const step = MIGRATIONS[v];
    if (!step) return freshSave();
    data = step(data);
  }
  return { version: SAVE_VERSION, bolts: count(data.bolts) };
}
