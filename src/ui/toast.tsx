// A short line shown at the top and spoken at the same time.
import { signal } from '@preact/signals';
import { say, type Item } from '../voice/say';

const shown = signal<{ text: string; id: number } | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

export function toast(text: string, ...speech: Item[]): Promise<void> {
  const id = (shown.value?.id ?? 0) + 1;
  shown.value = { text, id };
  clearTimeout(timer);
  timer = setTimeout(() => { if (shown.value?.id === id) shown.value = null; }, 1800);
  return say(...speech);
}

export function Toast() {
  const t = shown.value;
  return <div class={`toast${t ? ' show' : ''}`} aria-live="polite">{t?.text}</div>;
}
