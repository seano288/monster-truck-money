// Each Body's side profile, in the prototype's SVG units: x runs to the front, y is up when negative.
// toX/toY turn them into scene units.
import type { BodyId } from '../catalog';

export interface BodyShape {
  /** Width of the shell across the Truck, in scene units. */
  W: number;
  /** x of the rear and front axles. */
  wheels: [number, number];
  front: number;
  back: number;
  mid: number;
  /** The shell outline (one or more closed polygons). */
  path: string;
  /** Side windows, cut from the paint and filled with glass. */
  win: string;
  /** Windshield and rear window edges, as two points each. */
  shield: [[number, number], [number, number]];
  rear: [[number, number], [number, number]] | null;
  head: [number, number];
  /** Roof: x from, x to, y. */
  roof: [number, number, number];
  /** Hotspot points on the side for Slots that sit on the shell. */
  hot: { paint: [number, number]; decals: [number, number]; horn: [number, number] };
}

export const BODIES: Record<BodyId, BodyShape> = {
  pickup: {
    W: 1.7, wheels: [110, 290], front: 342, back: 60, mid: 200,
    path: 'M60,0 L60,-42 L150,-45 L172,-88 L262,-88 L288,-48 L342,-42 L342,0 Z',
    win: 'M182,-80 L252,-80 L270,-50 L182,-50 Z', shield: [[262, -88], [288, -48]], rear: [[150, -45], [172, -88]],
    head: [336, -30], roof: [182, 262, -88], hot: { paint: [160, -24], decals: [248, -22], horn: [222, -124] },
  },
  bigfoot: {
    W: 1.8, wheels: [118, 282], front: 330, back: 72, mid: 200,
    path: 'M72,0 L72,-62 L112,-112 L288,-112 L330,-64 L330,0 Z',
    win: 'M122,-100 L195,-100 L195,-68 L100,-68 Z M205,-100 L280,-100 L310,-68 L205,-68 Z', shield: [[288, -112], [330, -64]], rear: [[72, -62], [112, -112]],
    head: [324, -46], roof: [112, 288, -112], hot: { paint: [168, -40], decals: [250, -36], horn: [200, -148] },
  },
  dragster: {
    W: 1.3, wheels: [92, 316], front: 362, back: 38, mid: 210,
    path: 'M38,0 L38,-32 L140,-36 L188,-72 L238,-72 L262,-36 L362,-22 L362,0 Z M38,-32 L26,-78 L74,-78 L74,-34 Z',
    win: 'M196,-64 L232,-64 L248,-38 L196,-38 Z', shield: [[238, -72], [262, -36]], rear: null,
    head: [354, -12], roof: [190, 236, -72], hot: { paint: [160, -20], decals: [290, -15], horn: [214, -110] },
  },
};

export const U = 100;
export const toX = (x: number) => (x - 200) / U;
export const toY = (y: number) => -y / U;

/** Tire radius (profile units) and width (scene units) per Tires Rung. */
export const TIRE_R = [30, 38, 48, 52] as const;
export const TIRE_W = [0.32, 0.4, 0.5, 0.56] as const;
/** Ride height per tire radius. */
export const LIFT = 1.35;

export function parsePath(d: string): [number, number][][] {
  const subs: [number, number][][] = [];
  let cur: [number, number][] = [];
  for (const m of d.matchAll(/([MLZ])([^MLZ]*)/g)) {
    const n = m[2]!.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (m[1] === 'M') { cur = [[n[0]!, n[1]!]]; subs.push(cur); }
    else if (m[1] === 'L') cur.push([n[0]!, n[1]!]);
  }
  return subs;
}
