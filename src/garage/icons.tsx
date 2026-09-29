// Flat 2D pictures of each Mod, for the Mod tiles and the Goal bar.
import type { Rung, SlotId } from './catalog';

const PAINT2D = ['#8d96a3', '#1e7bff', 'url(#mtm-fire)', 'url(#mtm-rainbow)'];

function wheel2d(cx: number, cy: number, r: number, rung: Rung) {
  let s = '';
  if (rung === 3) {
    const p: string[] = [];
    for (let i = 0; i < 32; i++) { const a = (i * Math.PI) / 16, rr = i % 2 ? r : r + 8; p.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`); }
    s += `<polygon points="${p.join(' ')}" fill="#444"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1c1c1c"/>`;
  if (rung >= 1) s += `<circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="none" stroke="#3a3a3a" stroke-width="7" stroke-dasharray="7 6"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.48).toFixed(1)}" fill="${['#b9c0c8', '#d8dde3', '#ffcc33', '#ff3df0'][rung]}"/>`;
  for (let i = 0; i < 5; i++) { const a = (i * 2 * Math.PI) / 5; s += `<line x1="${cx}" y1="${cy}" x2="${(cx + r * 0.44 * Math.cos(a)).toFixed(1)}" y2="${(cy + r * 0.44 * Math.sin(a)).toFixed(1)}" stroke="#555" stroke-width="3"/>`; }
  return s + `<circle cx="${cx}" cy="${cy}" r="${(r * 0.14).toFixed(1)}" fill="#333"/>`;
}

const DECALS = [
  '',
  '<rect x="10" y="42" width="80" height="6" fill="#fff"/><rect x="10" y="54" width="80" height="6" fill="#fff"/>',
  '<path d="M90,72 C70,72 62,52 50,60 C58,46 44,42 36,52 C40,36 28,34 20,46 C26,62 50,73 90,73Z" fill="#ff7a00"/><path d="M90,72 C76,72 70,62 62,66 C66,58 58,56 52,62 C56,70 72,73 90,73Z" fill="#ffe14d"/>',
  '<polygon points="56,28 36,56 50,54 42,74 68,44 54,46 64,28" fill="#fff23a" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>',
];

function partSvg(slot: SlotId, r: Rung): string {
  switch (slot) {
    case 'tires': return wheel2d(50, 50, [24, 30, 36, 38][r]!, r);
    case 'paint': return `<rect x="12" y="22" width="76" height="56" rx="14" fill="${PAINT2D[r]}" stroke="#111" stroke-width="4"/>`;
    case 'decals': return `<rect x="8" y="24" width="84" height="52" rx="10" fill="#8d96a3" stroke="#111" stroke-width="4"/>${DECALS[r]}`;
    case 'lights': {
      let s = '';
      if (r === 3) s += '<ellipse cx="50" cy="86" rx="40" ry="7" fill="#2ef2ff" opacity=".6"/>';
      if (r >= 2) { s += '<rect x="16" y="20" width="68" height="16" rx="4" fill="#222" stroke="#111" stroke-width="2"/>'; for (let i = 0; i < 4; i++) s += `<circle cx="${25 + i * 17}" cy="28" r="5" fill="${r === 3 ? '#7ff9ff' : '#fff27a'}"/>`; }
      s += '<circle cx="50" cy="58" r="13" fill="#ffe9a8" stroke="#111" stroke-width="3"/>';
      if (r >= 1) s += '<circle cx="26" cy="72" r="8" fill="#ffb300" stroke="#111" stroke-width="2"/><circle cx="74" cy="72" r="8" fill="#ffb300" stroke="#111" stroke-width="2"/>';
      return s;
    }
    case 'horn': {
      const c = r === 3 ? '#ff4d4d' : '#fff';
      let s = `<polygon points="16,40 32,40 50,24 50,76 32,60 16,60" fill="${c}" stroke="#111" stroke-width="3" stroke-linejoin="round"/>`;
      for (let i = 0; i <= r; i++) s += `<path d="M${60 + i * 9},${38 - i * 6} q ${12 + i * 3} ${12 + i * 6} 0 ${24 + i * 12}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      return s;
    }
  }
}

export function PartIcon({ slot, rung }: { slot: SlotId; rung: Rung }) {
  return <svg viewBox="0 0 100 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: partSvg(slot, rung) }} />;
}

/** The gradients the Paint icons use; rendered once in the app. */
export function IconDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="mtm-fire" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffe14d" /><stop offset=".45" stop-color="#ff6a00" /><stop offset="1" stop-color="#a80000" /></linearGradient>
        <linearGradient id="mtm-rainbow" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#ff3b3b" /><stop offset=".25" stop-color="#ffb800" /><stop offset=".5" stop-color="#3dff8b" /><stop offset=".75" stop-color="#3dc8ff" /><stop offset="1" stop-color="#c04dff" /></linearGradient>
      </defs>
    </svg>
  );
}
