// Vite plugin: the build fails when a phrase in phrases.ts has no recorded clip.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { PHRASES } from '../src/voice/phrases';
import { CLIPS } from '../src/voice/voice.gen';

export function missingClips(root: string): string[] {
  return PHRASES.filter(p => {
    const file = CLIPS[p];
    return !file || !existsSync(resolve(root, 'public/voice', file));
  });
}

export function voiceCheck(): Plugin {
  return {
    name: 'voice-check',
    apply: 'build',
    configResolved(config) {
      const missing = missingClips(config.root);
      if (missing.length) {
        throw new Error(`Missing voice clip${missing.length > 1 ? 's' : ''} (run tools/make_voice.py):\n${missing.map(p => `  "${p}"`).join('\n')}`);
      }
    },
  };
}
