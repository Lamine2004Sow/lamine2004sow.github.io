'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CanvasTexture, Color, DoubleSide, MeshStandardMaterial, NearestFilter, SRGBColorSpace, BufferGeometry, Vector3 } from 'three';
import type { Group, Mesh, PointLight } from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { SKILL_CUBES } from '@/lib/site';
import { useStore } from '@/store';
import { Box } from './Platforms';
import { cssFont, mats } from './materials';
import { rt } from './runtime';
import { PLATFORMS } from './zones';

const P = PLATFORMS;

function hoverHandlers(kind: 'zone', zone: number) {
  return {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      useStore.getState().setHovered({ kind, zone }, e.point.x);
    },
    onPointerOut: () => useStore.getState().setHovered(null),
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      rt.go(zone);
    },
  };
}

function Plant({ at, s = 1 }: { at: [number, number, number]; s?: number }) {
  return (
    <group position={at}>
      <Box s={[0.36 * s, 0.36 * s, 0.36 * s]} p={[0, 0.18 * s, 0]} m={mats.lav} />
      {[0, 1, 2, 3, 4].map((k) => {
        const a = k * 1.25;
        return <Box key={k} s={[0.09 * s, (0.4 + ((0.18 * k) % 3)) * s, 0.09 * s]} p={[Math.cos(a) * 0.1 * s, (0.55 + k * 0.05) * s, Math.sin(a) * 0.1 * s]} m={k % 2 ? mats.moss : mats.moss2} cast={false} />;
      })}
    </group>
  );
}

