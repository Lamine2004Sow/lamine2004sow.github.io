'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { Component, type ReactNode, useEffect, useState } from 'react';
import { ZONES, zoneFromPath } from '@/lib/site';
import { useStore } from '@/store';
import { rt } from '@/world/runtime';

// Le monde se charge après le premier affichage du contenu HTML, uniquement côté client.
const World = dynamic(() => import('@/world/World'), { ssr: false });

/** Délai au-delà duquel on considère que le monde ne démarrera pas (réseau lent, texture bloquée). */
const LOAD_TIMEOUT = 15000;

class WorldBoundary extends Component<{ children: ReactNode; onError: (e: Error) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    // three.js n'utilise plus que WebGL2 : un navigateur limité à WebGL1 planterait.
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

export function WorldShell({ labels }: { labels: Record<string, string> }) {
  const pathname = usePathname();
  const router = useRouter();
  const classic = useStore((s) => s.classic);
  const worldOn = useStore((s) => s.worldOn);
  const issue = useStore((s) => s.worldIssue);
  const attempt = useStore((s) => s.worldAttempt);
  const [supported, setSupported] = useState<boolean | null>(null);

  // L'URL décide de la zone active.
  useEffect(() => {
    const zone = zoneFromPath(pathname);
    const parts = pathname.split('/').filter(Boolean);
    useStore.getState().setRoute(zone, parts[0] === 'projets' && parts[1] ? parts[1] : null);
  }, [pathname]);

  useEffect(() => {
    rt.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    rt.touch = matchMedia('(hover: none)').matches;
    let saved = false;
    try {
      saved = localStorage.getItem('classic') === '1';
    } catch {}
    useStore.getState().setClassic(saved);
    const ok = webglAvailable();
    setSupported(ok);
    if (!ok) useStore.getState().setWorldIssue({ reason: 'Ce navigateur ne gère pas WebGL2, nécessaire à la 3D.', retry: false });
  }, []);

  // Le monde n'a pas démarré à temps : on l'abandonne et on le dit, au lieu d'attendre sans fin.
  useEffect(() => {
    if (!supported || classic || worldOn || issue) return;
    const id = setTimeout(() => {
      if (!useStore.getState().worldOn) {
        console.warn('[monde 3D] démarrage trop long, abandon');
        useStore.getState().setWorldIssue({ reason: 'La 3D a mis trop de temps à charger.', retry: true });
      }
    }, LOAD_TIMEOUT);
    return () => clearTimeout(id);
  }, [supported, classic, worldOn, issue, attempt]);

  useEffect(() => {
    rt.go = (zone) => {
      const st = useStore.getState();
      if (zone === st.zone && !st.project) {
        rt.send({ type: 'NAVIGATE', zone, from: 0, distance: 0 });
      } else {
        router.push(ZONES[zone].href);
      }
    };
  }, [router]);

  useEffect(() => {
    const on = worldOn && !classic;
    document.documentElement.classList.toggle('world', on);
    document.documentElement.dataset.classic = classic ? '1' : '0';
  }, [worldOn, classic]);

  if (!supported || classic || issue) return null;
  return (
    <WorldBoundary
      key={attempt}
      onError={(e) => {
        console.error('[monde 3D]', e);
        useStore.getState().setWorldIssue({ reason: `La 3D a rencontré une erreur (${e.message}).`, retry: true });
      }}
    >
      <World labels={labels} />
    </WorldBoundary>
  );
}
