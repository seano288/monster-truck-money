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
  firetruck: {
    W: 1.8, wheels: [100, 290], front: 356, back: 34, mid: 190,
    path: 'M34,0 L34,-98 L252,-98 L258,-116 L318,-116 L348,-66 L356,-60 L356,0 Z',
    win: 'M270,-106 L314,-106 L336,-68 L270,-68 Z', shield: [[318, -116], [348, -66]], rear: null,
    head: [350, -34], roof: [258, 318, -116], hot: { paint: [130, -46], decals: [220, -44], horn: [288, -152] },
  },
  schoolbus: {
    W: 1.8, wheels: [96, 300], front: 368, back: 26, mid: 190,
    path: 'M26,0 L26,-122 L318,-122 L340,-70 L368,-64 L368,0 Z',
    win: 'M40,-112 L84,-112 L84,-82 L40,-82 Z M92,-112 L136,-112 L136,-82 L92,-82 Z M144,-112 L188,-112 L188,-82 L144,-82 Z M196,-112 L240,-112 L240,-82 L196,-82 Z M248,-112 L292,-112 L292,-82 L248,-82 Z',
    shield: [[318, -122], [340, -70]], rear: null,
    head: [362, -40], roof: [40, 318, -122], hot: { paint: [110, -50], decals: [230, -50], horn: [200, -158] },
  },
  jeep: {
    W: 1.7, wheels: [106, 290], front: 340, back: 56, mid: 200,
    path: 'M56,0 L56,-84 L68,-128 L232,-128 L242,-80 L340,-74 L340,0 Z',
    win: 'M80,-118 L146,-118 L146,-88 L74,-88 Z M156,-118 L222,-118 L230,-88 L156,-88 Z', shield: [[232, -128], [242, -80]], rear: [[56, -84], [68, -128]],
    head: [334, -44], roof: [68, 232, -128], hot: { paint: [150, -44], decals: [290, -40], horn: [150, -166] },
  },
};

export const U = 100;
export const toX = (x: number) => (x - 200) / U;
export const toY = (y: number) => -y / U;

/** Tire radius (profile units) and width (scene units) per Tires Rung. */
export const TIRE_R = [30, 38, 48, 52, 56] as const;
export const TIRE_W = [0.32, 0.4, 0.5, 0.56, 0.64] as const;
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
