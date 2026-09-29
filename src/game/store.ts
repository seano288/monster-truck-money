// The saved game, held in a signal. Every change goes through update(), which saves it.
import { signal } from '@preact/signals';
import { freshSave, type Save } from '../save/migrate';
import { load, save } from '../save/storage';

export const game = signal<Save>(freshSave());

export async function loadGame() {
  game.value = await load();
}

export function update(change: (s: Save) => Save) {
  game.value = change(game.value);
  void save(game.value);
}
