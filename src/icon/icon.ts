// The Home Screen icon, "Truck head-on": one 512×512 SVG made in code, a background layer (yellow sunburst)
// and an art layer (a red Truck from the front on two big tires). tools/icons.ts rasterises it at build time.
const K = '#1d1d1f';
export const ICON_YELLOW = '#ffd23f';

const rays = (fill: string) => Array.from({ length: 12 }, (_, i) => {
  const a0 = ((i * 30 - 7) * Math.PI) / 180, a1 = ((i * 30 + 7) * Math.PI) / 180, r = 520;
  return `<path d="M256 256 L${256 + r * Math.cos(a0)} ${256 + r * Math.sin(a0)} L${256 + r * Math.cos(a1)} ${256 + r * Math.sin(a1)} Z" fill="${fill}"/>`;
}).join('');

const background = () => `<rect width="512" height="512" fill="${ICON_YELLOW}"/>${rays('#ffe070')}`;

const art = () => `
  <g stroke="${K}" stroke-width="12" stroke-linejoin="round">
    <rect x="40" y="268" width="130" height="206" rx="44" fill="#2b2d33"/>
    <rect x="342" y="268" width="130" height="206" rx="44" fill="#2b2d33"/>
  </g>
  <g stroke="#55585f" stroke-width="10" stroke-linecap="round">
    ${[300, 334, 368, 402, 436].map(y => `<line x1="66" y1="${y}" x2="144" y2="${y}"/><line x1="368" y1="${y}" x2="446" y2="${y}"/>`).join('')}
  </g>
  <rect x="160" y="330" width="192" height="26" rx="10" fill="#8a8f98" stroke="${K}" stroke-width="10"/>
  <g stroke="${K}" stroke-width="12" stroke-linejoin="round">
    <path d="M150 206 L186 104 Q190 94 202 94 L310 94 Q322 94 326 104 L362 206 Z" fill="#e63946"/>
    <rect x="88" y="196" width="336" height="124" rx="32" fill="#e63946"/>
    <path d="M182 192 L206 124 L306 124 L330 192 Z" fill="#7cc8ff"/>
  </g>
  <path d="M214 132 L236 132 L214 184 L196 184 Z" fill="#fff" opacity=".7"/>
  <g stroke="${K}" stroke-width="10">
    <circle cx="146" cy="256" r="28" fill="#fff6b0"/>
    <circle cx="366" cy="256" r="28" fill="#fff6b0"/>
    <rect x="204" y="226" width="104" height="62" rx="10" fill="${K}"/>
  </g>
  <g stroke="#8a8f98" stroke-width="8"><line x1="230" y1="236" x2="230" y2="278"/><line x1="256" y1="236" x2="256" y2="278"/><line x1="282" y1="236" x2="282" y2="278"/></g>
  <rect x="100" y="306" width="312" height="30" rx="12" fill="#c9ced6" stroke="${K}" stroke-width="10"/>`;

/** The icon as SVG. scale shrinks the art (not the background): 0.8 keeps it inside a maskable icon's safe zone. */
export function iconSvg(scale = 1): string {
  const off = 256 * (1 - scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${background()}<g transform="translate(${off} ${off}) scale(${scale})">${art()}</g></svg>`;
}
