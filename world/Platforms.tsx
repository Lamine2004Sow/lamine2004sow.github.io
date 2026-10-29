'use client';

import { useMemo } from 'react';
import type { Material } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { useStore } from '@/store';
import { mats, rng, unitBox } from './materials';
import { rt } from './runtime';
import { PLATFORMS } from './zones';

interface BoxSpec {
  s: [number, number, number];
  p: [number, number, number];
  m: Material;
  cast: boolean;
}

export function Box({ s, p, m, cast = true }: { s: [number, number, number]; p: [number, number, number]; m: Material; cast?: boolean }) {
  return <mesh geometry={unitBox} material={m} scale={s} position={p} castShadow={cast} receiveShadow />;
}

// Décor d'une plateforme : cubes dessous, marches au bord, mousse dessus et mousse pendante.
function decor(i: number): BoxSpec[] {
  const p = PLATFORMS[i];
  const r = rng(100 + i);
  const out: BoxSpec[] = [];
  for (let k = 0; k < 9; k++) {
    const s = 0.6 + r() * 1.3;
    const m = r() > 0.5 ? mats.stone : mats.stone2;
    out.push({ s: [s, s, s], p: [(r() - 0.5) * (p.w - 1.4), -0.7 - s / 2 - r() * 1.6, (r() - 0.5) * (p.d - 1.2)], m, cast: true });
  }
  for (let k = 0; k < 4; k++) {
    const s = 0.5 + r() * 0.6;
    const side = r() > 0.5 ? 1 : -1;
    out.push({ s: [s, s * 0.8, s], p: [(r() - 0.5) * (p.w - 1), -0.1 + s * 0.4 - 0.3, side * (p.d / 2 - s / 2 + 0.05) * 0.98], m: mats.stone, cast: true });
  }
  for (let k = 0; k < 16; k++) {
    const s = 0.1 + r() * 0.16;
    const back = r() > 0.35;
    const mx = (r() - 0.5) * p.w * 0.96;
    const mz = back ? -p.d / 2 + r() * 0.5 : (r() - 0.5) * p.d * 0.9;
    const h = s * (0.5 + r() * 0.6);
    const m = r() > 0.5 ? mats.moss : mats.moss2;
    if (!back && Math.abs(mz) < p.d * 0.35 && Math.abs(mx) < p.w * 0.4) continue;
    out.push({ s: [s, h, s], p: [mx, s * 0.3, mz], m, cast: false });
  }
  for (let k = 0; k < 4; k++) {
    const s = 0.09 + r() * 0.07;
    const hl = 0.18 + r() * 0.3;
    out.push({ s: [s, hl, s * 0.6], p: [(r() - 0.5) * p.w * 0.9, -hl / 2 - 0.05, p.d / 2 + 0.04], m: mats.moss, cast: false });
  }
  return out;
}

export function Platforms() {
  const setHovered = useStore((s) => s.setHovered);
  const decors = useMemo(() => PLATFORMS.map((_, i) => decor(i)), []);
  return (
    <>
      {PLATFORMS.map((p, i) => (
        <group key={i} position={[p.x, p.y, p.z]}>
          <mesh
            geometry={unitBox}
            material={mats.stone}
            scale={[p.w, 0.7, p.d]}
            position={[0, -0.35, 0]}
            castShadow
            receiveShadow
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              rt.go(i);
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              setHovered({ kind: 'zone', zone: i }, e.point.x);
            }}
            onPointerOut={() => setHovered(null)}
          />
          {decors[i].map((b, k) => (
            <Box key={k} s={b.s} p={b.p} m={b.m} cast={b.cast} />
          ))}
        </group>
      ))}
    </>
  );
}
