import { unlockAudio } from '../audio/context';
import { RoundScreen } from '../round/RoundScreen';
import { Toast } from '../ui/toast';
import { say } from '../voice/say';
import { Home } from './Home';
import { screen } from './nav';

function start() {
  unlockAudio(); // sound needs this tap on iPad Safari
  void say("Let's go!");
  screen.value = 'home';
}

export function App() {
  return (
    <>
      {screen.value === 'start' && <StartScreen />}
      {screen.value === 'home' && <Home />}
      {screen.value === 'round' && <RoundScreen />}
      <Toast />
    </>
  );
}

function StartScreen() {
  return (
    <div class="start">
      <h1>Monster Truck<br />Money</h1>
      <button class="big-btn go start-btn" aria-label="Start" onClick={start}>
        <span class="e">▶</span>
      </button>
    </div>
  );
}
