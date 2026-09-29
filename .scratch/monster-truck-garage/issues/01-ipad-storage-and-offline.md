# iPad Safari storage and offline for a Home Screen web app

Type: research
Status: resolved
Map: [Monster Truck Garage](../map.md)

## Question

When a static site (GitHub Pages) is saved to the Home Screen on current iPadOS Safari, how reliably does it keep saved data (`localStorage`, IndexedDB), and how does it work offline?

- Does Safari's data eviction for sites that go unvisited (the ITP 7-day rule) apply to Home Screen web apps? Does `navigator.storage.persist()` help?
- Does saved data in a Safari tab carry over to the Home Screen app, or are they separate?
- Offline: do service workers and the web app manifest work well enough for a Home Screen app on iPadOS? Are there cache size limits relevant to about 1–5 MB of images and audio?
- Can audio play without a first tap? (Voice-first depends on this.)
- If the app later becomes a native wrapper (such as Capacitor), what happens to data stored this way?

The storage decision in "Choose the stack" depends on these answers.

## Answer

Full findings: `research/ipad-storage-and-offline.md` on branch `research/ipad-storage-and-offline` (commit 3f2dad0).

- **Home Screen app is safe from 7-day eviction.** Safari's ITP 7-day script-storage wipe does not apply to Home Screen web apps (webkit.org/tracking-prevention). `navigator.storage.persist()` is heuristic-granted and favours Home Screen apps (iPadOS 17+), protecting against low-disk eviction too.
- **Tab and Home Screen storage are separate.** localStorage/IndexedDB don't carry over. Install to Home Screen *before* he starts building.
- **Quota is a non-issue** for 1–5 MB (up to 60% of disk, iPadOS 17+), but localStorage caps at ~5 MiB, so media belongs in the Cache API, not localStorage.
- **iPadOS 26+: manifest optional**; every Home Screen site opens as a web app unless the "Open as Web App" toggle is switched off. Service workers work as usual.
- **Sound needs a tap first.** Unmuted audio and Web Audio need a user gesture; keep a "tap to start" screen. `speechSynthesis` gesture rules are unverified; test on device.
- **Capacitor won't inherit web data** (different origin, `capacitor://localhost`), and Capacitor docs call WebView localStorage transient; they recommend Preferences/SQLite. Implication: put persistence behind a small `load()/save()` seam now.
- **Verify on device:** `persist()` result in the Home Screen app, first-voice-line gesture, offline launch in airplane mode.
