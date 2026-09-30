// Flat 2D pictures of each Mod, for the Mod tiles and the Goal bar.
import type { Rung, SlotId } from './catalog';

const PAINT2D = ['#8d96a3', '#1e7bff', 'url(#mtm-fire)', 'url(#mtm-rainbow)', 'url(#mtm-gold)'];

function wheel2d(cx: number, cy: number, r: number, rung: Rung) {
  let s = '';
  if (rung >= 3) {
    const p: string[] = [];
    for (let i = 0; i < 32; i++) { const a = (i * Math.PI) / 16, rr = i % 2 ? r : r + 8; p.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`); }
    s += `<polygon points="${p.join(' ')}" fill="${rung === 4 ? '#ffc21a' : '#444'}"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1c1c1c"/>`;
  if (rung >= 1) s += `<circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="none" stroke="#3a3a3a" stroke-width="7" stroke-dasharray="7 6"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.48).toFixed(1)}" fill="${['#b9c0c8', '#d8dde3', '#ffcc33', '#ff3df0', '#ffd700'][rung]}"/>`;
  for (let i = 0; i < 5; i++) { const a = (i * 2 * Math.PI) / 5; s += `<line x1="${cx}" y1="${cy}" x2="${(cx + r * 0.44 * Math.cos(a)).toFixed(1)}" y2="${(cy + r * 0.44 * Math.sin(a)).toFixed(1)}" stroke="#555" stroke-width="3"/>`; }
  return s + `<circle cx="${cx}" cy="${cy}" r="${(r * 0.14).toFixed(1)}" fill="#333"/>`;
}

const DECALS = [
  '',
  '<rect x="10" y="42" width="80" height="6" fill="#fff"/><rect x="10" y="54" width="80" height="6" fill="#fff"/>',
  '<path d="M90,72 C70,72 62,52 50,60 C58,46 44,42 36,52 C40,36 28,34 20,46 C26,62 50,73 90,73Z" fill="#ff7a00"/><path d="M90,72 C76,72 70,62 62,66 C66,58 58,56 52,62 C56,70 72,73 90,73Z" fill="#ffe14d"/>',
  '<polygon points="56,28 36,56 50,54 42,74 68,44 54,46 64,28" fill="#fff23a" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>',
  '<g stroke="#111" stroke-width="2" stroke-linejoin="round" fill="#f2f2f2"><path d="M42,48 C30,30 14,32 10,40 C18,42 14,48 10,52 C18,54 16,60 14,64 C26,64 36,58 42,56Z"/><path d="M58,48 C70,30 86,32 90,40 C82,42 86,48 90,52 C82,54 84,60 86,64 C74,64 64,58 58,56Z"/><circle cx="50" cy="46" r="11"/><rect x="44" y="53" width="12" height="8"/></g><circle cx="46" cy="45" r="3.2" fill="#111"/><circle cx="54" cy="45" r="3.2" fill="#111"/>',
];

function partSvg(slot: SlotId, r: Rung): string {
  switch (slot) {
    case 'tires': return wheel2d(50, 50, [24, 30, 36, 38, 38][r]!, r);
    case 'paint': return `<rect x="12" y="22" width="76" height="56" rx="14" fill="${PAINT2D[r]}" stroke="#111" stroke-width="4"/>`;
    case 'decals': return `<rect x="8" y="24" width="84" height="52" rx="10" fill="#8d96a3" stroke="#111" stroke-width="4"/>${DECALS[r]}`;
    case 'lights': {
      let s = '';
      if (r === 4) ['#ff2d55', '#3dff8b', '#3dc8ff', '#c04dff'].forEach((c, i) => { s += `<line x1="50" y1="22" x2="${4 + i * 30.7}" y2="2" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`; });
      if (r >= 3) s += `<ellipse cx="50" cy="86" rx="40" ry="7" fill="${r === 4 ? '#c04dff' : '#2ef2ff'}" opacity=".6"/>`;
      if (r >= 2) { s += '<rect x="16" y="20" width="68" height="16" rx="4" fill="#222" stroke="#111" stroke-width="2"/>'; for (let i = 0; i < 4; i++) s += `<circle cx="${25 + i * 17}" cy="28" r="5" fill="${r === 4 ? ['#ff2d55', '#3dff8b', '#3dc8ff', '#c04dff'][i] : r === 3 ? '#7ff9ff' : '#fff27a'}"/>`; }
      s += '<circle cx="50" cy="58" r="13" fill="#ffe9a8" stroke="#111" stroke-width="3"/>';
      if (r >= 1) s += '<circle cx="26" cy="72" r="8" fill="#ffb300" stroke="#111" stroke-width="2"/><circle cx="74" cy="72" r="8" fill="#ffb300" stroke="#111" stroke-width="2"/>';
      return s;
    }
    case 'horn': {
      if (r === 4) { // three trumpets
        let s = '';
        for (let i = 0; i < 3; i++) s += `<polygon points="${14 + i * 6},${30 + i * 16} ${56 + i * 6},${22 + i * 16} ${56 + i * 6},${42 + i * 16} ${14 + i * 6},${34 + i * 16}" fill="#e8e8e8" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>`;
        return s + '<path d="M72,20 q14,14 0,28 M80,14 q20,20 0,40 M88,8 q26,26 0,52" stroke="#ffd23f" stroke-width="5" fill="none" stroke-linecap="round"/>';
      }
      const c = r === 3 ? '#ff4d4d' : '#fff';
      let s = `<polygon points="16,40 32,40 50,24 50,76 32,60 16,60" fill="${c}" stroke="#111" stroke-width="3" stroke-linejoin="round"/>`;
      for (let i = 0; i <= r; i++) s += `<path d="M${60 + i * 9},${38 - i * 6} q ${12 + i * 3} ${12 + i * 6} 0 ${24 + i * 12}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      return s;
    }
    case 'engine': {
      if (r === 4) { // a rocket nozzle with a gold flame
        return '<path d="M4,50 C14,34 30,38 40,44 L40,56 C30,62 14,66 4,50Z" fill="#ffc21a"/><path d="M14,50 C20,43 30,45 40,48 L40,52 C30,55 20,57 14,50Z" fill="#fff4b0"/>'
          + '<polygon points="40,40 56,30 56,70 40,60" fill="#555" stroke="#111" stroke-width="3" stroke-linejoin="round"/><rect x="56" y="30" width="36" height="40" rx="8" fill="#e8e8e8" stroke="#111" stroke-width="3"/><rect x="66" y="30" width="6" height="40" fill="#e63946"/>';
      }
      if (r === 3) { // a turbine intake with blades
        let s = '<circle cx="50" cy="50" r="38" fill="#b9c0c8" stroke="#111" stroke-width="4"/><circle cx="50" cy="50" r="30" fill="#2d3650"/>';
        for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; s += `<path d="M50,50 L${(50 + 28 * Math.cos(a)).toFixed(1)},${(50 + 28 * Math.sin(a)).toFixed(1)} L${(50 + 28 * Math.cos(a + 0.45)).toFixed(1)},${(50 + 28 * Math.sin(a + 0.45)).toFixed(1)}Z" fill="#d8dde3"/>`; }
        return s + '<circle cx="50" cy="50" r="8" fill="#ffcc33" stroke="#111" stroke-width="2"/>';
      }
      // an engine block that grows pipes: 1 for Putt-Putt, 2 for Rumble, 4 chrome ones for V8
      const pipes = [1, 2, 4][r]!, c = r === 2 ? '#e8e8e8' : '#8d96a3';
      let s = `<rect x="18" y="44" width="64" height="38" rx="6" fill="${r === 2 ? '#e63946' : '#6b7385'}" stroke="#111" stroke-width="4"/>`;
      for (let i = 0; i < pipes; i++) { const x = 50 - (pipes - 1) * 8 + i * 16; s += `<rect x="${x - 5}" y="20" width="10" height="26" rx="3" fill="${c}" stroke="#111" stroke-width="3"/>`; }
      return s + (r === 0 ? '<circle cx="66" cy="16" r="6" fill="#ccc" opacity=".8"/>' : '');
    }
    case 'grille': {
      const teeth = (y: number, dir: 1 | -1, n: number, x0: number, x1: number, c: string) => {
        const w = (x1 - x0) / n; let s = '';
        for (let i = 0; i < n; i++) s += `<polygon points="${x0 + i * w},${y} ${x0 + (i + 1) * w},${y} ${x0 + (i + 0.5) * w},${y + dir * w * 1.3}" fill="${c}" stroke="#111" stroke-width="2" stroke-linejoin="round"/>`;
        return s;
      };
      if (r === 4) { // a gold dragon jaw, open, with fire inside and horns
        return '<path d="M16,30 L4,6 L30,24Z M84,30 L96,6 L70,24Z" fill="#ffc21a" stroke="#111" stroke-width="3" stroke-linejoin="round"/>'
          + '<rect x="12" y="24" width="76" height="60" rx="12" fill="#ffc21a" stroke="#111" stroke-width="4"/><rect x="20" y="36" width="60" height="36" rx="6" fill="#ff6a00"/><ellipse cx="50" cy="56" rx="22" ry="10" fill="#ffe14d"/>'
          + teeth(36, 1, 5, 20, 80, '#fff8dc') + teeth(72, -1, 5, 20, 80, '#fff8dc');
      }
      if (r === 3) { // a black mouth full of white shark teeth
        return '<rect x="10" y="26" width="80" height="52" rx="14" fill="#d9dde3" stroke="#111" stroke-width="4"/><rect x="18" y="34" width="64" height="36" rx="8" fill="#5a0010"/>'
          + teeth(34, 1, 6, 18, 82, '#fff') + teeth(70, -1, 6, 18, 82, '#fff');
      }
      // a grille that grows: thin dark slats, then thick chrome bars, then a chrome bull bar in front
      let s = `<rect x="18" y="30" width="64" height="40" rx="6" fill="#1e2126" stroke="${r ? '#e8e8e8' : '#111'}" stroke-width="${r ? 7 : 4}"/>`;
      if (r === 0) for (let i = 0; i < 6; i++) s += `<rect x="${27 + i * 9}" y="36" width="3" height="28" fill="#8d96a3"/>`;
      else for (let i = 0; i < 4; i++) s += `<rect x="24" y="${36 + i * 8}" width="52" height="5" rx="2" fill="#e8e8e8"/>`;
      const bar = 'd="M24,90 L24,24 Q24,12 36,12 L64,12 Q76,12 76,24 L76,90 M24,52 L76,52" fill="none" stroke-linejoin="round"';
      if (r === 2) s += `<path ${bar} stroke="#111" stroke-width="10"/><path ${bar} stroke="#c8ced6" stroke-width="6"/>`;
      return s;
    }
    case 'exhaust': {
      if (r === 0) { // a tailpipe out of the back with a little puff
        return '<rect x="40" y="56" width="52" height="14" rx="4" fill="#d8dde3" stroke="#111" stroke-width="3"/><rect x="34" y="53" width="10" height="20" rx="3" fill="#333" stroke="#111" stroke-width="3"/>'
          + '<circle cx="22" cy="58" r="9" fill="#ccc" opacity=".85"/><circle cx="10" cy="48" r="6" fill="#ccc" opacity=".6"/>';
      }
      // two stacks that grow, with plain puffs, then dark smoke, then flames, then a rainbow blast from gold stacks
      const pipe = r === 4 ? '#ffc21a' : '#e8e8e8', w = r === 1 ? 10 : 13;
      let s = '';
      for (const x of [34, 66]) {
        if (r === 1) s += `<circle cx="${x}" cy="22" r="7" fill="#ddd" opacity=".85"/><circle cx="${x + 6}" cy="10" r="5" fill="#ddd" opacity=".6"/>`;
        if (r === 2) s += `<circle cx="${x}" cy="20" r="11" fill="#4a4a50"/><circle cx="${x + 7}" cy="7" r="8" fill="#4a4a50" opacity=".75"/>`;
        if (r === 3) s += `<path d="M${x - 9},32 C${x - 12},18 ${x - 2},16 ${x},2 C${x + 4},14 ${x + 12},18 ${x + 9},32Z" fill="#ff6a00"/><path d="M${x - 5},32 C${x - 6},24 ${x},20 ${x},12 C${x + 3},20 ${x + 6},24 ${x + 5},32Z" fill="#ffe14d"/>`;
        if (r === 4) ['#ff3b3b', '#ffb800', '#3dff8b', '#3dc8ff', '#c04dff'].forEach((c, i) => { s += `<circle cx="${x + (i - 2) * 5}" cy="${26 - i * 5}" r="${5 + i}" fill="${c}" opacity=".9"/>`; });
        s += `<rect x="${x - w / 2}" y="32" width="${w}" height="54" rx="3" fill="${pipe}" stroke="#111" stroke-width="3"/>`;
        if (r >= 2) s += `<rect x="${x - w / 2 - 3}" y="30" width="${w + 6}" height="7" rx="2" fill="${pipe}" stroke="#111" stroke-width="3"/><rect x="${x - w / 2}" y="52" width="${w}" height="16" fill="#333"/>`;
      }
      return s;
    }
    case 'topper': { // a cab roof, with something fun on top
      let s = '';
      if (r === 1) { // a checkered flag on a tall whip
        s += '<line x1="30" y1="62" x2="30" y2="8" stroke="#111" stroke-width="3"/><rect x="30" y="8" width="44" height="26" fill="#fff" stroke="#111" stroke-width="3"/>';
        for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2 === 0) s += `<rect x="${30 + i * 11}" y="${8 + j * 13}" width="11" height="13" fill="#111"/>`;
      }
      if (r === 2) s += '<rect x="30" y="38" width="6" height="22" fill="#1e2126"/><rect x="64" y="38" width="6" height="22" fill="#1e2126"/><path d="M10,40 L90,32 L90,42 L10,48Z" fill="#e63946" stroke="#111" stroke-width="3" stroke-linejoin="round"/>';
      if (r === 3) s += '<g stroke="#111" stroke-width="3" stroke-linejoin="round"><path d="M50,58 C30,60 12,52 8,20 C20,40 34,46 50,48Z M50,58 C70,60 88,52 92,20 C80,40 66,46 50,48Z" fill="#fff4d0"/><path d="M8,20 L10,30 L15,34Z M92,20 L90,30 L85,34Z" fill="#111"/></g><ellipse cx="50" cy="56" rx="12" ry="7" fill="#1e2126"/>';
      if (r === 4) { // a gold-based siren flashing red and blue
        s += '<path d="M50,36 L14,14 L20,6Z" fill="#ff1a1a" opacity=".55"/><path d="M50,36 L86,14 L80,6Z" fill="#1a6bff" opacity=".55"/>';
        s += '<path d="M34,54 L34,38 A16,16 0 0 1 66,38 L66,54Z" fill="#ff1a1a" stroke="#111" stroke-width="3"/><path d="M50,22 A16,16 0 0 1 66,38 L66,54 L50,54Z" fill="#1a6bff"/><path d="M34,54 L34,38 A16,16 0 0 1 66,38 L66,54Z" fill="none" stroke="#111" stroke-width="3"/>';
        s += '<rect x="28" y="52" width="44" height="10" rx="3" fill="#ffc21a" stroke="#111" stroke-width="3"/>';
      }
      return s + '<path d="M14,90 L24,62 L76,62 L86,90Z" fill="#8d96a3" stroke="#111" stroke-width="4" stroke-linejoin="round"/>';
    }
    case 'number': { // a door with a racing number on it
      let s = '<rect x="14" y="14" width="72" height="72" rx="10" fill="#8d96a3" stroke="#111" stroke-width="4"/><rect x="66" y="46" width="12" height="5" rx="2" fill="#24272c"/>';
      if (r === 0) return s;
      const num = (fill: string, stroke: string, w: number) => `<text x="42" y="70" text-anchor="middle" font-family="Bungee,sans-serif" font-size="44" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" paint-order="stroke">7</text>`;
      if (r === 3) s += '<path d="M30,34 C26,26 30,18 34,10 C36,18 42,20 40,30 C46,24 46,16 46,12 C54,22 54,30 50,36Z" fill="#ff6a00"/><path d="M36,34 C34,28 36,24 38,20 C40,26 44,28 42,34Z" fill="#ffe14d"/>';
      if (r === 4) s += '<ellipse cx="42" cy="54" rx="26" ry="26" fill="#ffd23f" opacity=".35"/>';
      return s + (r === 1 ? num('#fff', '#16181c', 3) : r === 2 ? `${num('none', '#e63946', 12)}${num('#fff', '#111', 6)}` : r === 3 ? num('url(#mtm-fire)', '#111', 4) : num('url(#mtm-gold)', '#6a4a00', 3));
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
        <linearGradient id="mtm-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1a8" /><stop offset=".5" stop-color="#e0a800" /><stop offset="1" stop-color="#8a6100" /></linearGradient>
        <linearGradient id="mtm-rainbow" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#ff3b3b" /><stop offset=".25" stop-color="#ffb800" /><stop offset=".5" stop-color="#3dff8b" /><stop offset=".75" stop-color="#3dc8ff" /><stop offset="1" stop-color="#c04dff" /></linearGradient>
      </defs>
    </svg>
  );
}
