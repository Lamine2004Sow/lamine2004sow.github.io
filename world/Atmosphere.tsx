'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { BackSide, CanvasTexture, Color, Fog, MathUtils, Object3D, SRGBColorSpace, SpriteMaterial } from 'three';
import type { DirectionalLight, HemisphereLight, InstancedMesh, Sprite } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { mats, rng, unitBox } from './materials';
import { rt } from './runtime';

// Ciel qui passe du jour au crépuscule le long du chemin, lumières, cubes et nuages lointains.

const DAY = { top: new Color('#bcd3f0'), mid: new Color('#eef1f2'), low: new Color('#fbf3e6') };
const DUSK = { top: new Color('#5b4ea8'), mid: new Color('#b8a6e8'), low: new Color('#f3c9cf') };

export function Sky() {
  const scene = useThree((s) => s.scene);
  const uniforms = useMemo(() => ({ top: { value: DAY.top.clone() }, mid: { value: DAY.mid.clone() }, low: { value: DAY.low.clone() } }), []);
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);

  useLayoutEffect(() => {
    scene.fog = new Fog(DAY.mid.clone(), 34, 130);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame(() => {
    const k = MathUtils.smoothstep(rt.heroPos.x, 14, 30);
    rt.dusk = k;
    uniforms.top.value.copy(DAY.top).lerp(DUSK.top, k);
    uniforms.mid.value.copy(DAY.mid).lerp(DUSK.mid, k);
    uniforms.low.value.copy(DAY.low).lerp(DUSK.low, k);
    if (scene.fog) (scene.fog as Fog).color.copy(uniforms.mid.value).lerp(uniforms.low.value, 0.4);
    if (hemi.current) hemi.current.color.setHSL(0.1 - k * 0.32, 0.5, 0.95 - k * 0.1);
    const s = sun.current;
    if (s) {
      s.intensity = 1.9 - k * 0.7;
      s.color.setHSL(0.09 - k * 0.05, 0.7, 0.9);
      s.position.set(rt.heroPos.x + 8, rt.heroPos.y + 16, rt.heroPos.z + 9);
      s.target.position.copy(rt.heroPos);
      s.target.updateMatrixWorld();
    }
  });

  const shadowSize = rt.touch ? 1024 : 2048;
  return (
    <>
      <mesh renderOrder={-1}>
        <sphereGeometry args={[300, 32, 16]} />
        <shaderMaterial
          side={BackSide}
          depthWrite={false}
          fog={false}
          uniforms={uniforms}
          vertexShader={`varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`}
          fragmentShader={`uniform vec3 top; uniform vec3 mid; uniform vec3 low; varying vec3 vP;
            void main(){ float h = vP.y; vec3 c = h > 0.08 ? mix(mid, top, smoothstep(0.08, 0.6, h)) : mix(low, mid, smoothstep(-0.3, 0.08, h)); gl_FragColor = vec4(c,1.); }`}
        />
      </mesh>
      <hemisphereLight ref={hemi} args={['#fffaf0', '#e6dcf2', 1.6]} />
      <directionalLight
        ref={sun}
        color="#fff3df"
        intensity={2.3}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0008}
        shadow-normalBias={0.02}
      />
    </>
  );
}

export function FloatingCubes() {
  const n = rt.touch ? 70 : 140;
  const mesh = useRef<InstancedMesh>(null);
  const data = useMemo(() => {
    const r = rng(9);
    const out: { x: number; y: number; z: number; s: number; p: number; rs: number }[] = [];
    for (let i = 0; i < n; i++) {
      let x: number, y: number, z: number;
      do {
        x = -30 + r() * 100;
        y = -12 + r() * 28;
        z = -60 + r() * 62;
      } while ((z > -8 && y > -5) || (z > -14 && y > -2 && y < 5));
      out.push({ x, y, z, s: 0.3 + r() * r() * 2.4, p: r() * 6.28, rs: (r() - 0.5) * 0.2 });
    }
    return out;
  }, [n]);
  const dummy = useMemo(() => new Object3D(), []);

  const place = (t: number) => {
    const m = mesh.current;
    if (!m) return;
    data.forEach((f, i) => {
      dummy.position.set(f.x, f.y + Math.sin(t * 0.35 + f.p) * 0.35, f.z);
      dummy.rotation.set(0, f.p + t * f.rs, 0);
      dummy.scale.setScalar(f.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => place(0));
  useFrame(({ clock }) => {
    if (!rt.reduced) place(clock.elapsedTime);
  });

  return <instancedMesh ref={mesh} args={[unitBox, mats.stone, n]} />;
}

function cloudTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d')!;
  [
    [70, 80, 46],
    [120, 62, 58],
    [176, 78, 44],
    [128, 88, 60],
  ].forEach(([x, y, r]) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, 'rgba(255,255,255,.95)');
    gr.addColorStop(0.6, 'rgba(255,255,255,.6)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 128);
  });
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

export function Clouds() {
  const mat = useMemo(() => new SpriteMaterial({ map: cloudTexture(), transparent: true, depthWrite: false, opacity: 0.9 }), []);
  const specs = useMemo(() => {
    const r = rng(3);
    const out: { p: [number, number, number]; k: number; v: number }[] = [];
    for (let i = 0; i < 26; i++) {
      const k = 6 + r() * 12;
      out.push({ k, p: [-30 + r() * 100, -9 + r() * 20, -60 + r() * 40], v: 0.05 + r() * 0.15 });
    }
    for (let i = 0; i < 10; i++) {
      const k = 10 + r() * 10;
      out.push({ k, p: [-20 + r() * 80, -7 - r() * 4, -6 + r() * 10], v: 0.04 + r() * 0.08 });
    }
    return out;
  }, []);
  const refs = useRef<(Sprite | null)[]>([]);
  useFrame((_, dt) => {
    mat.color.setRGB(1, 1 - rt.dusk * 0.12, 1 - rt.dusk * 0.04);
    if (rt.reduced) return;
    refs.current.forEach((s, i) => {
      if (!s) return;
      s.position.x += specs[i].v * dt;
      if (s.position.x > 75) s.position.x = -35;
    });
  });
  return (
    <>
      {specs.map((c, i) => (
        <sprite key={i} ref={(el) => void (refs.current[i] = el)} material={mat} position={c.p} scale={[c.k, c.k / 2, 1]} />
      ))}
    </>
  );
}
