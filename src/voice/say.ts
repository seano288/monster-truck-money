// Plays phrases from their recorded clips, one after another. say() cuts off whatever is being said;
// sayMore() adds to it. Money amounts are joined from pieces: say('It costs', { cents: 225 }).
import { signal } from '@preact/signals';
import { audio } from '../audio/context';
import { amountPieces } from './amount';
import type { Phrase } from './phrases';
import { CLIPS } from './voice.gen';

export type Part = Phrase | { cents: number };
/** A part, or several parts read while an element is lit (the element checks `speaking.value === light`). */
export type Item = Part | { parts: readonly Part[]; light: string };

/** The `light` key of the item being read, so its button can light up. */
export const speaking = signal<string | null>(null);

interface Queued { phrases: Phrase[]; light: string | null; done?: () => void }

const buffers = new Map<Phrase, Promise<AudioBuffer | null>>();
function clip(p: Phrase): Promise<AudioBuffer | null> {
  let b = buffers.get(p);
  if (!b) {
    const file = CLIPS[p];
    b = file
      ? fetch(`./voice/${file}`).then(r => r.arrayBuffer()).then(a => audio().decodeAudioData(a)).catch(() => null)
      : Promise.resolve(null);
    buffers.set(p, b);
  }
  return b;
}

const toPhrases = (parts: readonly Part[]): Phrase[] => parts.flatMap(p => (typeof p === 'string' ? [p] : amountPieces(p.cents)));

let gen = 0, queue: Queued[] = [], current: Queued | null = null, source: AudioBufferSourceNode | null = null, running = false;

async function pump(g: number) {
  running = true;
  while (g === gen && queue.length) {
    const item = (current = queue.shift()!);
    speaking.value = item.light;
    for (const p of item.phrases) {
      const buf = await clip(p);
      if (g !== gen) break;
      if (!buf) continue;
      await new Promise<void>(ok => {
        const s = (source = audio().createBufferSource());
        s.buffer = buf;
        s.connect(audio().destination);
        s.onended = () => ok();
        s.start();
      });
      if (g !== gen) break;
    }
    if (g !== gen) break;
    speaking.value = null;
    item.done?.();
  }
  if (g === gen) { running = false; current = null; }
}

function enqueue(items: readonly Item[]): Promise<void> {
  return new Promise(res => {
    const qs: Queued[] = items.map(it =>
      typeof it === 'object' && 'parts' in it ? { phrases: toPhrases(it.parts), light: it.light } : { phrases: toPhrases([it]), light: null });
    const last = qs[qs.length - 1];
    if (!last) return res();
    last.done = res;
    queue.push(...qs);
    if (!running) void pump(gen);
  });
}

/** Stop talking. Anyone waiting on what was being said is released. */
export function hush() {
  gen++;
  for (const q of [current, ...queue]) q?.done?.();
  current = null; queue = []; running = false; speaking.value = null;
  if (source) { source.onended = null; try { source.stop(); } catch { /* already stopped */ } source = null; }
}

/** Say these, cutting off whatever is being said. Resolves when all of it has been said (or cut off). */
export function say(...items: Item[]): Promise<void> {
  hush();
  return enqueue(items);
}

/** Say these after whatever is already being said. */
export function sayMore(...items: Item[]): Promise<void> {
  return enqueue(items);
}

/** Fetch and decode these phrases ahead of time so they start without a gap. */
export function preload(phrases: readonly Phrase[]) {
  for (const p of phrases) void clip(p);
}
