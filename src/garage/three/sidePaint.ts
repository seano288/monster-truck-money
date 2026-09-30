// What is painted on the Truck's side, as shapes in profile units: the Decals, and the spot for the Door Number.
// The number goes as near the door as it can, as big as it can, on the shell and clear of the windows, the wheels
// and whichever Decal is fitted, so nothing is drawn over anything else. Where the fitted Tires' spikes leave no room
// it lets them pass in front of it, and where the Decal leaves no room it goes on a plate.
import type { BodyId, Rung } from '../catalog';
import { BODIES, parsePath, TIRE_R, TREAD, type BodyShape } from './bodies';

type Pt = [number, number];

export const FLAME1 = 'M0,-3 C-40,-3 -60,-30 -90,-20 C-72,-36 -100,-46 -120,-32 C-106,-52 -134,-58 -152,-40 C-142,-16 -100,-1 -60,1 Z';
export const FLAME2 = 'M0,-3 C-30,-4 -44,-20 -64,-14 C-52,-26 -72,-30 -86,-22 C-80,-10 -50,-1 -30,0 Z';
export const BOLT = 'M-4,-54 L-26,-18 L-8,-20 L-20,6 L18,-32 L0,-30 L12,-54 Z';
export const WING = 'M-12,-34 C-34,-62 -74,-62 -94,-48 C-78,-46 -82,-38 -94,-32 C-78,-30 -80,-22 -90,-16 C-60,-14 -32,-20 -12,-26 Z';
/** The skull of Skull & Wings: its head and its jaw, [x, y, radius] and [x, y, width, height] from mid. */
export const SKULL = { head: [0, -36, 15], jaw: [-9, -26, 18, 10] } as const;
/** Stripes: two white bands along the whole side, [top, height]. */
export const STRIPES = [[-26, 6], [-16, 6]] as const;
/** The Lightning bolts: [x offset from mid, scale]. */
export const BOLTS = [[0, 1], [-100, 0.7]] as const;

/** An SVG path of M, L, C and Z as polygons, each curve cut into straight pieces. */
function flatten(d: string): Pt[][] {
  const out: Pt[][] = [];
  let cur: Pt[] = [];
  for (const m of d.matchAll(/([MLCZ])([^MLCZ]*)/g)) {
    const n = m[2]!.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (m[1] === 'M') { cur = [[n[0]!, n[1]!]]; out.push(cur); }
    else if (m[1] === 'L') cur.push([n[0]!, n[1]!]);
    else if (m[1] === 'C') {
      for (let i = 0; i + 5 < n.length; i += 6) {
        const [x0, y0] = cur[cur.length - 1]!, [x1, y1, x2, y2, x3, y3] = n.slice(i, i + 6) as [number, number, number, number, number, number];
        for (let k = 1; k <= 12; k++) {
          const t = k / 12, u = 1 - t;
          cur.push([u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]);
        }
      }
    }
  }
  return out;
}

const move = (polys: Pt[][], dx: number, sx = 1, s = 1): Pt[][] => polys.map(p => p.map(([x, y]): Pt => [dx + sx * s * x, s * y]));
const rect = (x: number, y: number, w: number, h: number): Pt[] => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const circle = (cx: number, cy: number, r: number): Pt[] => Array.from({ length: 24 }, (_, i): Pt => [cx + r * Math.cos((i * Math.PI) / 12), cy + r * Math.sin((i * Math.PI) / 12)]);
const skull = (B: BodyShape) => move([circle(...SKULL.head), rect(...SKULL.jaw)], B.mid);

/** The outline of each part of a Decal, where drawPaint draws it. The Stripes break round a Door Number on them. */
export function decalShapes(B: BodyShape, decals: Rung, around: NumberSpot | null = null): Pt[][] {
  switch (decals) {
    case 0: return [];
    case 1: {
      const x0 = B.back - 20, x1 = B.front + 20, box = around && numberBox(around);
      return STRIPES.flatMap(([y, h]) => {
        if (!box || box.y1 + GAP < y || box.y0 - GAP > y + h) return [rect(x0, y, x1 - x0, h)];
        return [rect(x0, y, box.x0 - GAP - x0, h), rect(box.x1 + GAP, y, x1 - box.x1 - GAP, h)];
      });
    }
    case 2: return [...move(flatten(FLAME1), B.front), ...move(flatten(FLAME2), B.front)];
    case 3: return BOLTS.flatMap(([dx, s]) => move(flatten(BOLT), B.mid + dx, 1, s));
    case 4: return [...move(flatten(WING), B.mid), ...move(flatten(WING), B.mid, -1), ...skull(B)];
  }
}

/** The parts of a Decal a number plate must never hide: the big Lightning bolt, and the skull of Skull & Wings. The rest can go under a plate. */
export function keptShapes(B: BodyShape, decals: Rung): Pt[][] {
  if (decals === 3) return move(flatten(BOLT), B.mid + BOLTS[0][0], 1, BOLTS[0][1]);
  if (decals === 4) return skull(B);
  return [];
}

/**
 * Where the Door Number goes: the middle of its digits and how tall they are, in profile units. On a plate, it
 * covers the Decal under it: that only happens where the Decal leaves no room for a number of H_MIN.
 */
export interface NumberSpot {
  x: number; y: number; h: number; plate: boolean;
  /** The last resort, on a short Body with big tires: the tops of the tires pass in front of the plate. */
  behindTires: boolean;
}
/** The room the number takes: two digits, and the Flaming style's flames above them (or the plate). */
export function numberBox({ x, y, h }: { x: number; y: number; h: number }) {
  return { x0: x - 0.8 * h, x1: x + 0.8 * h, y0: y - 0.8 * h, y1: y + 0.5 * h };
}

