import '@fontsource/bungee/latin-400.css';
import '@fontsource/nunito/latin-800.css';
import '@fontsource/nunito/latin-900.css';
import './styles.css';
import { render } from 'preact';
import { App } from './app/App';
import { loadGame } from './game/store';
import { registerServiceWorker } from './pwa';

void loadGame().then(() => render(<App />, document.getElementById('app')!));
registerServiceWorker();
