// Builds the Truck in the "Real" look, all in code: the Body's side profile extruded with rounded corners and
// a clear-coat, one canvas texture for Paint and Decals projected from the side, a tube chassis with 4-link
// suspension and coil-overs, lathe-turned tires with tread that grows per Mod, beadlock rims, and per-Body extras.
// The Legendaries (Rung 4) go a step past the top Rung: gold spiked paddle tires, flaked gold paint, a skull with
// wings, spinning lasers and a roof-top train horn.
// Ported from the "3D Garage" prototype (prototype/garage-screen @ 9780a65).
import * as THREE from 'three';
import type { BodyId, Fit, SlotId } from '../catalog';
import { BODIES, LIFT, parsePath, TIRE_R, TIRE_W, toX, toY, U, type BodyShape } from './bodies';

const V3 = THREE.Vector3, V2 = THREE.Vector2;
type Pt = [number, number];

// ---------- materials shared by every build ----------
const std = (c: number, o: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({ color: c, ...o });
const M = {
  rubber: std(0x1b1b1c, { roughness: 0.96 }),
  dark: std(0x1e2126, { roughness: 0.45, metalness: 0.6 }),
  chrome: std(0xf2f2f2, { roughness: 0.07, metalness: 1 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x101c26, roughness: 0.03, metalness: 0.2, clearcoat: 1 }),
  shock: std(0xff5a1f, { roughness: 0.3, metalness: 0.5 }),
  frame: std(0x2b62d9, { roughness: 0.35, metalness: 0.4 }),
  liner: std(0x0b0b0c, { roughness: 1 }),
  gold: std(0xffc21a, { roughness: 0.18, metalness: 1, emissive: 0x6a4a00, emissiveIntensity: 0.6 }),
};
const SHARED = new Set<THREE.Material>(Object.values(M));
// Shell: R = corner rounding (profile units), bt/bs = bevel thickness/size
const SH = { R: 9, bt: 0.07, bs: 0.06, seg: 5 };
const RIM_C = [0xb9c0c8, 0xd8dde3, 0xffcc33, 0xff3df0, 0xffd700] as const;


const glowTex = (() => {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!, rg = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.5, 'rgba(255,255,255,.5)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
})();

// ---------- geometry helpers ----------
const shapes = (d: string) => parsePath(d).map(pts => {
  const s = new THREE.Shape();
  pts.forEach(([x, y], i) => (i ? s.lineTo(toX(x), toY(y)) : s.moveTo(toX(x), toY(y))));
  s.closePath();
  return s;
});
/** The same outline with every corner rounded (rad in profile units). */
function roundShape(pts: Pt[], rad: number) {
  const s = new THREE.Shape(), P = pts.map(([x, y]) => new V2(toX(x), toY(y))), n = P.length;
  for (let i = 0; i < n; i++) {
    const p = P[i]!, a = P[(i - 1 + n) % n]!, b = P[(i + 1) % n]!;
    const p1 = p.clone().add(a.clone().sub(p).setLength(Math.min(rad / U, p.distanceTo(a) * 0.45)));
    const p2 = p.clone().add(b.clone().sub(p).setLength(Math.min(rad / U, p.distanceTo(b) * 0.45)));
    if (i === 0) s.moveTo(p1.x, p1.y); else s.lineTo(p1.x, p1.y);
    s.quadraticCurveTo(p.x, p.y, p2.x, p2.y);
  }
  s.closePath();
  return s;
}
const shellShapes = (d: string, R: number) => (R ? parsePath(d).map(q => roundShape(q, R)) : shapes(d));

/** Smooth normals across edges shallower than deg (extrusions come out flat shaded). */
function creaseNormals(geo: THREE.BufferGeometry, deg: number) {
  const p = geo.attributes.position!, n = geo.attributes.normal!, cos = Math.cos((deg * Math.PI) / 180), groups = new Map<string, number[]>();
  for (let i = 0; i < p.count; i++) {
    const k = `${Math.round(p.getX(i) * 1e4)}_${Math.round(p.getY(i) * 1e4)}_${Math.round(p.getZ(i) * 1e4)}`;
    let g = groups.get(k);
    if (!g) groups.set(k, (g = []));
    g.push(i);
  }
  const out = new Float32Array(p.count * 3), a = new V3(), b = new V3(), sum = new V3();
  for (const g of groups.values()) for (const i of g) {
    a.fromBufferAttribute(n, i); sum.set(0, 0, 0);
    for (const j of g) { b.fromBufferAttribute(n, j); if (a.dot(b) >= cos) sum.add(b); }
    sum.normalize(); out[i * 3] = sum.x; out[i * 3 + 1] = sum.y; out[i * 3 + 2] = sum.z;
  }
  geo.setAttribute('normal', new THREE.BufferAttribute(out, 3));
  return geo;
}

function seeded(seed: number) {
  let s = seed;
  return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---------- the build ----------
export interface TruckAnim {
  /** Mega Spikes and Monster Treads wheels turn slowly. */
  spin: THREE.Object3D[];
  /** Laser Show beams sweep round. */
  lasers: THREE.Object3D | null;
  /** Glow Under pulses. */
  glow: { m: THREE.MeshBasicMaterial; l: THREE.PointLight } | null;
  /** Rainbow Chrome paint shimmers and Gold Flake twinkles, so its canvas is redrawn each frame. */
  repaint: ((t: number) => void) | null;
}

export interface BuiltTruck {
  group: THREE.Group;
  anim: TruckAnim;
  /** Hotspot anchors in the Truck's space; the side ones are mirrored to whichever side the camera is on. */
  anchors(side: 1 | -1): Record<SlotId, { p: THREE.Vector3; n: THREE.Vector3 | null; min: number }>;
  dispose(): void;
}

class Builder {
  readonly B: BodyShape;
  readonly r: number;
  readonly tw: number;
  readonly ch: number;
  readonly W: number;
  readonly own: THREE.Material[] = [];
  readonly truck = new THREE.Group();
  readonly body = new THREE.Group();
  readonly anim: TruckAnim = { spin: [], lasers: null, glow: null, repaint: null };

  constructor(readonly bodyId: BodyId, readonly f: Fit) {
    this.B = BODIES[bodyId];
    this.r = TIRE_R[f.tires] / U;
    this.tw = TIRE_W[f.tires];
    this.ch = this.r * LIFT + 0.08;
    this.W = this.B.W;
    this.body.position.y = this.ch;
    this.truck.add(this.body);
  }

  mat<T extends THREE.Material>(m: T): T { this.own.push(m); return m; }
  glow(c: number, i = 2.5) { return this.mat(new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i })); }
  box(w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); return o;
  }
  cyl(rt: number, rb: number, h: number, m: THREE.Material, x: number, y: number, z: number, axis?: 'x' | 'z', seg = 24) {
    const g = new THREE.CylinderGeometry(rt, rb, h, seg);
    if (axis === 'z') g.rotateX(Math.PI / 2);
    if (axis === 'x') g.rotateZ(Math.PI / 2);
    const o = new THREE.Mesh(g, m); o.position.set(x, y, z); return o;
  }
  link(a: THREE.Vector3, b: THREE.Vector3, rad: number, m: THREE.Material, geoFn?: (L: number) => THREE.BufferGeometry) {
    const d = b.clone().sub(a), L = d.length(), o = new THREE.Mesh(geoFn ? geoFn(L) : new THREE.CylinderGeometry(rad, rad, L, 12), m);
    o.position.copy(a).add(b).multiplyScalar(0.5);
    o.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize());
    return o;
  }
  pane([[x1, y1], [x2, y2]]: [Pt, Pt], off: number) {
    const a = new V2(toX(x1), toY(y1)), b = new V2(toX(x2), toY(y2)), d = b.clone().sub(a);
    const n = new V2(-d.y, d.x).normalize(); if (n.y < 0) n.negate();
    const mid = a.clone().add(b).multiplyScalar(0.5).add(n.multiplyScalar(off));
    const o = this.box(d.length() * 0.8, 0.02, this.W * 0.82, M.glass, mid.x, mid.y, 0); o.rotation.z = Math.atan2(d.y, d.x); return o;
  }

  // --- wheels ---
  rimMat(rung: number) { const c = RIM_C[rung as 0]; return rung === 4 ? M.gold : rung === 3 ? this.glow(c, 1.4) : this.mat(std(c, { metalness: 0.9, roughness: 0.22 })); }
  spikes(g: THREE.Group, r: number, w: number, n: number, size: number, m: THREE.Material = M.chrome) {
    for (let i = 0; i < n; i++) for (const zz of [-w / 4, w / 4]) {
      const a = ((i + (zz > 0 ? 0.5 : 0)) / n) * Math.PI * 2, c = new THREE.Mesh(new THREE.ConeGeometry(size * 0.3, size, 6), m);
      c.position.set(Math.cos(a) * (r + size * 0.5), Math.sin(a) * (r + size * 0.5), zz); c.rotation.z = a - Math.PI / 2; g.add(c);
    }
  }
  /** Tire cross-section turned on a lathe: sidewall, rounded shoulders (k), flat tread. */
  tireGeo(r: number, w: number, rimR: number, k: number, seg = 48) {
    const hw = w / 2, p = [new V2(rimR, -hw * 0.9)], N = 6;
    for (let i = 0; i <= N; i++) { const a = (i / N) * Math.PI / 2; p.push(new V2(r - k + Math.sin(a) * k, -hw + k - Math.cos(a) * k)); }
    for (let i = 0; i <= N; i++) { const a = (i / N) * Math.PI / 2; p.push(new V2(r - k + Math.cos(a) * k, hw - k + Math.sin(a) * k)); }
    p.push(new V2(rimR, hw * 0.9));
    return new THREE.LatheGeometry(p, seg).rotateX(Math.PI / 2);
  }
  wheel(rung: number, r: number, w: number) {
    const g = new THREE.Group(), rimR = r * 0.6, n = [30, 20, 16, 16, 12][rung]!, h = [0.022, 0.045, 0.075, 0.075, 0.1][rung]!;
    g.add(new THREE.Mesh(this.tireGeo(r - 0.01, w, rimR, Math.min(0.09, w * 0.3)), M.rubber));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, rr = r + h / 2 - 0.015;
      if (rung === 0) {
        for (const zz of [-w / 4, w / 4]) { const aa = a + (zz > 0 ? Math.PI / n : 0), l = this.box(h, 0.07, w * 0.3, M.rubber, Math.cos(aa) * rr, Math.sin(aa) * rr, zz); l.rotation.z = aa; g.add(l); }
      } else for (const sd of [-1, 1]) { // chevron lugs
        const l = this.box(h, [0, 0.08, 0.1, 0.11, 0.15][rung]!, w * 0.52, M.rubber, Math.cos(a) * rr, Math.sin(a) * rr, sd * w * 0.23); l.rotation.set(sd * 0.5, 0, a, 'ZYX'); g.add(l);
      }
    }
    if (rung === 3) this.spikes(g, r + h, w, 16, 0.14);
    if (rung === 4) { // Monster Treads: gold paddles across the tread and big gold spikes
      for (let i = 0; i < n; i++) { const a = ((i + 0.5) / n) * Math.PI * 2, p = this.box(h * 0.7, 0.05, w * 0.96, M.gold, Math.cos(a) * (r + h * 0.35), Math.sin(a) * (r + h * 0.35), 0); p.rotation.z = a; g.add(p); }
      this.spikes(g, r + h, w, 12, 0.2, M.gold);
    }
    const rm = this.rimMat(rung);
    g.add(this.cyl(rimR, rimR, w * 0.86, rm, 0, 0, 0, 'z', 32));
    for (const s of [-1, 1]) {
      const z = s * w * 0.43;
      g.add(this.cyl(rimR * 0.86, rimR * 0.86, 0.02, M.dark, 0, 0, z, 'z', 32));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(rimR * 0.93, 0.03, 8, 40), M.chrome); ring.position.z = z; g.add(ring); // beadlock
      for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; g.add(this.cyl(0.014, 0.014, 0.03, M.chrome, Math.cos(a) * rimR * 0.93, Math.sin(a) * rimR * 0.93, z + s * 0.03, 'z', 6)); }
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2, sp = this.box(rimR * 0.72, 0.07, 0.03, rm, Math.cos(a) * rimR * 0.46, Math.sin(a) * rimR * 0.46, z + s * 0.012); sp.rotation.z = a; g.add(sp); }
      g.add(this.cyl(r * 0.17, r * 0.2, 0.07, M.chrome, 0, 0, z + s * 0.035, 'z'));
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; g.add(this.cyl(0.013, 0.013, 0.1, M.dark, Math.cos(a) * r * 0.12, Math.sin(a) * r * 0.12, z + s * 0.05, 'z', 6)); }
    }
    return g;
  }

  // --- shell ---
  shell(cv: HTMLCanvasElement) {
    const { B, W, f } = this;
    const geo = new THREE.ExtrudeGeometry(shellShapes(B.path, SH.R), { depth: W, bevelEnabled: true, bevelThickness: SH.bt, bevelSize: SH.bs, bevelSegments: SH.seg, curveSegments: 6 });
    geo.translate(0, 0, -W / 2); geo.computeBoundingBox();
    const bb = geo.boundingBox!, pos = geo.attributes.position!, uv = geo.attributes.uv!; // UVs = side projection, so the paint canvas wraps the whole shell
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - bb.min.x) / (bb.max.x - bb.min.x), (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y));
    uv.needsUpdate = true;
    creaseNormals(geo, 40);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const chrome = f.paint === 3, gold = f.paint === 4;
    this.body.add(new THREE.Mesh(geo, this.mat(new THREE.MeshPhysicalMaterial({ map: tex, roughness: gold ? 0.2 : chrome ? 0.15 : 0.3, metalness: gold ? 0.85 : chrome ? 0.7 : 0.25, clearcoat: 1, clearcoatRoughness: 0.05 }))));
    const wd = W + 2 * SH.bt + 0.02, wg = new THREE.ExtrudeGeometry(shellShapes(B.win, SH.R * 0.4), { depth: wd, bevelEnabled: false, curveSegments: 4 }); wg.translate(0, 0, -wd / 2);
    this.body.add(new THREE.Mesh(wg, M.glass));
    for (const seg of [B.shield, B.rear]) if (seg) this.body.add(this.pane(seg, SH.bs + 0.015));
    return { tex, bb };
  }

  // --- chassis and details ---
  chassis(w0: number, w1: number, zW: number) {
    const { r, tw, ch, W, truck } = this, y = ch - 0.1, zr = W * 0.3, mid = (w0 + w1) / 2, P = (x: number, y: number, z: number) => new V3(x, y, z);
    for (const s of [-1, 1]) truck.add(this.link(P(w0 - 0.5, y, s * zr), P(w1 + 0.5, y, s * zr), 0.045, M.frame));
    for (const x of [w0 - 0.45, w0 + 0.35, mid, w1 - 0.35, w1 + 0.45]) truck.add(this.link(P(x, y, -zr), P(x, y, zr), 0.035, M.frame));
    truck.add(this.box(0.5, 0.22, 0.36, M.dark, mid - 0.2, y - 0.12, 0)); // transmission
    truck.add(this.link(P(w0 + 0.15, r + 0.04, 0), P(mid - 0.45, y - 0.12, 0), 0.035, M.chrome), this.link(P(mid + 0.05, y - 0.12, 0), P(w1 - 0.15, r + 0.04, 0), 0.035, M.chrome));
    for (const wx of [w0, w1]) {
      const k = wx < mid ? 1 : -1;
      truck.add(this.link(P(wx, r, -(zW - tw / 2)), P(wx, r, zW - tw / 2), 0.065, M.dark));
      const diff = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), M.dark); diff.position.set(wx, r, 0); diff.scale.z = 0.8; truck.add(diff);
      for (const s of [-1, 1]) {
        truck.add(this.link(P(wx, r - 0.06, s * zr), P(wx + k * 0.8, y, s * zr), 0.028, M.chrome), this.link(P(wx, r + 0.1, s * 0.14), P(wx + k * 0.6, y, s * 0.1), 0.028, M.chrome)); // 4-link
        for (const j of [-1, 1]) { // coil-overs
          const a = P(wx + j * 0.13, r + 0.03, s * (W / 2 - 0.06)), b = P(wx + j * 0.36, ch + 0.3, s * (W / 2 - 0.2));
          truck.add(this.link(a, b, 0.035, M.chrome), this.link(a, b, 0, M.shock, L => new THREE.TubeGeometry(new Helix(L * 0.5, 0.065, 7), 90, 0.013, 6).translate(0, L * 0.1, 0)));
        }
      }
    }
  }
  details(fx: number, headY: number) {
    const { B, W, ch, body, bodyId } = this, bw = toX(B.back) - SH.bs, fw = fx + 0.05, ext = W / 2 + SH.bt;
    body.add(this.cyl(0.065, 0.065, W + 0.28, M.chrome, fw + 0.06, 0.08, 0, 'z'), this.cyl(0.065, 0.065, W + 0.28, M.chrome, bw - 0.06, 0.08, 0, 'z')); // tube bumpers
    body.add(this.box(0.03, 0.19, W * 0.38, M.dark, fw + 0.012, headY, 0));
    for (let i = 0; i < 7; i++) body.add(this.box(0.02, 0.17, 0.016, M.chrome, fw + 0.03, headY, (i - 3) * W * 0.052)); // grille
    const [mx, my] = B.shield[1];
    const tail = this.glow(0xff1a1a, 2.2);
    for (const s of [-1, 1]) {
      const t = new THREE.Mesh(new THREE.TorusGeometry(0.092, 0.018, 8, 28), M.chrome); t.rotation.y = Math.PI / 2; t.position.set(fx + 0.1, headY, s * W * 0.32); body.add(t);
      body.add(this.box(0.03, 0.08, 0.2, tail, bw - 0.012, 0.28, s * W * 0.36)); // tail lights
      body.add(this.box(0.04, 0.03, 0.12, M.dark, toX(mx) - 0.04, toY(my) + 0.05, s * (ext + 0.05)), this.box(0.05, 0.12, 0.09, M.dark, toX(mx) - 0.04, toY(my) + 0.08, s * (ext + 0.13))); // mirrors
    }
    if (bodyId !== 'dragster') { // antenna
      const ax = toX(B.roof[0]) + 0.06, ay = toY(B.roof[2]) + SH.bs;
      body.add(this.cyl(0.006, 0.006, 0.6, M.dark, ax, ay + 0.3, W * 0.42));
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), M.dark); tip.position.set(ax, ay + 0.6, W * 0.42); body.add(tip);
    }
    if (bodyId === 'pickup') {
      const x = toX(140);
      for (const s of [-1, 1]) body.add(this.cyl(0.045, 0.045, 0.85, M.chrome, x, 0.87, s * W * 0.38), this.cyl(0.052, 0.045, 0.08, M.dark, x, 1.31, s * W * 0.38)); // exhaust stacks
      body.add(this.box(toX(150) - toX(60) - 0.1, 0.01, W * 0.84, M.liner, (toX(60) + toX(150)) / 2, 0.45 + SH.bs + 0.006, 0)); // bed liner
    }
    if (bodyId === 'bigfoot') {
      for (const s of [-1, 1]) body.add(this.box(1.1, 0.04, 0.16, M.dark, toX(200), 0.02, s * (ext + 0.08))); // side steps
      const sp = this.wheel(0, 0.28, 0.2); sp.rotation.y = Math.PI / 2; sp.position.set(bw - 0.1, 0.42, 0); body.add(sp); // spare wheel
    }
    if (bodyId === 'firetruck') { // ladder on the roof of the box
      const top = toY(-98) + SH.bs + 0.05, x0 = toX(50), x1 = toX(250);
      for (const s of [-1, 1]) body.add(this.link(new V3(x0, top, s * W * 0.28), new V3(x1, top, s * W * 0.28), 0.03, M.chrome));
      for (let x = x0 + 0.1; x < x1; x += 0.22) body.add(this.cyl(0.018, 0.018, W * 0.56, M.chrome, x, top, 0, 'z', 8));
      for (const s of [-1, 1]) body.add(this.cyl(0.04, 0.04, 0.12, M.dark, x0 + 0.1, top - 0.08, s * W * 0.28), this.cyl(0.04, 0.04, 0.12, M.dark, x1 - 0.1, top - 0.08, s * W * 0.28));
    }
    if (bodyId === 'schoolbus') { // stop sign arm on the driver's side
      const sign = this.cyl(0.14, 0.14, 0.025, this.glow(0xd90000, 0.6), toX(300), 0.72, -(ext + 0.07), 'z', 8); sign.rotation.z = Math.PI / 8; body.add(sign);
      body.add(this.box(0.1, 0.05, 0.05, M.dark, toX(300) + 0.12, 0.72, -(ext + 0.03)));
    }
    if (bodyId === 'jeep') {
      const sp = this.wheel(1, 0.3, 0.22); sp.rotation.y = Math.PI / 2; sp.position.set(bw - 0.14, 0.55, 0); body.add(sp); // spare on the tailgate
      for (const s of [-1, 1]) body.add(this.box(0.9, 0.04, 0.14, M.dark, toX(170), 0.02, s * (ext + 0.07))); // side steps
    }
    if (bodyId === 'dragster') {
      body.add(this.box(0.3, 0.16, 0.34, M.chrome, toX(292), 0.32 + SH.bs + 0.08, 0), this.box(0.22, 0.12, 0.3, M.dark, toX(296), 0.32 + SH.bs + 0.22, 0)); // blower + scoop
      for (const s of [-1, 1]) {
        for (let i = 0; i < 4; i++) { const p = this.cyl(0.028, 0.028, 0.22, M.chrome, toX(272 + i * 16), 0.24, s * (ext + 0.03)); p.rotation.x = s * 0.5; body.add(p); } // headers
        body.add(this.link(new V3(bw, 0.05, s * 0.22), new V3(bw - 0.75, -ch + 0.1, s * 0.22), 0.02, M.dark), this.cyl(0.06, 0.06, 0.04, M.rubber, bw - 0.78, -ch + 0.06, s * 0.22, 'z')); // wheelie bar
      }
    }
  }

  // --- Lights Mods ---
  lights(fx: number, headY: number, w0: number, w1: number) {
    const { B, W, ch, body } = this, rung = this.f.lights, e = SH.bs - 0.05, hm = this.glow(0xfff2c0, 3);
    for (const s of [-1, 1]) body.add(this.cyl(0.085, 0.085, 0.05, hm, fx + 0.07, headY, s * W * 0.32, 'x'));
    if (rung >= 1) { // Fog Lights
      const am = this.glow(0xffa000, 3);
      for (const s of [-1, 1]) { const o = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), am); o.position.set(fx + 0.17, 0.12, s * W * 0.28); body.add(o); }
      const bm = this.mat(new THREE.MeshBasicMaterial({ color: 0xfff3b0, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      for (const s of [-1, 1]) { const cg = new THREE.ConeGeometry(0.55, 2.2, 24, 1, true); cg.rotateZ(Math.PI / 2); cg.translate(1.1, 0, 0); const b = new THREE.Mesh(cg, bm); b.position.set(fx + 0.1, headY, s * W * 0.32); body.add(b); }
      const sp = new THREE.SpotLight(0xfff0c0, 12, 7, 0.55, 0.6); sp.position.set(fx + 0.1, headY, 0); sp.target.position.set(fx + 3, -ch, 0); body.add(sp, sp.target);
    }
    if (rung >= 2) { // Roof Bar
      const bx = toX(B.roof[1]) - 0.18, by = toY(B.roof[2]) + 0.1 + e, cols = rung === 4 ? [0xff2d55, 0x3dff8b, 0x3dc8ff, 0xc04dff, 0xffd23f] : [rung === 3 ? 0x7ff9ff : 0xfff27a];
      body.add(this.box(0.16, 0.1, W * 0.8, M.dark, bx, by, 0));
      for (let i = 0; i < 5; i++) body.add(this.box(0.03, 0.07, W * 0.12, this.glow(cols[i % cols.length]!, 3.5), bx + 0.085, by, (i - 2) * W * 0.16));
      if (rung === 4) { // Laser Show: coloured beams fanning out from a turret on the bar, sweeping round
        const turret = new THREE.Group(); turret.position.set(bx, by + 0.1, 0); body.add(turret);
        turret.add(new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 10), M.chrome));
        for (let i = 0; i < 8; i++) {
          const bm = this.mat(new THREE.MeshBasicMaterial({ color: [0xff2d55, 0x3dff8b, 0x3dc8ff, 0xc04dff][i % 4], transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }));
          const a = (i / 8) * Math.PI * 2, beam = this.link(new V3(0, 0, 0), new V3(Math.cos(a) * 3.2, 1.1 + (i % 2) * 0.6, Math.sin(a) * 3.2), 0.012, bm);
          beam.castShadow = false; turret.add(beam);
        }
        this.anim.lasers = turret;
      }
    }
    if (rung >= 3 && glowTex) { // Glow Under
      const gm = this.mat(new THREE.MeshBasicMaterial({ map: glowTex, color: rung === 4 ? 0xc04dff : 0x2ef2ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(w1 - w0 + 1.8, W + 1.6), gm); pl.rotation.x = -Math.PI / 2; pl.position.set((w0 + w1) / 2, -ch + 0.02, 0); body.add(pl);
      const p = new THREE.PointLight(rung === 4 ? 0xc04dff : 0x2ef2ff, 4, 3); p.position.set((w0 + w1) / 2, -ch + 0.3, 0); body.add(p);
      this.anim.glow = { m: gm, l: p };
    }
  }

  // --- Horn Mods: only the Train Horn shows, as three chrome trumpets on the roof ---
  horn() {
    if (this.f.horn !== 4) return;
    const { B, W, body } = this, [x0, x1, ry] = B.roof, x = toX((x0 + x1) / 2), y = toY(ry) + SH.bs + 0.09;
    body.add(this.box(0.5, 0.04, 0.3, M.dark, x, y - 0.05, 0));
    [0.34, 0.44, 0.54].forEach((L, i) => {
      const t = this.cyl(0.035, 0.085, L, M.chrome, x + 0.05, y + 0.02, (i - 1) * W * 0.12, 'x', 20);
      t.position.x += L / 2 - 0.2; body.add(t);
    });
  }

  build(): BuiltTruck {
    const { B, f, r, tw, W } = this;
    const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512;
    const { tex, bb } = this.shell(cv);
    const draw = (t: number) => { drawPaint(cv, bb, B, f, this.bodyId, t); tex.needsUpdate = true; };
    draw(performance.now());
    if (f.paint >= 3) this.anim.repaint = draw;
    const fx = toX(B.front) + SH.bs - 0.05, headY = toY(B.head[1]), [w0, w1] = B.wheels.map(toX) as [number, number], zW = W / 2 + tw / 2 + 0.04;
    this.details(fx, headY);
    this.chassis(w0, w1, zW);
    for (const wx of [w0, w1]) for (const s of [-1, 1]) {
      const wh = this.wheel(f.tires, r, tw); wh.position.set(wx, r, s * zW); this.truck.add(wh);
      if (f.tires >= 3) this.anim.spin.push(wh);
    }
    this.lights(fx, headY, w0, w1);
    this.horn();
    this.truck.traverse(o => { if (o instanceof THREE.Mesh) o.castShadow = !(o.material as THREE.Material).transparent; });
    const ch = this.ch;
    return {
      group: this.truck,
      anim: this.anim,
      anchors: side => {
        const sideAt = ([x, y]: Pt) => ({ p: new V3(toX(x), ch + toY(y), side * (W / 2 + 0.1)), n: new V3(0, 0, side), min: 0.2 });
        return {
          tires: { p: new V3(toX(B.wheels[0]), r, side * (zW + tw / 2 + 0.03)), n: new V3(0, 0, side), min: 0.2 },
          paint: sideAt(B.hot.paint),
          decals: sideAt(B.hot.decals),
          lights: { p: new V3(toX(B.front) + 0.14, ch + toY(B.head[1]), 0), n: new V3(1, 0, 0), min: -0.15 },
          horn: { p: new V3(toX(B.hot.horn[0]), ch + toY(B.hot.horn[1]), 0), n: null, min: 0 },
          engine: { p: new V3(toX(B.hot.engine[0]), ch + toY(B.hot.engine[1]), 0), n: null, min: 0 },
        };
      },
      dispose: () => {
        this.truck.traverse(o => { if (o instanceof THREE.Mesh) o.geometry.dispose(); });
        for (const m of this.own) if (!SHARED.has(m)) m.dispose();
        tex.dispose();
      },
    };
  }
}

