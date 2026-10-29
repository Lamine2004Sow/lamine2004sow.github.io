'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { Component, type ReactNode, useEffect, useState } from 'react';
import { ZONES, zoneFromPath } from '@/lib/site';
import { useStore } from '@/store';
import { rt } from '@/world/runtime';

// Le monde se charge après le premier affichage du contenu HTML, uniquement côté client.
const World = dynamic(() => import('@/world/World'), { ssr: false });

class WorldBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function WorldShell({ labels }: { labels: Record<string, string> }) {
  const pathname = usePathname();
  const router = useRouter();
  const classic = useStore((s) => s.classic);
  const worldOn = useStore((s) => s.worldOn);
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
    setSupported(webglAvailable());
  }, []);

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

  if (!supported || classic) return null;
  return (
    <WorldBoundary onError={() => setSupported(false)}>
      <World labels={labels} />
    </WorldBoundary>
  );
}
