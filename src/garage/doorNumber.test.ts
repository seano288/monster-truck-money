import { describe, expect, it } from 'vitest';
import { digits, turnWheel } from './doorNumber';

describe('the Door Number wheels', () => {
  it('shows the tens and the ones', () => {
    expect(digits(42)).toEqual([4, 2]);
    expect(digits(7)).toEqual([0, 7]);
    expect(digits(0)).toEqual([0, 0]);
  });

  it('turns the ones up and down without touching the tens', () => {
    expect(turnWheel(42, 'ones', 1)).toBe(43);
    expect(turnWheel(42, 'ones', -1)).toBe(41);
    expect(turnWheel(49, 'ones', 1)).toBe(40);
    expect(turnWheel(40, 'ones', -1)).toBe(49);
  });

  it('turns the tens up and down without touching the ones', () => {
    expect(turnWheel(42, 'tens', 1)).toBe(52);
    expect(turnWheel(42, 'tens', -1)).toBe(32);
    expect(turnWheel(95, 'tens', 1)).toBe(5);
    expect(turnWheel(5, 'tens', -1)).toBe(95);
  });

  it('stays from 0 to 99 however far he turns', () => {
    let n = 0;
    for (let i = 0; i < 250; i++) { n = turnWheel(n, i % 3 ? 'ones' : 'tens', i % 7 < 4 ? 1 : -1); expect(n).toBeGreaterThanOrEqual(0); expect(n).toBeLessThanOrEqual(99); }
  });
});
