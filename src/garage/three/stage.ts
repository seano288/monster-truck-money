// The Garage stage: the Truck on a turntable he can spin, a camera that swings to a Slot's part,
// hotspots that follow the parts, a slow spin after 12 s idle, and the Truck's jumps.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { BodyId, Fit, SlotId } from '../catalog';
import { buildTruck, type BuiltTruck } from './truck';

// Camera per Slot when its sheet opens: [x, z] direction from the Truck, polar angle
const VIEWS: Record<SlotId, [number, number, number]> = { tires: [0.5, 1, 1.32], paint: [0.8, 1, 1.12], decals: [0, 1, 1.3], lights: [1, 0.4, 1.3], horn: [1, 0.7, 0.95] };
export const IDLE_SPIN_MS = 12000;

/** The Truck's moves: a hop, a spin jump and a big double-spin jump. */
export const MOVES = { hop: { dur: 600, h: 0.35, spin: 0 }, jump: { dur: 1300, h: 1.1, spin: 1 }, mega: { dur: 2100, h: 1.9, spin: 2 } } as const;
export type Move = keyof typeof MOVES;

const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

interface Tween { t0: number; dur: number; from: { th: number; phi: number; r: number }; to: { th: number; phi: number; r: number } }

export interface HotspotPlace { x: number; y: number; visible: boolean }

export class GarageStage {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  private controls: OrbitControls;
  private truck: BuiltTruck | null = null;
  private sig = '';
  private tween: Tween | null = null;
  private lastTouch = performance.now();
  private off = { x: 0, y: 0 };
  private move: { kind: Move; t0: number } | null = null;
  private raf = 0;
  private sheetOpen = false;
  private resizeObs: ResizeObserver;
  private lastLand: boolean | null = null;
  /** Called every frame with where each Slot's hotspot goes (in stage pixels). */
  onHotspots: ((places: Record<SlotId, HotspotPlace>) => void) | null = null;

