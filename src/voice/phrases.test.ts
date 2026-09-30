import { describe, expect, it } from 'vitest';
import { numberLine, PHRASES } from './phrases';

describe('the Door Number lines', () => {
  it('reads a number out', () => {
    expect(numberLine(42)).toBe('42!');
    expect(numberLine(0)).toBe('0!');
  });

  it('has a line for every number from 0 to 99', () => {
    for (let n = 0; n <= 99; n++) expect(PHRASES).toContain(`${n}!`);
    expect(PHRASES).not.toContain('100!');
  });
});
