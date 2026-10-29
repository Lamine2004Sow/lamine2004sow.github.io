import { describe, expect, it } from 'vitest';
import { LAST, PATH, ZONE_SPOTS, pathDist, posAt, step } from './zones';

describe('chemin entre les zones', () => {
  it('a un point d’arrêt par zone, dans l’ordre', () => {
    expect(ZONE_SPOTS).toHaveLength(5);
    expect([...ZONE_SPOTS].sort((a, b) => a - b)).toEqual(ZONE_SPOTS);
  });

  it('interpole la position le long d’un segment', () => {
    const mid = posAt(0.5);
    expect(mid[0]).toBeCloseTo((PATH[0].p[0] + PATH[1].p[0]) / 2);
  });

  it('mesure la même distance dans les deux sens', () => {
    expect(pathDist(0, ZONE_SPOTS[2])).toBeCloseTo(pathDist(ZONE_SPOTS[2], 0));
  });

  it('démarre un saut au bord d’une plateforme', () => {
    const edge = PATH.findIndex((w) => w.jump);
    const r = step(edge, ZONE_SPOTS[1], 1.35, 0.016, 1);
    expect(r).toEqual({ kind: 'jump', from: edge, to: edge + 1, face: 1 });
  });

  it('s’arrête pile sur la destination', () => {
    let s = 0;
    let arrived = false;
    for (let i = 0; i < 2000 && !arrived; i++) {
      const r = step(s, 1, 1.35, 0.05, 1);
      if (r.kind !== 'move') throw new Error('saut inattendu');
      s = r.s;
      arrived = r.arrived;
    }
    expect(s).toBe(1);
  });

  it('ne dépasse jamais les extrémités', () => {
    const r = step(LAST, LAST, 3, 1, 1);
    expect(r).toMatchObject({ kind: 'move', s: LAST, arrived: true });
  });
});
