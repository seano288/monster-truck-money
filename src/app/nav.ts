import { signal } from '@preact/signals';

export type Screen = 'start' | 'body' | 'home' | 'round' | 'garage';
export const screen = signal<Screen>('start');
