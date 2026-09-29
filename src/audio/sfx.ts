// Sound effects, all made in code with Web Audio. No sound files.
import { audio } from './context';

export function tone(f: number, dur: number, type: OscillatorType = 'sine', when = 0, vol = 0.15, slide?: number) {
  try {
    const c = audio(), t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  } catch { /* no audio: play on silently */ }
}

export interface NoiseOpts { dur: number; vol?: number; type?: BiquadFilterType; f?: number; f2?: number; when?: number; beat?: number; grow?: boolean }
export function noise({ dur, vol = 0.25, type = 'lowpass', f = 800, f2, when = 0, beat = 0, grow = false }: NoiseOpts) {
  try {
    const c = audio(), t = c.currentTime + when, b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), ch = b.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = b;
    fl.type = type;
    fl.frequency.setValueAtTime(f, t);
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    if (beat) for (let x = 0; x < dur; x += beat) { const v = grow ? vol * (0.25 + (0.75 * x) / dur) : vol; g.gain.setValueAtTime(v, t + x); g.gain.setValueAtTime(v * 0.15, t + x + beat * 0.5); }
    else { g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); }
    s.connect(fl).connect(g).connect(c.destination);
    s.start(t);
  } catch { /* no audio */ }
}

export const sGood = () => { tone(523, 0.15, 'triangle'); tone(659, 0.15, 'triangle', 0.12); tone(784, 0.3, 'triangle', 0.24); };
export const sBad = () => tone(160, 0.3, 'square', 0, 0.08);
export const sClink = (when = 0) => { tone(1800, 0.08, 'triangle', when, 0.1); tone(2600, 0.1, 'triangle', when + 0.04, 0.06); };
export const sCount = (i: number) => tone(400 + i * 60, 0.12, 'triangle', 0, 0.1);
export const sFanfare = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', i * 0.12, 0.14));
