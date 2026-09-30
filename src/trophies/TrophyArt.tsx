// A trophy cup with what it's for on the front. A counting trophy's cup changes metal with each step; one not
// earned yet is a grey silhouette.
import { modeById } from '../modes/modes';
import type { Trophy, TrophyStep } from './trophies';

const METALS = ['#cd7f32', '#d4dae3', '#ffd23f', '#7fe0d6', '#c9a4ff']; // bronze, silver, gold, platinum, diamond
const GOLD = METALS[2]!, GREY = '#4b5160';

/** The cup's colour once `earned` of the trophy's steps are earned. */
export const cupColor = (t: Trophy, earned: number) => (earned === 0 ? GREY : t.steps.length === 1 ? GOLD : METALS[earned - 1]!);

function emblem(s: TrophyStep): [icon: string, text: string] {
  switch (s.kind) {
    case 'level': return [modeById(s.mode).icon, String(s.level)];
    case 'star': return [modeById(s.mode).icon, '⭐'];
    case 'streak': return ['🔥', String(s.n)];
    case 'perfect': return ['💯', ''];
    case 'rounds': return ['🏁', String(s.n)];
    case 'days': return ['📅', String(s.n)];
  }
}

/** `step` is the one shown on the front: the top one earned, or the first when none is. */
export function TrophyArt({ color, step, size = 96 }: { color: string; step: TrophyStep; size?: number }) {
  const [icon, text] = emblem(step);
  return (
    <div class="trophy" style={{ width: `calc(${size}px*var(--u))`, height: `calc(${size * 1.2}px*var(--u))` }} aria-hidden="true">
      <svg viewBox="0 0 100 120">
        <path d="M22 18 H8 Q6 46 30 50 M78 18 H92 Q94 46 70 50" fill="none" stroke={color} stroke-width="7" />
        <path d="M20 8 H80 V36 Q80 70 50 72 Q20 70 20 36 Z" fill={color} stroke="#000" stroke-width="4" />
        <rect x="43" y="72" width="14" height="18" fill={color} stroke="#000" stroke-width="4" />
        <rect x="24" y="90" width="52" height="22" rx="4" fill={color} stroke="#000" stroke-width="4" />
        <path d="M28 14 Q30 44 42 60" fill="none" stroke="#fff8" stroke-width="5" stroke-linecap="round" />
      </svg>
      <span class="ti">{icon}</span>
      {text && <span class="tt">{text}</span>}
    </div>
  );
}
