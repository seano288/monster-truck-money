// Little DOM effects for the celebrations: flying Bolts, confetti, fireworks, flying bits and a shake.
import { sPop } from '../audio/sfx';

export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]!;
const COLORS = ['#ffd23f', '#e63946', '#2bb673', '#2a6fdb', '#ff7a00'];

export const boltSvg = (s: number) =>
  `<svg class="bolt" width="${s}" height="${s}" viewBox="0 0 40 40"><polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="#ffc21a" stroke="#7a5200" stroke-width="3"/><circle cx="20" cy="20" r="7" fill="#e0a000" stroke="#7a5200" stroke-width="2.5"/></svg>`;

function add(cls: string, html = '', css = ''): HTMLDivElement {
  const d = document.createElement('div');
  d.className = cls;
  d.innerHTML = html;
  d.style.cssText = css;
  document.body.appendChild(d);
  return d;
}

/** One Bolt from a point on the page to an element; resolves when it lands. */
export function flyBolt(from: { x: number; y: number }, to: Element, size = 56): Promise<void> {
  return new Promise(res => {
    const r = to.getBoundingClientRect();
    const b = add('fly', boltSvg(size), `left:${from.x - size / 2}px;top:${from.y - size / 2}px`);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      b.style.transform = `translate(${r.left + r.width / 2 - from.x}px,${r.top + r.height / 2 - from.y}px) scale(.6)`;
      b.style.opacity = '0';
    }));
    setTimeout(() => { b.remove(); res(); }, 700);
  });
}

export function confetti(n: number) {
  for (let i = 0; i < n; i++) {
    const c = add('confetti', '', `left:${Math.random() * 100}vw;background:${pick(COLORS)};animation-duration:${rand(1.8, 3.4)}s;animation-delay:${rand(0, 0.5)}s`);
    setTimeout(() => c.remove(), 4200);
  }
}

export function firework(x = rand(0.15, 0.85) * innerWidth, y = rand(0.15, 0.45) * innerHeight) {
  const col = pick(['#ffd23f', '#ff5d8f', '#6ee7ff', '#9dff6e', '#ff9a3c']);
  sPop();
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2, r = rand(80, 170);
    const d = add('firework', '', `left:${x}px;top:${y}px;background:${col};--dx:${Math.cos(a) * r}px;--dy:${Math.sin(a) * r}px`);
    setTimeout(() => d.remove(), 1050);
  }
}

/** Bits of something flying apart, such as a padlock. */
export function shatter(parent: HTMLElement, ch: string, x: number, y: number, n = 6) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div'), a = -Math.PI / 2 + (i - n / 2) * 0.5;
    s.className = 'shatter';
    s.textContent = ch;
    s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * 160}px;--dy:${Math.sin(a) * 160 + 120}px;--r:${rand(-300, 300)}deg`;
    parent.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
}

/** Sparks bursting from a point. */
export function sparks(at: { x: number; y: number }, spread: { w: number; h: number }) {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const e = add('spark', i % 2 ? '✨' : '⭐', `left:${at.x}px;top:${at.y}px;--dx:${Math.cos(a) * spread.w * 0.3}px;--dy:${Math.sin(a) * spread.h * 0.3}px`);
    setTimeout(() => e.remove(), 950);
  }
}

export function shake(el: Element | null) {
  if (!el) return;
  el.classList.remove('shake');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('shake');
}

/** Web Animations, resolved when done (or cancelled). */
export const animate = (el: Element, kf: Keyframe[], ms: number, easing = 'ease-in-out') =>
  el.animate(kf, { duration: ms, easing, fill: 'forwards' }).finished.then(() => {}, () => {});
