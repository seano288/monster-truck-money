// Prints the phrase list as JSON for tools/make_voice.py.
import { PHRASES } from '../src/voice/phrases';

process.stdout.write(JSON.stringify(PHRASES));
