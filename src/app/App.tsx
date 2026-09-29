import { signal } from '@preact/signals';
import { unlockAudio } from '../audio/context';
import { say } from '../voice/say';

const started = signal(false);

function start() {
  unlockAudio(); // sound needs this tap on iPad Safari
  void say("Let's go!");
  started.value = true;
}

export function App() {
  if (!started.value) return <StartScreen onStart={start} />;
  return <div class="screen" />;
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div class="start">
      <h1>Monster Truck<br />Money</h1>
      <button class="big-btn go start-btn" aria-label="Start" onClick={onStart}>
        <span class="e">▶</span>
      </button>
    </div>
  );
}
