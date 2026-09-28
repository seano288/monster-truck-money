"""Record every phrase the game says with a natural neural voice and embed the clips
into monster-truck-money.html (the `const VOICE = ...` line).

  python3 -m venv .venv && .venv/bin/pip install edge-tts
  .venv/bin/python tools/make_voice.py

Phrases are keyed by the exact text the game passes to say(). Anything without a clip
falls back to the browser's built-in voice, so add new phrases here when the game changes.
"""
import asyncio, base64, json, re, tempfile
from pathlib import Path
import edge_tts

VOICE = 'en-US-AvaNeural'
RATE = '-8%'
HTML = Path(__file__).resolve().parent.parent / 'monster-truck-money.html'

MONEY = [('Penny', '1¢'), ('Nickel', '5¢'), ('Dime', '10¢'), ('Quarter', '25¢'), ('$1 Bill', '$1'), ('$5 Bill', '$5')]
CHEERS = ['VROOM! Great job!', 'Monster move!', 'You got it!', 'Truck-tastic!', 'Crushing it!', 'Awesome counting!']

PHRASES = [
    'What is this called?', 'How much is this worth?', 'Which is worth more?', 'Which is worth less?',
    'Try again!', 'The dime is small, but it is worth more!', 'Tap a coin to hear its name.',
    'You crushed it!', 'You won a trophy!', *CHEERS,
]
for name, value in MONEY:
    PHRASES += [f'Tap the {name}!', f'{name}?', f'{value}?', f"That's a {name}.", f'Find the {name}!', f'{name} is {value}.']


def speakable(s):
    for a, b in [('$1 Bill', 'one dollar bill'), ('$5 Bill', 'five dollar bill'), ('$1', 'one dollar'), ('$5', 'five dollars'),
                 ('VROOM', 'Vroom'), ('Truck-tastic', 'Truck tastic')]:
        s = s.replace(a, b)
    return re.sub(r'(\d+)¢', lambda m: 'one cent' if m[1] == '1' else f'{m[1]} cents', s)


async def record(text, out):
    await edge_tts.Communicate(speakable(text), VOICE, rate=RATE).save(out)
    return base64.b64encode(Path(out).read_bytes()).decode()


async def main():
    with tempfile.TemporaryDirectory() as tmp:
        clips = await asyncio.gather(*(record(t, f'{tmp}/{i}.mp3') for i, t in enumerate(PHRASES)))
    voice = json.dumps({t: f'data:audio/mpeg;base64,{c}' for t, c in zip(PHRASES, clips)}, ensure_ascii=False)
    html = HTML.read_text()
    html, n = re.subn(r'^const VOICE = .*$', lambda _: f'const VOICE = {voice};', html, flags=re.M)
    assert n == 1, 'const VOICE line not found'
    HTML.write_text(html)
    print(f'Embedded {len(PHRASES)} clips ({sum(map(len, clips)) // 1024} KB) with {VOICE}')

asyncio.run(main())
