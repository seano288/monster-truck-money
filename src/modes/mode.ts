// The shared interface every Game Mode plugs into. Home tiles and the unlock chain are built from MODES,
// so adding a mode means adding a module and a list entry.
import type { ComponentType } from 'preact';
import type { Rng } from '../game/rng';
import type { MoneyKey } from '../money/money';
import type { Phrase } from '../voice/phrases';
import type { Level, ModeId, ModeName } from './ids';

/** What a mode's screen can tell the Round. */
export interface RoundApi {
  /** He got this problem right. */
  correct(): void;
  /** A wrong answer: it only costs a retry. */
  miss(): void;
  /** He used help (or help ran by itself), so this problem doesn't count toward Mastery. */
  helped(): void;
  /** He has missed a lot lately, so help should step in after a single miss. */
  struggling: boolean;
  /** Taps are ignored while the Round moves on. */
  busy: boolean;
}

export interface ModeViewProps<P> { problem: P; level: Level; api: RoundApi }

export interface GameMode<P = unknown, A = unknown> {
  id: ModeId;
  name: ModeName;
  icon: string;
  /** Opens when this mode reaches Level 2; null means open from the start. */
  opensAfter: ModeId | null;
  /** Spoken when he taps the tile while it's locked. */
  lockedHint: Phrase | null;
  /** The money each Level uses. */
  levels: Record<Level, readonly MoneyKey[]>;
  /** The new money shown on the introduction card when the mode reaches that Level. */
  introMoney: Record<2 | 3, readonly MoneyKey[]>;
  /** Everything the mode says (all listed in phrases.ts). */
  phrases: readonly Phrase[];
  makeProblem(level: Level, rng: Rng): P;
  checkAnswer(problem: P, answer: A): boolean;
  View: ComponentType<ModeViewProps<P>>;
}
