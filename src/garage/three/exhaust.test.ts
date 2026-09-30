import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { CAP, Exhaust, PUFF } from './exhaust';

const up = new THREE.Vector3(0, 1, 0);
const stacks = () => [{ p: new THREE.Vector3(-0.6, 1.3, 0.5), dir: up }, { p: new THREE.Vector3(-0.6, 1.3, -0.5), dir: up }];

/** Where the live puffs are, and their colours. */
function live(e: Exhaust) {
  const g = e.points.geometry, pos = g.getAttribute('position'), a = g.getAttribute('alpha'), c = g.getAttribute('tint');
  const out: { p: THREE.Vector3; c: string }[] = [];
  for (let i = 0; i < pos.count; i++) if (a.getX(i) > 0) out.push({ p: new THREE.Vector3().fromBufferAttribute(pos, i), c: [c.getX(i), c.getY(i), c.getZ(i)].map(v => v.toFixed(2)).join() });
  return out;
}

describe('the Exhaust', () => {
  it('puffs more for a mega jump than for a hop', () => {
    const hop = new Exhaust(2, stacks()), mega = new Exhaust(2, stacks());
    hop.puff(PUFF.hop); mega.puff(PUFF.mega);
    expect(hop.alive).toBeGreaterThan(0);
    expect(mega.alive).toBeGreaterThan(hop.alive);
  });

  it('puffs out of every pipe, where the Truck is now', () => {
    const e = new Exhaust(1, stacks()), m = new THREE.Matrix4().makeTranslation(0, 2, 0);
    e.puff(PUFF.mega, m);
    e.step(0);
    const ps = live(e).map(x => x.p);
    expect(ps.some(p => p.z > 0)).toBe(true);
    expect(ps.some(p => p.z < 0)).toBe(true);
    for (const p of ps) expect(Math.min(...stacks().map(t => p.distanceTo(t.p.clone().setY(3.3))))).toBeLessThan(0.1);
  });

  it('drifts away and fades out', () => {
    const e = new Exhaust(0, [{ p: new THREE.Vector3(-1.4, 0.2, 0.4), dir: new THREE.Vector3(-1, 0, 0) }]);
    e.puff(PUFF.jump);
    for (let i = 0; i < 10; i++) e.step(0.05);
    expect(live(e).every(x => x.p.x < -1.4)).toBe(true);
    for (let i = 0; i < 100; i++) e.step(0.05);
    expect(e.alive).toBe(0);
    expect(live(e)).toEqual([]);
  });

  it(`never has more than ${CAP} particles in the air, however much he taps`, () => {
    const e = new Exhaust(4, stacks());
    for (let i = 0; i < 30; i++) { e.puff(PUFF.mega); e.step(0.02); }
    expect(e.alive).toBeLessThanOrEqual(CAP);
    expect(e.alive).toBeGreaterThan(CAP / 2);
  });

  it('blasts every colour of the rainbow from Rainbow Blast, and plain smoke from Smoke Stacks', () => {
    const rainbow = new Exhaust(4, stacks()), smoke = new Exhaust(2, stacks());
    rainbow.puff(PUFF.mega); smoke.puff(PUFF.mega);
    rainbow.step(0); smoke.step(0);
    expect(new Set(live(rainbow).map(x => x.c)).size).toBeGreaterThanOrEqual(5);
    for (const { c } of live(smoke)) { const [r, g, b] = c.split(',').map(Number); expect(Math.max(r!, g!, b!) - Math.min(r!, g!, b!)).toBeLessThan(0.05); }
  });
});