// ------------------------------------------------------------ Projets : écran flottant
function screenTexture(label: string | null, lit: boolean) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 320;
  const g = c.getContext('2d')!;
  g.fillStyle = lit ? '#1d1a2a' : '#2a2638';
  g.fillRect(0, 0, 512, 320);
  g.fillStyle = '#2f2b40';
  g.fillRect(0, 0, 512, 28);
  ['#ff8f8f', '#ffd479', '#8fe3a1'].forEach((col, i) => {
    g.fillStyle = col;
    g.fillRect(14 + i * 16, 10, 9, 9);
  });
  const mono = cssFont('--font-silk', 'ui-monospace, monospace');
  if (lit) {
    // Une petite courbe d'apprentissage qui descend, et des barres de résultats.
    g.strokeStyle = '#7fe3ff';
    g.lineWidth = 4;
    g.beginPath();
    for (let x = 0; x <= 280; x += 8) {
      const y = 60 + 140 * Math.exp(-x / 70) + Math.sin(x / 9) * 4;
      if (x === 0) g.moveTo(30 + x, y);
      else g.lineTo(30 + x, y);
    }
    g.stroke();
    g.fillStyle = '#4a4560';
    g.fillRect(30, 216, 280, 2);
    for (let i = 0; i < 6; i++) {
      g.fillStyle = i === 1 ? '#a493f2' : '#4a4560';
      g.fillRect(340, 48 + i * 30, 150 - (i % 3) * 30, 12);
    }
    g.fillStyle = '#e9e5f6';
    g.font = `26px ${mono}`;
    g.fillText(label ?? 'PROJETS', 30, 284);
  } else {
    g.fillStyle = '#4a4560';
    g.font = `22px ${mono}`;
    g.fillText('_', 24, 70);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function Screen({ labels }: { labels: Record<string, string> }) {
  const group = useRef<Group>(null);
  const glow = useRef<PointLight>(null);
  const lit = useRef(0);
  const zone = useStore((s) => s.zone);
  const project = useStore((s) => s.project);
  const open = useStore((s) => s.panelZone === 1);
  const fontsReady = useFontsReady();
  const label = project ? labels[project] ?? null : null;
  const off = useMemo(() => (fontsReady ? screenTexture(null, false) : null), [fontsReady]);
  const on = useMemo(() => (fontsReady ? screenTexture(label, true) : null), [fontsReady, label]);
  const active = open && zone === 1;
  useFrame(({ clock }, dt) => {
    lit.current += ((active ? 1 : 0) - lit.current) * Math.min(1, dt * 3);
    if (glow.current) glow.current.intensity = lit.current * 3;
    if (group.current) {
      group.current.scale.setScalar(1 + lit.current * 0.04);
      if (!rt.reduced) group.current.position.y = P[1].y + 2.6 + Math.sin(clock.elapsedTime * 0.9) * 0.06;
    }
  });
  return (
    <group ref={group} position={[P[1].x + 0.6, P[1].y + 2.6, P[1].z - 1.6]} rotation={[0, -0.12, 0]} {...hoverHandlers('zone', 1)}>
      <Box s={[4.2, 2.7, 0.22]} p={[0, 0, 0]} m={mats.stone} />
      <mesh position={[0, 0, 0.115]}>
        <planeGeometry args={[3.8, 2.37]} />
        {/* Une texture qui arrive après coup demande un nouveau shader : on recrée le matériau. */}
        <meshBasicMaterial key={(active ? on : off)?.uuid ?? 'vide'} map={active ? on : off} toneMapped={false} />
      </mesh>
      <pointLight ref={glow} color="#9fd8ff" intensity={0} distance={7} position={[0, 0, 1.2]} />
    </group>
  );
}

function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

// ------------------------------------------------------------ Compétences : cubes étiquetés
function labelTexture(txt: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = '#fffdf8';
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = '#e3dccf';
  g.lineWidth = 6;
  g.strokeRect(3, 3, 122, 122);
  g.fillStyle = '#201c2c';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `${txt.length > 4 ? 20 : 30}px ${cssFont('--font-silk', 'ui-monospace, monospace')}`;
  g.fillText(txt, 64, 66);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.magFilter = NearestFilter;
  return t;
}

function SkillCube({ index, label }: { index: number; label: string }) {
  const mesh = useRef<Mesh>(null);
  const hover = useRef(0);
  const isHovered = useStore((s) => s.hovered?.kind === 'skill' && s.hovered.index === index);
  const mat = useMemo(() => new MeshStandardMaterial({ map: labelTexture(label), roughness: 0.8, emissive: new Color('#7f6cf0'), emissiveIntensity: 0 }), [label]);
  const n = SKILL_CUBES.length;
  const a = -0.95 + (index * 1.9) / (n - 1);
  const base: [number, number, number] = [
    P[2].x + Math.sin(a) * 2.5 + (index % 2 ? 0.3 : -0.3),
    P[2].y + 1.7 + (index % 3) * 0.55,
    P[2].z - 0.9 - Math.cos(a) * 0.8,
  ];
  const phase = index * 1.3;
  useFrame(({ clock }, dt) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.elapsedTime;
    hover.current += ((isHovered ? 1 : 0) - hover.current) * Math.min(1, dt * 10);
    const kick = Math.max(0, (rt.kicks.get(index) ?? 0) - dt * 2);
    rt.kicks.set(index, kick);
    const still = rt.reduced;
    m.position.set(base[0], base[1] + (still ? 0 : Math.sin(t * 1.2 + phase) * 0.12) + kick * 0.4, base[2]);
    m.rotation.set(still ? 0 : Math.sin(t * 0.5 + phase) * 0.15, (still ? 0 : t * 0.3) + phase + kick * 3, 0);
    m.scale.setScalar(0.72 * (1 + hover.current * 0.15));
    mat.emissiveIntensity = hover.current * 0.35;
  });
  return (
    <mesh
      ref={mesh}
      castShadow
      material={mat}
      onPointerOver={(e) => {
        e.stopPropagation();
        useStore.getState().setHovered({ kind: 'skill', index }, e.point.x);
      }}
      onPointerOut={() => useStore.getState().setHovered(null)}
      onClick={(e) => {
        e.stopPropagation();
        rt.kicks.set(index, 1);
        const st = useStore.getState();
        if (st.zone !== 2) {
          rt.go(2);
          return;
        }
        rt.face = e.point.x > rt.heroPos.x ? 1 : -1;
        st.say(SKILL_CUBES[index][1], 2800);
        rt.send({ type: 'TALK', ms: 2800 });
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

function Skills() {
  const ready = useFontsReady();
  if (!ready) return null;
  return (
    <>
      {SKILL_CUBES.map(([label], i) => (
        <SkillCube key={label} index={i} label={label} />
      ))}
    </>
  );
}

// ------------------------------------------------------------ À propos : lampe et livres
function Lamp() {
  const lampMat = useMemo(() => new MeshStandardMaterial({ color: '#fff1c9', emissive: new Color('#ffd98a'), emissiveIntensity: 0.8 }), []);
  const books = useMemo(
    () =>
      (
        [
          ['#a493f2', 0],
          ['#f2a6a0', 0.18],
          ['#8fb56e', 0.34],
        ] as const
      ).map(([c, y], i) => ({ m: new MeshStandardMaterial({ color: c, roughness: 0.8 }), y, w: 0.7 - i * 0.08 })),
    [],
  );
  return (
    <group {...hoverHandlers('zone', 3)}>
      <group position={[P[3].x - 2, P[3].y, P[3].z - 1.3]}>
        <Box s={[0.1, 1.2, 0.1]} p={[0, 0.6, 0]} m={mats.dark} />
        <Box s={[0.5, 0.34, 0.5]} p={[0, 1.3, 0]} m={lampMat} cast={false} />
      </group>
      <pointLight color="#ffd79a" intensity={2.2} distance={6} position={[P[3].x - 2, P[3].y + 1.4, P[3].z - 1.1]} />
      {books.map((b, i) => (
        <Box key={i} s={[b.w, 0.16, 0.5]} p={[P[3].x + 1.1, P[3].y + 0.08 + b.y, P[3].z - 1.3]} m={b.m} />
      ))}
    </group>
  );
}

// ------------------------------------------------------------ Contact : boîte aux lettres flottante
function Mailbox() {
  const group = useRef<Group>(null);
  const flap = useMemo(() => new BufferGeometry().setFromPoints([new Vector3(-0.4, 0.26, 0), new Vector3(0.4, 0.26, 0), new Vector3(0, -0.02, 0)]), []);
  useFrame(({ clock }) => {
    if (!group.current || rt.reduced) return;
    const t = clock.elapsedTime;
    group.current.position.y = P[4].y + 2.2 + Math.sin(t * 1.1 + 1) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.6) * 0.15;
  });
  return (
    <group ref={group} position={[P[4].x + 1.3, P[4].y + 2.2, P[4].z - 1.2]} {...hoverHandlers('zone', 4)}>
      <Box s={[1.3, 1.0, 1.0]} p={[0, 0, 0]} m={mats.stone} />
      <mesh position={[0, 0, 0.505]}>
        <planeGeometry args={[0.8, 0.52]} />
        <meshBasicMaterial color="#a493f2" toneMapped={false} />
      </mesh>
      <mesh geometry={flap} position={[0, 0, 0.51]}>
        <meshBasicMaterial color="#7a64e0" side={DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Props({ labels }: { labels: Record<string, string> }) {
  return (
    <>
      <Plant at={[-2.4, 0, -1.4]} />
      <Plant at={[2.4, 0, -1.6]} s={1.3} />
      <Plant at={[P[3].x + 1.9, P[3].y, P[3].z - 1.2]} s={1.2} />
      <Screen labels={labels} />
      <Skills />
      <Lamp />
      <Mailbox />
    </>
  );
}
