// The question line: 🔊 replays what was asked.
import { useEffect } from 'preact/hooks';
import { say, type Item } from '../voice/say';

export function Ask({ text, speech }: { text: string; speech: Item[] }) {
  useEffect(() => { void say(...speech); }, []); // asked once as the problem appears
  return (
    <div class="ask">
      <button class="say-btn" aria-label="Say it again" onClick={() => void say(...speech)}>🔊</button>
      <h2>{text}</h2>
    </div>
  );
}
