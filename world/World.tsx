'use client';

import { Suspense } from 'react';
import { PCFShadowMap, SRGBColorSpace } from 'three';
import { Canvas } from '@react-three/fiber';
import { Guide } from '@/guide/Guide';
import { useStore } from '@/store';
import { Clouds, FloatingCubes, Sky } from './Atmosphere';
import { Bot } from './Bot';
import { CameraRig } from './CameraRig';
import { Platforms } from './Platforms';
import { Props } from './Props';
import { rt } from './runtime';

export default function World({ labels }: { labels: Record<string, string> }) {
  const worldOn = useStore((s) => s.worldOn);
  return (
    <Canvas
      id="world"
      className={worldOn ? 'on' : undefined}
      aria-hidden="true"
      dpr={[1, rt.touch ? 1.5 : 2]}
      shadows={{ type: PCFShadowMap }}
      camera={{ fov: 32, near: 0.1, far: 400, position: [4, 9, 30] }}
      gl={{ antialias: true, powerPreference: 'high-performance', outputColorSpace: SRGBColorSpace }}
      style={{ position: 'fixed', inset: 0 }}
      onPointerMissed={() => rt.send({ type: 'WAKE' })}
    >
      <Sky />
      <Platforms />
      <Props labels={labels} />
      <FloatingCubes />
      <Clouds />
      <Bot />
      <CameraRig />
      <Suspense fallback={null}>
        <Guide />
      </Suspense>
    </Canvas>
  );
}
