// What each end-of-Round moment says, and the order they play in: smallest first.
import { modeById } from '../modes/modes';
import type { Phrase } from '../voice/phrases';
import type { RoundEvent } from './round';

export const tierOf = (e: RoundEvent) => (e.kind === 'star' ? 3 : 2);
export const smallestFirst = (events: readonly RoundEvent[]) => [...events].sort((a, b) => tierOf(a) - tierOf(b));

export function eventLines(e: RoundEvent): Phrase[] {
  const name = modeById(e.mode).name;
  if (e.kind === 'levelUp') return ['Level up!', e.level === 2 ? 'Now you get quarters!' : 'Now you get dollar bills!'];
  if (e.kind === 'star') return [`You are a ${name} star!`];
  return [];
}
