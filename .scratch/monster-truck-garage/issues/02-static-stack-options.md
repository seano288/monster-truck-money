# Static stack options that keep a native app possible

Type: research
Status: resolved
Map: [Monster Truck Garage](../map.md)

## Question

What are the realistic static-only stacks for this app, and how do they compare? Compare them on: iPad Safari performance, keeping a no-scroll layout that adapts to portrait and landscape, handling about 1–5 MB of images and audio, a GitHub Pages deploy, how easily a coding agent can work on it, and the path to a native wrapper (Capacitor, or others).

Candidates:
- Keep one self-contained HTML file (current approach)
- Vite + vanilla TS, with assets as separate files
- Vite + a light UI library (Preact, Svelte, Solid)
- Vite + React

Also cover how layered truck art (SVG vs PNG sprites vs canvas) fits each option, and how `tools/make_voice.py`, which currently embeds base64 audio into the HTML, would fit into each.

"Choose the stack" uses these facts to make the decision.

## Answer

Full findings: `research/static-stack-options.md` on branch `research/static-stack-options` (commit 9905ee2; based on e9351a5). Trade-offs only; the decision is "Choose the stack".

- **Single HTML:** no build step and a trivial Capacitor path, but base64 adds ~33% (about 0.3 MB of today's 1.1 MB), it all caches as one blob, and the two ~1 MB lines are awkward for agents to read.
- **JS weight (gzip, measured with Vite 8.3.1):** vanilla-ts ~2 kB, Solid 5.7, Preact 7.3, Svelte 12.3, React 69.3.
- **No-scroll layout doesn't separate the options:** `dvh`/`svh` (Safari 15.4+) and container queries (16+) do the work in any stack.
- **Offline with Vite:** `vite-plugin-pwa` works with all four, but images and MP3s must be added to the precache patterns explicitly, and Workbox skips files over 2 MB by default.
- **GitHub Pages:** the official Vite workflow works; use `base: './'` (suits Capacitor too). The current workflow's actions are outdated (checkout v4 → v6, upload-pages-artifact v3 → v4).
- **Capacitor v8:** works with any option (iOS 15+, a `webDir` containing `index.html`); use a swappable storage module (matches "iPad Safari storage and offline").
- **Agent ergonomics:** React is the most familiar to models but has the most boilerplate. Preact is React-compatible. Svelte 5 runes can be confused with older syntax. Solid looks like React but behaves differently.
- **Voice pipeline:** for Vite options, `make_voice.py` would write `public/voice/*.mp3` plus a generated TS manifest, so a type check can catch phrases with no clip.
- **Open gaps:** whether service workers run inside Capacitor's WKWebView; SVG vs PNG vs canvas performance on a real iPad.
