// One AudioContext for the voice and every sound effect. iPad Safari only lets it play after a tap,
// so unlockAudio() is called from the tap-to-start button.
let ctx: AudioContext | null = null;

export function audio(): AudioContext {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function unlockAudio() {
  const c = audio();
  const src = c.createBufferSource(); // a silent buffer, played inside the tap
  src.buffer = c.createBuffer(1, 1, 22050);
  src.connect(c.destination);
  src.start();
}
