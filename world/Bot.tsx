'use client';

import { useMemo, useRef } from 'react';
import { MeshBasicMaterial, Vector3 } from 'three';
import type { Group, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { LINES } from '@/lib/site';
import { useStore } from '@/store';
import { Box } from './Platforms';
import { mats } from './materials';
import { rt } from './runtime';

// Bip, le petit robot qui suit le perso en flottant au-dessus de son épaule.
export function Bot() {
  const group = useRef<Group>(null);
  const eyeL = useRef<Mesh>(null);
  const eyeR = useRef<Mesh>(null);
  const eyeMat = useMemo(() => new MeshBasicMaterial({ color: '#7fe3ff', toneMapped: false }), []);
  const target = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);

  useFrame(({ clock, camera }, delta) => {
    const b = group.current;
    if (!b) return;
    const t = clock.elapsedTime;
    const dt = Math.min(0.05, delta);
    const hero = rt.heroPos;
    target.set(hero.x - rt.face * 1.15, hero.y + 1.95 + Math.sin(t * 2.1) * 0.08, hero.z - 0.35);
    b.position.lerp(target, 1 - Math.exp(-dt * 2.6));
    b.rotation.y = Math.atan2(camera.position.x - b.position.x, camera.position.z - b.position.z) * 0.6 + Math.sin(t * 0.8) * 0.12;
    b.rotation.z = Math.sin(t * 1.7) * 0.05;
    const hx = useStore.getState().hoverX;
    if (hx != null) look.set(hx - b.position.x, -0.2, 0.2).normalize();
    else look.set(rt.face, -0.2, 0.2).normalize();
    const blink = t % 4.2 < 0.12 ? 0.15 : 1;
    if (eyeL.current && eyeR.current) {
      eyeL.current.position.set(-0.09 + look.x * 0.04, look.y * 0.04, 0.255);
      eyeR.current.position.set(0.09 + look.x * 0.04, look.y * 0.04, 0.255);
      eyeL.current.scale.y = eyeR.current.scale.y = blink;
    }
  });

  return (
    <group ref={group} position={[-2.7, 2, 0]}>
      <mesh
        scale={[0.56, 0.5, 0.5]}
        material={mats.stone}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          useStore.getState().say(LINES.bot, 2600);
          rt.send({ type: 'TALK', ms: 2600 });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          useStore.getState().setHovered({ kind: 'bot' }, e.point.x);
        }}
        onPointerOut={() => useStore.getState().setHovered(null)}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh position={[0, 0, 0.252]}>
        <planeGeometry args={[0.44, 0.32]} />
        <meshBasicMaterial color="#23202e" />
      </mesh>
      <mesh ref={eyeL} material={eyeMat}>
        <planeGeometry args={[0.07, 0.11]} />
      </mesh>
      <mesh ref={eyeR} material={eyeMat}>
        <planeGeometry args={[0.07, 0.11]} />
      </mesh>
      <Box s={[0.04, 0.18, 0.04]} p={[0, 0.34, 0]} m={mats.dark} cast={false} />
      <Box s={[0.09, 0.09, 0.09]} p={[0, 0.46, 0]} m={mats.lav} cast={false} />
      <Box s={[0.08, 0.2, 0.2]} p={[-0.32, 0, 0]} m={mats.stone2} />
      <Box s={[0.08, 0.2, 0.2]} p={[0.32, 0, 0]} m={mats.stone2} />
    </group>
  );
}
