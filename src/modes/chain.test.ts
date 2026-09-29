import { describe, expect, it } from 'vitest';
import { opensWith } from './chain';
import { MODES } from './modes';

describe('the unlock chain', () => {
  it('opens Count the Cash when Learn the Coins reaches Level 2', () => {
    expect(opensWith(MODES, 'learn', 2)).toEqual(['count']);
  });

  it('opens Pay the Shop when Count the Cash reaches Level 2', () => {
    expect(opensWith(MODES, 'count', 2)).toEqual(['pay']);
  });

  it('opens nothing at Level 3', () => {
    expect(opensWith(MODES, 'learn', 3)).toEqual([]);
  });

  it('is built from the list of modes, in order, from Learn the Coins', () => {
    expect(MODES.map(m => [m.id, m.opensAfter])).toEqual([['learn', null], ['count', 'learn'], ['pay', 'count']]);
  });
});
