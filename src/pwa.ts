// Offline support. The app never depends on the service worker: it registers only on the web (not inside a
// native wrapper or from a file), and nothing reads the Cache API.
export function registerServiceWorker() {
  const native = 'Capacitor' in window;
  if (native || !('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
  navigator.serviceWorker.register('./sw.js').catch(() => { /* offline support is a bonus, never a blocker */ });
}