class Helix extends THREE.Curve<THREE.Vector3> {
  constructor(readonly L: number, readonly R: number, readonly turns: number) { super(); }
  override getPoint(t: number, v = new V3()) { const a = t * this.turns * Math.PI * 2; return v.set(Math.cos(a) * this.R, (t - 0.5) * this.L, Math.sin(a) * this.R); }
}

// ---------- Paint and Decals: one canvas, drawn in profile units and projected from the side ----------
const FLAME1 = 'M0,-3 C-40,-3 -60,-30 -90,-20 C-72,-36 -100,-46 -120,-32 C-106,-52 -134,-58 -152,-40 C-142,-16 -100,-1 -60,1 Z';
const FLAME2 = 'M0,-3 C-30,-4 -44,-20 -64,-14 C-52,-26 -72,-30 -86,-22 C-80,-10 -50,-1 -30,0 Z';
const BOLT = 'M-4,-54 L-26,-18 L-8,-20 L-20,6 L18,-32 L0,-30 L12,-54 Z';
const WING = 'M-12,-34 C-34,-62 -74,-62 -94,-48 C-78,-46 -82,-38 -94,-32 C-78,-30 -80,-22 -90,-16 C-60,-14 -32,-20 -12,-26 Z';

function drawPaint(cv: HTMLCanvasElement, bb: THREE.Box3, B: BodyShape, f: Fit, bodyId: BodyId, t: number) {
  const c = cv.getContext('2d')!, CW = cv.width, CH = cv.height, dx = bb.max.x - bb.min.x, dy = bb.max.y - bb.min.y;
  c.setTransform(CW / (U * dx), 0, 0, CH / (U * dy), (-2 - bb.min.x) * CW / dx, CH + (bb.min.y * CH) / dy);
  let fill: string | CanvasGradient;
  if (f.paint === 0) fill = '#8d96a3';
  else if (f.paint === 1) fill = '#1e7bff';
  else if (f.paint === 2) { fill = c.createLinearGradient(B.front, 0, B.back, 0); fill.addColorStop(0, '#ffe14d'); fill.addColorStop(0.45, '#ff6a00'); fill.addColorStop(1, '#a80000'); }
  else if (f.paint === 4) { fill = c.createLinearGradient(0, -130, 0, 0); fill.addColorStop(0, '#fff1a8'); fill.addColorStop(0.45, '#e0a800'); fill.addColorStop(1, '#8a6100'); }
  else {
    const off = (t * 0.08) % 200, cols = ['#ff3b3b', '#ffb800', '#f4ff5a', '#3dff8b', '#3dc8ff', '#c04dff'];
    fill = c.createLinearGradient(-400 + off, 0, 800 + off, 0);
    for (let k = 0; k <= 36; k++) fill.addColorStop(k / 36, cols[k % 6]!);
  }
  c.fillStyle = fill; c.fillRect(-100, -200, 600, 300);
  const sh = c.createLinearGradient(0, -120, 0, 5); sh.addColorStop(0, 'rgba(255,255,255,.14)'); sh.addColorStop(1, 'rgba(0,0,0,.28)');
  c.fillStyle = sh; c.fillRect(-100, -200, 600, 300);
  if (f.paint === 4) { // Gold Flake: flakes that catch the light in turn
    const rn = seeded(11);
    for (let i = 0; i < 260; i++) {
      const x = B.back + rn() * (B.front - B.back), y = -rn() * 130, k = 0.5 + 0.5 * Math.sin(t * 0.004 + i * 1.7);
      c.fillStyle = `rgba(255,255,230,${(0.15 + 0.85 * k * k).toFixed(2)})`; c.fillRect(x, y, 1.6 + rn() * 1.6, 1.6 + rn() * 1.6);
    }
  }
  c.save(); c.clip(new Path2D(B.path));
  if (f.decals === 1) { c.fillStyle = '#fff'; c.fillRect(-50, -26, 500, 6); c.fillRect(-50, -16, 500, 6); }
  if (f.decals === 2) { c.save(); c.translate(B.front, 0); c.fillStyle = '#ff7a00'; c.fill(new Path2D(FLAME1)); c.fillStyle = '#ffe14d'; c.fill(new Path2D(FLAME2)); c.restore(); }
  if (f.decals === 3) {
    const b = new Path2D(BOLT); c.lineWidth = 2.5; c.strokeStyle = '#111'; c.fillStyle = '#fff23a'; c.lineJoin = 'round';
    c.save(); c.translate(B.mid, 0); c.fill(b); c.stroke(b); c.restore();
    c.save(); c.translate(B.mid - 100, 0); c.scale(0.7, 0.7); c.fill(b); c.stroke(b); c.restore();
  }
  if (f.decals === 4) { // Skull & Wings
    c.save(); c.translate(B.mid, 0); c.lineWidth = 2.5; c.strokeStyle = '#111'; c.lineJoin = 'round';
    const wing = new Path2D(WING); c.fillStyle = '#f2f2f2';
    for (const sx of [1, -1]) { c.save(); c.scale(sx, 1); c.fill(wing); c.stroke(wing); c.restore(); }
    c.beginPath(); c.arc(0, -36, 15, 0, Math.PI * 2); c.rect(-9, -26, 18, 10); c.fill(); c.stroke();
    c.fillStyle = '#111'; c.beginPath(); c.arc(-6, -38, 4.5, 0, Math.PI * 2); c.arc(6, -38, 4.5, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.moveTo(0, -33); c.lineTo(-2.5, -29); c.lineTo(2.5, -29); c.fill();
    for (const x of [-4.5, 0, 4.5]) { c.beginPath(); c.moveTo(x, -26); c.lineTo(x, -17); c.stroke(); }
    c.restore();
  }
  realPaint(c, B, bodyId);
  c.restore();
}

/** Window seals, door seam and handle, tailgate, and mud up the lower panels. */
function realPaint(c: CanvasRenderingContext2D, B: BodyShape, bodyId: BodyId) {
  c.lineJoin = 'round'; c.lineWidth = 7; c.strokeStyle = '#16181c'; c.stroke(new Path2D(B.win));
  if (bodyId === 'schoolbus') { c.fillStyle = '#16181c'; c.fillRect(B.back, -66, B.front - B.back, 4); c.fillRect(B.back, -46, B.front - B.back, 4); }
  if (bodyId === 'firetruck') { c.lineWidth = 1.6; c.strokeStyle = 'rgba(0,0,0,.55)'; for (let x = 44; x < 240; x += 66) { c.beginPath(); c.roundRect(x, -90, 58, 80, 5); c.stroke(); } }
  if (bodyId !== 'dragster' && bodyId !== 'schoolbus') {
    const [x0, x1, ry] = B.roof, dw = (x1 - x0) * 0.72, wy = Math.max(...parsePath(B.win).flat().map(p => p[1]));
    c.lineWidth = 1.6; c.strokeStyle = 'rgba(0,0,0,.55)'; c.beginPath(); c.roundRect(x0 + 4, ry + 3, dw, -ry - 9, 6); c.stroke();
    c.fillStyle = '#24272c'; c.beginPath(); c.roundRect(x0 + dw - 22, wy + 9, 16, 4, 2); c.fill();
  }
  if (bodyId === 'pickup') { c.lineWidth = 1.6; c.beginPath(); c.moveTo(B.back + 7, -39); c.lineTo(B.back + 7, -5); c.moveTo(150, -44); c.lineTo(150, -5); c.stroke(); }
  const mud = c.createLinearGradient(0, -30, 0, 0); mud.addColorStop(0, 'rgba(92,64,38,0)'); mud.addColorStop(1, 'rgba(92,64,38,.65)'); c.fillStyle = mud; c.fillRect(-100, -30, 600, 30);
  const rn = seeded(7); c.fillStyle = 'rgba(84,58,34,.6)';
  for (let i = 0; i < 110; i++) { const x = B.back + rn() * (B.front - B.back), y = -(rn() ** 2) * 44, r = 0.8 + rn() * 3.2; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
}

export const buildTruck = (body: BodyId, fit: Fit): BuiltTruck => new Builder(body, fit).build();