  constructor(canvas: HTMLCanvasElement, private stage: HTMLElement) {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true }));
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = this.scene;
    scene.background = new THREE.Color(0x161b28);
    scene.fog = new THREE.Fog(0x161b28, 12, 26);
    const pm = new THREE.PMREMGenerator(r);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    scene.environmentIntensity = 0.9;
    scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x1a1a26, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.6); sun.position.set(3, 7, 4); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 }); sun.shadow.bias = -0.0005;
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x6f8cff, 1.3); rim.position.set(-4, 3, -5); scene.add(rim);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(20, 64), new THREE.MeshStandardMaterial({ color: 0x1d2233, roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.12; floor.receiveShadow = true; scene.add(floor);
    const table = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.3, 0.12, 72), new THREE.MeshStandardMaterial({ color: 0x3a4256, metalness: 0.6, roughness: 0.45 }));
    table.position.y = -0.06; table.receiveShadow = true; scene.add(table);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.22, 0.03, 8, 96), new THREE.MeshStandardMaterial({ color: 0xffc53d, emissive: 0xffc53d, emissiveIntensity: 1.2 }));
    ring.rotation.x = -Math.PI / 2; scene.add(ring);

    const c = (this.controls = new OrbitControls(this.camera, canvas));
    c.target.set(0, 0.85, 0); c.enablePan = false; c.enableDamping = true;
    c.minDistance = 4; c.maxDistance = 15; c.minPolarAngle = 0.35; c.maxPolarAngle = 1.48; c.autoRotateSpeed = 0.7;
    c.addEventListener('start', () => { this.tween = null; this.lastTouch = performance.now(); c.autoRotate = false; });
    c.addEventListener('end', () => { this.lastTouch = performance.now(); });
    this.camera.position.setFromSpherical(new THREE.Spherical(7.6, 1.18, Math.atan2(0.75, 1))).add(c.target);

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(stage);
    this.resize();
    this.camera.position.sub(c.target).setLength(this.fitDist(false)).add(c.target);
    this.raf = requestAnimationFrame(this.loop);
  }

  /** Show this Body with these Mods fitted (rebuilt only when something changed). */
  setTruck(body: BodyId, fit: Fit) {
    const sig = body + JSON.stringify(fit);
    if (sig === this.sig) return;
    this.sig = sig;
    if (this.truck) { this.scene.remove(this.truck.group); this.truck.dispose(); }
    this.truck = buildTruck(body, fit);
    this.scene.add(this.truck.group);
  }

  /** Swing the camera to a Slot's part and shift the Truck clear of its sheet; null goes back to the whole Truck. */
  focus(slot: SlotId | null) {
    this.sheetOpen = !!slot;
    this.lastTouch = performance.now();
    const sp = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(this.controls.target));
    const from = { th: sp.theta, phi: sp.phi, r: sp.radius };
    if (!slot) { this.tween = { t0: performance.now(), dur: 600, from, to: { ...from, r: this.fitDist(false) } }; return; }
    const [dx, dz, phi] = VIEWS[slot], side = this.camera.position.z >= 0 ? 1 : -1;
    let d = Math.atan2(dx, dz * side) - sp.theta; d = Math.atan2(Math.sin(d), Math.cos(d));
    this.tween = { t0: performance.now(), dur: 850, from, to: { th: sp.theta + d, phi, r: this.fitDist(true) } };
  }

  /** Play one of the Truck's jumps. */
  play(kind: Move) { this.move = { kind, t0: performance.now() }; }

  /** Where on the page the Truck is (for sparks). */
  truckPoint(): { x: number; y: number } {
    const v = new THREE.Vector3(0, 1, 0).project(this.camera), rc = this.stage.getBoundingClientRect();
    return { x: rc.left + ((v.x + 1) / 2) * rc.width, y: rc.top + ((1 - v.y) / 2) * rc.height };
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.resizeObs.disconnect();
    this.controls.dispose();
    if (this.truck) this.truck.dispose();
    this.renderer.dispose();
  }

  /** Distance that keeps the whole Truck in the part of the stage the sheet leaves free. */
  private fitDist(sheet: boolean) {
    const w = this.stage.clientWidth || 1, h = this.stage.clientHeight || 1, land = w > h, t = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const wa = (w / h) * (sheet && land ? 0.5 : 0.9), ha = sheet && !land ? 0.5 : 0.85;
    return Math.max(2.3 / (t * wa), 1.5 / (t * ha));
  }

  private resize() {
    const w = this.stage.clientWidth, h = this.stage.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.applyOffset();
    const land = w > h;
    if (this.lastLand !== null && land !== this.lastLand) this.focusDistance();
    this.lastLand = land;
  }

  private focusDistance() {
    const sp = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(this.controls.target));
    const from = { th: sp.theta, phi: sp.phi, r: sp.radius };
    this.tween = { t0: performance.now(), dur: 600, from, to: { ...from, r: this.fitDist(this.sheetOpen) } };
  }

  private applyOffset() {
    const w = this.stage.clientWidth, h = this.stage.clientHeight;
    this.camera.setViewOffset(w, h, this.off.x * w, this.off.y * h, w, h);
    this.camera.updateProjectionMatrix();
  }

  private loop = (now: number) => {
    const { camera, controls } = this;
    if (this.tween) {
      const tw = this.tween, k = Math.min(1, (now - tw.t0) / tw.dur), e = ease(k), a = tw.from, b = tw.to;
      camera.position.setFromSpherical(new THREE.Spherical(a.r + (b.r - a.r) * e, a.phi + (b.phi - a.phi) * e, a.th + (b.th - a.th) * e)).add(controls.target);
      if (k === 1) this.tween = null;
    }
    controls.autoRotate = !this.sheetOpen && !this.tween && now - this.lastTouch > IDLE_SPIN_MS;
    controls.update();
    const land = this.stage.clientWidth > this.stage.clientHeight, tx = this.sheetOpen && land ? 0.24 : 0, ty = this.sheetOpen && !land ? 0.23 : 0;
    if (Math.abs(this.off.x - tx) + Math.abs(this.off.y - ty) > 0.001) { this.off.x += (tx - this.off.x) * 0.12; this.off.y += (ty - this.off.y) * 0.12; this.applyOffset(); }

    const t = this.truck;
    if (t) {
      const g = t.group;
      let y = 0;
      if (this.move) {
        const c = MOVES[this.move.kind], q = (now - this.move.t0) / c.dur;
        if (q >= 1) { this.move = null; g.rotation.set(0, 0, 0); }
        else if (q < 0.15) y = -Math.sin((q / 0.15) * Math.PI) * 0.08; // crouch
        else {
          const a = (q - 0.15) / 0.85;
          y = Math.sin(a * Math.PI) * c.h;
          g.rotation.y = c.spin * Math.PI * 2 * ease(a);
          if (this.move.kind === 'mega') g.rotation.z = Math.sin(a * Math.PI) * 0.35;
        }
      }
      g.position.y = y;
      for (const w of t.anim.spin) w.rotation.z -= 0.06;
      if (t.anim.glow) { const p = 0.65 + 0.35 * Math.sin(now / 220); t.anim.glow.m.opacity = p; t.anim.glow.l.intensity = 4 * p; }
      t.anim.repaint?.(now);
      this.placeHotspots(t);
    }
    this.renderer.render(this.scene, camera);
    this.raf = requestAnimationFrame(this.loop);
  };

  private placeHotspots(t: BuiltTruck) {
    if (!this.onHotspots) return;
    const w = this.stage.clientWidth, h = this.stage.clientHeight, side = this.camera.position.z >= 0 ? 1 : -1;
    const A = t.anchors(side), out = {} as Record<SlotId, HotspotPlace>;
    for (const [slot, a] of Object.entries(A) as [SlotId, (typeof A)[SlotId]][]) {
      const p = a.p.clone(); p.y += t.group.position.y;
      const v = p.clone().project(this.camera);
      let visible = v.z < 1 && !this.move;
      if (a.n) visible &&= a.n.dot(this.camera.position.clone().sub(p).normalize()) > a.min; // hide when the part faces away
      out[slot] = { x: ((v.x + 1) / 2) * w, y: ((1 - v.y) / 2) * h, visible };
    }
    this.onHotspots(out);
  }
}
