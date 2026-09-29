import { signal } from '@preact/signals';

const started = signal(false);

export function App() {
  if (!started.value) return <StartScreen onStart={() => (started.value = true)} />;
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
