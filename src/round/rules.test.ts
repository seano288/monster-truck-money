import { describe, expect, it } from 'vitest';
import { boltsFor, MAX_BOLTS, takeAgain, teachNow } from './rules';

describe('Bolts for a Round', () => {
  it('pays a Bolt for each answer right on the first try without help, and one for finishing', () => {
    expect(boltsFor(['clean', 'clean', 'clean', 'clean', 'clean'])).toBe(MAX_BOLTS);
    expect(boltsFor(['clean', 'missed', 'helped', 'clean', 'missed'])).toBe(3);
  });

  it('pays only the finishing Bolt when every answer was a guess', () => {
    expect(boltsFor(['missed', 'missed', 'missed', 'missed', 'missed'])).toBe(1);
  });
});

describe('teaching after a miss', () => {
  it('shows him the answer on the second miss', () => {
    expect(teachNow(1, false)).toBe(false);
    expect(teachNow(2, false)).toBe(true);
  });

  it('shows him on the first miss when he has missed a lot lately', () => {
    expect(teachNow(1, true)).toBe(true);
  });
});

describe('a missed problem coming back', () => {
  it('waits for one other problem first', () => {
    const queue = [{ problem: 'a', after: 2 }];
    expect(takeAgain(queue, 2)).toBeNull();
    expect(takeAgain(queue, 3)).toEqual({ problem: 'a', rest: [] });
  });

  it('comes back in the order they were missed', () => {
    expect(takeAgain([{ problem: 'a', after: 1 }, { problem: 'b', after: 2 }], 3)).toEqual({ problem: 'a', rest: [{ problem: 'b', after: 2 }] });
  });
});
