// The save seam. Everything the game keeps goes through load() and save(), so the backing store can be
// swapped (for Capacitor Preferences in a native wrapper) without touching the game.
import { migrate, type Save } from './migrate';

const KEY = 'mtm2-save'; // new key: the old Monster Cup saves (mtm-trophies, mtm-wins) are ignored

let persisted = false;
function persistOnce() {
  if (persisted) return;
  persisted = true;
  navigator.storage?.persist?.().catch(() => {});
}

export async function load(): Promise<Save> {
  persistOnce();
  try {
    const text = localStorage.getItem(KEY);
    return migrate(text ? JSON.parse(text) : null);
  } catch {
    return migrate(null);
  }
}

export async function save(data: Save): Promise<void> {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage full or blocked: the game keeps playing from memory
  }
}
