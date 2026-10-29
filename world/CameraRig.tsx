'use client';

import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '@/store';
import { rt } from './runtime';

// Caméra diorama (FOV serré) qui suit le perso avec un léger retard
// et se décale pour laisser la place à la fenêtre ouverte.
export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const goal = useMemo(() => new Vector3(), []);
  const started = useRef(false);

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const portrait = size.width < size.height;
    const fov = portrait ? 40 : 32;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    const h = rt.heroPos;
    if (!started.current) {
      // Premier plan large, puis la caméra plonge vers le perso.
      started.current = true;
      pos.set(h.x + 4, h.y + 9, h.z + 30);
      look.set(h.x, h.y + 1, h.z);
    }
    const st = useStore.getState();
    const panelOpen = st.panelZone != null && st.panelZone === st.zone && !portrait;
    if (rt.intro) goal.set(h.x + 1.2, h.y + 2.3, h.z + (portrait ? 9 : 8));
    else goal.set(h.x + (panelOpen ? 2.2 : 0.6), h.y + (portrait ? 3.4 : 2.5), h.z + (portrait ? 10 : 9.2));
    pos.lerp(goal, rt.reduced ? 1 : 1 - Math.exp(-dt * (rt.intro ? 1.3 : 2.2)));
    // En portrait, la fenêtre occupe le bas de l'écran : on remonte le perso dans le cadre.
    const sheetOpen = portrait && st.panelZone != null && st.panelZone === st.zone;
    goal.set(h.x + (panelOpen ? 2.0 : 0.4), h.y + (sheetOpen ? -1.4 : portrait ? 0.6 : 1.1), h.z - 0.6);
    look.lerp(goal, rt.reduced ? 1 : 1 - Math.exp(-dt * 3));
    camera.position.copy(pos);
    camera.lookAt(look);
  });
  return null;
}
