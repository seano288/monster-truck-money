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
  /** x where the Exhaust stacks rise from the shell's top: behind the cab, on the roof of a Body that is all cab, or up through a Tractor's hood. */
  stack: number;
  /** Hotspot points for Slots that sit on the shell: Paint and Decals on the side, Horn over the roof, Engine on the hood. */
  hot: { paint: [number, number]; decals: [number, number]; horn: [number, number]; engine: [number, number] };
}

export const BODIES: Record<BodyId, BodyShape> = {
  pickup: {
    W: 1.7, wheels: [110, 290], front: 342, back: 60, mid: 200,
    path: 'M60,0 L60,-42 L150,-45 L172,-88 L262,-88 L288,-48 L342,-42 L342,0 Z',
    win: 'M182,-80 L252,-80 L270,-50 L182,-50 Z', shield: [[262, -88], [288, -48]], rear: [[150, -45], [172, -88]],
    head: [336, -30], roof: [182, 262, -88], stack: 140, hot: { paint: [160, -24], decals: [248, -22], horn: [222, -124], engine: [318, -62] },
  },
  bigfoot: {
    W: 1.8, wheels: [118, 282], front: 330, back: 72, mid: 200,
    path: 'M72,0 L72,-62 L112,-112 L288,-112 L330,-64 L330,0 Z',
    win: 'M122,-100 L195,-100 L195,-68 L100,-68 Z M205,-100 L280,-100 L310,-68 L205,-68 Z', shield: [[288, -112], [330, -64]], rear: [[72, -62], [112, -112]],
    head: [324, -46], roof: [112, 288, -112], stack: 136, hot: { paint: [168, -40], decals: [250, -36], horn: [200, -148], engine: [326, -76] },
  },
  dragster: {
    W: 1.3, wheels: [92, 316], front: 362, back: 38, mid: 210,
    path: 'M38,0 L38,-32 L140,-36 L188,-72 L238,-72 L262,-36 L362,-22 L362,0 Z M38,-32 L26,-78 L74,-78 L74,-34 Z',
    win: 'M196,-64 L232,-64 L248,-38 L196,-38 Z', shield: [[238, -72], [262, -36]], rear: null,
    head: [354, -12], roof: [190, 236, -72], stack: 120, hot: { paint: [160, -20], decals: [290, -15], horn: [214, -110], engine: [300, -46] },
  },
  firetruck: {
    W: 1.8, wheels: [100, 290], front: 356, back: 34, mid: 190,
    path: 'M34,0 L34,-98 L252,-98 L258,-116 L318,-116 L348,-66 L356,-60 L356,0 Z',
    win: 'M270,-106 L314,-106 L336,-68 L270,-68 Z', shield: [[318, -116], [348, -66]], rear: null,
    head: [350, -34], roof: [258, 318, -116], stack: 246, hot: { paint: [130, -46], decals: [220, -44], horn: [288, -152], engine: [352, -76] },
  },
  schoolbus: {
    W: 1.8, wheels: [96, 300], front: 368, back: 26, mid: 190,
    path: 'M26,0 L26,-122 L318,-122 L340,-70 L368,-64 L368,0 Z',
    win: 'M40,-112 L84,-112 L84,-82 L40,-82 Z M92,-112 L136,-112 L136,-82 L92,-82 Z M144,-112 L188,-112 L188,-82 L144,-82 Z M196,-112 L240,-112 L240,-82 L196,-82 Z M248,-112 L292,-112 L292,-82 L248,-82 Z',
    shield: [[318, -122], [340, -70]], rear: null,
    head: [362, -40], roof: [40, 318, -122], stack: 60, hot: { paint: [110, -50], decals: [230, -50], horn: [200, -158], engine: [354, -82] },
  },
  jeep: {
    W: 1.7, wheels: [106, 290], front: 340, back: 56, mid: 200,
    path: 'M56,0 L56,-84 L68,-128 L232,-128 L242,-80 L340,-74 L340,0 Z',
    win: 'M80,-118 L146,-118 L146,-88 L74,-88 Z M156,-118 L222,-118 L230,-88 L156,-88 Z', shield: [[232, -128], [242, -80]], rear: [[56, -84], [68, -128]],
    head: [334, -44], roof: [68, 232, -128], stack: 92, hot: { paint: [150, -44], decals: [290, -40], horn: [150, -166], engine: [292, -92] },
  },
  towtruck: {
    W: 1.7, wheels: [110, 290], front: 352, back: 40, mid: 200,
    path: 'M40,0 L40,-44 L200,-44 L206,-104 L290,-104 L318,-60 L352,-54 L352,0 Z',
    win: 'M216,-96 L284,-96 L304,-62 L216,-62 Z', shield: [[290, -104], [318, -60]], rear: [[200, -44], [206, -104]],
    head: [346, -40], roof: [206, 290, -104], stack: 190, hot: { paint: [120, -24], decals: [262, -30], horn: [248, -140], engine: [336, -68] },
  },
  dumptruck: {
    W: 1.8, wheels: [100, 296], front: 360, back: 30, mid: 195,
    path: 'M30,0 L30,-118 L232,-118 L240,-50 L250,-50 L256,-110 L312,-110 L342,-64 L360,-58 L360,0 Z',
    win: 'M266,-100 L308,-100 L330,-68 L266,-68 Z', shield: [[312, -110], [342, -64]], rear: null,
    head: [354, -36], roof: [256, 312, -110], stack: 245, hot: { paint: [120, -50], decals: [300, -34], horn: [284, -146], engine: [352, -74] },
  },
  police: {
    W: 1.8, wheels: [108, 290], front: 350, back: 50, mid: 200,
    path: 'M50,0 L50,-70 L90,-116 L270,-116 L300,-70 L350,-62 L350,0 Z',
    win: 'M100,-106 L180,-106 L180,-76 L82,-76 Z M190,-106 L264,-106 L288,-76 L190,-76 Z', shield: [[270, -116], [300, -70]], rear: [[50, -70], [90, -116]],
    head: [344, -44], roof: [90, 270, -116], stack: 112, hot: { paint: [140, -36], decals: [240, -36], horn: [150, -152], engine: [326, -80] },
  },
  icecream: {
    W: 1.8, wheels: [96, 296], front: 360, back: 30, mid: 195,
    path: 'M30,0 L30,-124 L290,-124 L300,-80 L360,-70 L360,0 Z',
    win: 'M90,-104 L200,-104 L200,-66 L90,-66 Z M246,-112 L284,-112 L292,-80 L246,-80 Z', shield: [[290, -124], [300, -80]], rear: null,
    head: [354, -44], roof: [30, 290, -124], stack: 50, hot: { paint: [140, -36], decals: [260, -40], horn: [250, -160], engine: [336, -86] },
  },
  tractor: {
    W: 1.7, wheels: [120, 290], front: 350, back: 60, mid: 200,
    path: 'M60,0 L60,-60 L90,-60 L96,-128 L200,-128 L206,-60 L350,-56 L350,0 Z',
    win: 'M106,-118 L190,-118 L194,-70 L102,-70 Z', shield: [[200, -128], [206, -60]], rear: [[90, -60], [96, -128]],
    head: [344, -40], roof: [96, 200, -128], stack: 300, hot: { paint: [150, -30], decals: [290, -28], horn: [148, -164], engine: [250, -90] },
  },
  racecar: {
    W: 1.5, wheels: [96, 300], front: 366, back: 36, mid: 200,
    path: 'M36,0 L36,-40 L130,-46 L180,-78 L250,-78 L300,-40 L366,-28 L366,0 Z M40,-40 L32,-62 L22,-62 L22,-74 L96,-74 L96,-62 L84,-62 L78,-44 Z',
    win: 'M190,-70 L244,-70 L284,-42 L190,-42 Z', shield: [[250, -78], [300, -40]], rear: [[130, -46], [180, -78]],
    head: [360, -18], roof: [180, 250, -78], stack: 115, hot: { paint: [150, -22], decals: [320, -22], horn: [214, -114], engine: [110, -80] },
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
