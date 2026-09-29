import { describe, expect, it } from 'vitest';
import { amountPieces } from './amount';

describe('amountPieces', () => {
  it('says cents only for amounts under a dollar', () => {
    expect(amountPieces(25)).toEqual(['25 cents']);
    expect(amountPieces(99)).toEqual(['99 cents']);
  });

  it('says one cent in the singular', () => {
    expect(amountPieces(1)).toEqual(['1 cent']);
  });

  it('says dollars only for whole dollars', () => {
    expect(amountPieces(100)).toEqual(['1 dollar']);
    expect(amountPieces(500)).toEqual(['5 dollars']);
  });

  it('joins dollars and cents', () => {
    expect(amountPieces(225)).toEqual(['2 dollars', '25 cents']);
    expect(amountPieces(101)).toEqual(['1 dollar', '1 cent']);
  });

  it('says nothing for nothing', () => {
    expect(amountPieces(0)).toEqual([]);
  });

  it('refuses amounts it has no clips for', () => {
    expect(() => amountPieces(1000)).toThrow();
    expect(() => amountPieces(2.5)).toThrow();
  });
});
