import '@fontsource/bungee/latin-400.css';
import '@fontsource/nunito/latin-800.css';
import '@fontsource/nunito/latin-900.css';
import './styles.css';
import { render } from 'preact';
import { App } from './app/App';

render(<App />, document.getElementById('app')!);
