import { describe, expect, it } from 'vitest';
import { BODY_IDS, type Rung } from '../catalog';
import { BODIES, parsePath } from './bodies';
import { decalShapes, keptShapes, numberBox, numberSpot, wheelReach } from './sidePaint';

type Pt = [number, number];
const inside = ([x, y]: Pt, poly: Pt[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
/** Points every unit along a shape's outline. */
const along = (poly: Pt[]) => poly.flatMap((a, i) => {
  const b = poly[(i + 1) % poly.length]!, n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])));
  return Array.from({ length: n }, (_, k): Pt => [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
});
const DECALS: Rung[] = [0, 1, 2, 3, 4];

describe('where the Door Number goes', () => {
  it('sits on the Pickup door when no Decal is in the way', () => {
    const s = numberSpot('pickup', 0, 0);
    expect(s.x).toBeGreaterThan(186); expect(s.x).toBeLessThan(244);
  });

  it('moves off the Pickup door when Flames cover it', () => {
    expect(numberSpot('pickup', 2, 0).x).toBeLessThan(190);
  });

  it('breaks the Stripes round a number on them, and leaves them whole with no number', () => {
    const s = numberSpot('pickup', 1, 0);
    expect(decalShapes(BODIES.pickup, 1, s)).toHaveLength(4);
    expect(decalShapes(BODIES.pickup, 1)).toHaveLength(2);
  });

  it('goes on a plate only where the Decal leaves no room, never over the skull or the big bolt', () => {
    expect(numberSpot('pickup', 4, 0).plate).toBe(true);
    expect(numberSpot('police', 4, 0).plate).toBe(false);
    expect(numberSpot('pickup', 2, 4).plate).toBe(true);
    expect(BODY_IDS.every(b => [0, 1, 2, 3].every(d => !numberSpot(b, d as Rung, 0).plate))).toBe(true);
  });

  it('keeps clear of the spikes when there is room, and moves for bigger tires', () => {
    const s = numberSpot('police', 0, 4), box = numberBox(s), w = wheelReach(4);
    for (const x of BODIES.police.wheels) expect(Math.hypot(Math.max(box.x0 - x, 0, x - box.x1), Math.max(box.y0 - w.y, 0, w.y - box.y1))).toBeGreaterThan(w.spikes);
  });

  for (const b of BODY_IDS) for (const d of DECALS) for (const t of DECALS) {
    it(`is readable and clear of the Decal on the ${b} with Decals ${d} and Tires ${t}`, () => {
      const B = BODIES[b], s = numberSpot(b, d, t), box = numberBox(s), w = wheelReach(t);
      // off the tires (their spikes may pass in front where there is no room, and on a short Body with Monster Treads the tire too)
      if (!s.behindTires) for (const x of B.wheels) expect(Math.hypot(Math.max(box.x0 - x, 0, x - box.x1), Math.max(box.y0 - w.y, 0, w.y - box.y1))).toBeGreaterThan(w.tire);
      expect(s.h).toBeGreaterThanOrEqual(16);
      const corners: Pt[] = [[box.x0, box.y0], [box.x1, box.y0], [box.x1, box.y1], [box.x0, box.y1]];
      const shell = parsePath(B.path), wins = parsePath(B.win);
      // on the shell, and off the windows
      for (const p of along(corners)) expect(shell.some(poly => inside(p, poly))).toBe(true);
      for (const p of along(corners)) expect(wins.some(poly => inside(p, poly))).toBe(false);
      for (const w of wins) for (const [x, y] of along(w)) expect(x > box.x0 && x < box.x1 && y > box.y0 && y < box.y1).toBe(false);
      // nothing of the Decal under it, or on a plate nothing it mustn't hide
      for (const shape of s.plate ? keptShapes(B, d) : decalShapes(B, d, s)) {
        for (const [x, y] of along(shape)) expect(x > box.x0 && x < box.x1 && y > box.y0 && y < box.y1).toBe(false);
        for (const p of along(corners)) expect(inside(p, shape)).toBe(false);
      }
    });
  }
});
