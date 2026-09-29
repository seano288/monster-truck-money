import { unlockAudio } from '../audio/context';
import { BodyPicker } from '../garage/BodyPicker';
import { GarageScreen } from '../garage/GarageScreen';
import { IconDefs } from '../garage/icons';
import { game } from '../game/store';
import { RoundScreen } from '../round/RoundScreen';
import { Toast } from '../ui/toast';
import { say } from '../voice/say';
import { Home } from './Home';
import { screen } from './nav';

function start() {
  unlockAudio(); // sound needs this tap on iPad Safari
  void say("Let's go!");
  screen.value = game.value.body ? 'home' : 'body'; // first launch only: choose a Body
}

export function App() {
  return (
    <>
      {screen.value === 'start' && <StartScreen />}
      {screen.value === 'home' && <Home />}
      {screen.value === 'body' && <BodyPicker />}
      {screen.value === 'round' && <RoundScreen />}
      {screen.value === 'garage' && <GarageScreen />}
      <IconDefs />
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
