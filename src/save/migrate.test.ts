import { describe, expect, it } from 'vitest';
import { migrate, SAVE_VERSION } from './migrate';

describe('migrate', () => {
  it('starts fresh when there is no save', () => {
    expect(migrate(null)).toEqual({ version: SAVE_VERSION, bolts: 0 });
  });

  it('starts fresh from something that is not a save', () => {
    expect(migrate('hello')).toEqual({ version: SAVE_VERSION, bolts: 0 });
    expect(migrate({ bolts: 7 })).toEqual({ version: SAVE_VERSION, bolts: 0 });
  });

  it('keeps a current save as it is', () => {
    expect(migrate({ version: 1, bolts: 12 })).toEqual({ version: 1, bolts: 12 });
  });
});