const H_MAX = 30, H_MIN = 16;
/** Clear space kept round the number: from the shell's edge (past its rounded bevel), and from everything else. */
const EDGE = 8, GAP = 4;
// the grid everything is looked up on: 1 unit cells over x 0..400, y -140..0
const X0 = 0, Y0 = -140, GW = 400, GH = 140;

type Grid = Uint8Array;
const grid = (): Grid => new Uint8Array(GW * GH);
/** Mark the cells inside these shapes (each cell by its middle), a row at a time: between each pair of edge crossings. */
function fill(g: Grid, polys: readonly Pt[][], on = 1) {
  for (const p of polys) {
    for (let j = 0; j < GH; j++) {
      const y = Y0 + j + 0.5, xs: number[] = [];
      for (let i = 0, k = p.length - 1; i < p.length; k = i++) {
        const [xi, yi] = p[i]!, [xk, yk] = p[k]!;
        if (yi > y !== yk > y) xs.push(xi + ((y - yi) * (xk - xi)) / (yk - yi));
      }
      xs.sort((u, v) => u - v);
      for (let n = 0; n + 1 < xs.length; n += 2) {
        for (let i = Math.max(0, Math.ceil(xs[n]! - X0 - 0.5)); i < Math.min(GW, Math.ceil(xs[n + 1]! - X0 - 0.5)); i++) g[j * GW + i] = on;
      }
    }
  }
  return g;
}

/** A summed-area table of a grid, so any box can be checked for marked cells at once. Off the grid counts as marked. */
function table(g: Grid) {
  const S = new Int32Array((GW + 1) * (GH + 1));
  for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) S[(j + 1) * (GW + 1) + i + 1] = g[j * GW + i]! + S[j * (GW + 1) + i + 1]! + S[(j + 1) * (GW + 1) + i]! - S[j * (GW + 1) + i]!;
  return (x0: number, y0: number, x1: number, y1: number) => {
    if (x0 < X0 || y0 < Y0 || x1 > X0 + GW || y1 > Y0 + GH) return 1;
    const i0 = Math.floor(x0 - X0), i1 = Math.ceil(x1 - X0), j0 = Math.floor(y0 - Y0), j1 = Math.ceil(y1 - Y0);
    return S[j1 * (GW + 1) + i1]! - S[j0 * (GW + 1) + i1]! - S[j1 * (GW + 1) + i0]! + S[j0 * (GW + 1) + i0]!;
  };
}

/** Things painted on some Bodies that a number shouldn't cover: the School Bus's black bands, the Ice Cream Truck's awning. */
const EXTRAS: Partial<Record<BodyId, Pt[][]>> = {
  schoolbus: [rect(0, -66, 400, 4), rect(0, -46, 400, 4)],
  icecream: [rect(88, -118, 114, 16)],
};

/** The fitted Tires, seen from the side: where their middles are (below the shell's bottom), the tire with its tread, and its spikes. */
export function wheelReach(tires: Rung) {
  const r = TIRE_R[tires], tire = r + TREAD[tires];
  return { y: 0.35 * r + 8, tire, spikes: tire + [0, 0, 0, 14, 20][tires]! };
}

const cache = new Map<string, NumberSpot>();

export function numberSpot(bodyId: BodyId, decals: Rung, tires: Rung): NumberSpot {
  const key = `${bodyId}:${decals}:${tires}`, hit = cache.get(key);
  if (hit) return hit;
  const B = BODIES[bodyId], wheel = wheelReach(tires);
  const offShell = table(fill(grid().fill(1), parsePath(B.path), 0));
  const wheels = (reach: number) => {
    const g = fill(grid(), [...parsePath(B.win), ...(EXTRAS[bodyId] ?? [])]);
    for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
      const x = X0 + i + 0.5, y = Y0 + j + 0.5;
      if (y > -8 || B.wheels.some(w => Math.hypot(x - w, y - wheel.y) < reach + 2)) g[j * GW + i] = 1; // mud along the bottom, and the wheels
    }
    return g;
  };
  const spiky = wheels(wheel.spikes), round = wheels(wheel.tire), bare = wheels(-Infinity);
  const [tx, ty] = B.door, spots: Pt[] = [];
  for (let y = -130; y <= -10; y++) for (let x = B.back; x <= B.front; x++) spots.push([x, y]);
  const far = spots.map(([x, y]) => (x - tx) ** 2 + (y - ty) ** 2), order = Uint32Array.from(spots.keys()).sort((a, b) => far[a]! - far[b]!); // nearest the door first
  const find = (blocked: ReturnType<typeof table>, hMin: number) => {
    for (let h = H_MAX; h >= hMin; h -= 2) {
      for (const k of order) {
        const [x, y] = spots[k]!, b = numberBox({ x, y, h });
        if (!offShell(b.x0 - EDGE, b.y0 - EDGE, b.x1 + EDGE, b.y1 + EDGE) && !blocked(b.x0 - GAP, b.y0 - GAP, b.x1 + GAP, b.y1 + GAP)) return { x, y, h };
      }
    }
    return null;
  };
  const art = decals === 1 ? [] : decalShapes(B, decals), kept = keptShapes(B, decals); // the Stripes break for it
  let s: NumberSpot | null = null;
  const tries = [[spiky, art, false], [round, art, false], [spiky, kept, true], [round, kept, true], [bare, kept, true]] as const;
  for (const [base, shapes, plate] of tries) {
    const at = find(table(fill(base.slice(), shapes)), H_MIN);
    if (at) { s = { ...at, plate, behindTires: base === bare }; break; }
  }
  s ??= { x: B.door[0], y: B.door[1], h: H_MIN, plate: true, behindTires: true }; // no room anywhere (no Body today): a small plate on the door
  cache.set(key, s);
  return s;
}
