'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ZONES, zoneFromPath } from '@/lib/site';
import { useStore } from '@/store';

export function Nav() {
  const zone = zoneFromPath(usePathname());
  const classic = useStore((s) => s.classic);
  const setClassic = useStore((s) => s.setClassic);
  const worldOn = useStore((s) => s.worldOn);
  const issue = useStore((s) => s.worldIssue);
  const retry = useStore((s) => s.retryWorld);
  return (
    <header className="bar">
      <a
        className="skip"
        href="#contenu"
        onClick={() => {
          if (document.documentElement.classList.contains('world')) setClassic(true);
        }}
      >
        Aller au contenu
      </a>
      <Link href="/" className="brand">
        Lamine SOW <small>AI ENGINEER</small>
      </Link>
      <nav className="zones" aria-label="Zones du portfolio">
        {ZONES.map((z, i) => (
          <Link key={z.id} href={z.href} aria-current={i === zone ? 'page' : undefined}>
            {z.label}
          </Link>
        ))}
      </nav>
      {issue ? (
        issue.retry && (
          <button className="chip toggle" type="button" onClick={retry}>
            RÉESSAYER LA 3D
          </button>
        )
      ) : classic ? (
        <button className="chip toggle" type="button" aria-pressed="true" onClick={() => setClassic(false)}>
          VOIR LA VERSION 3D
        </button>
      ) : worldOn ? (
        <button className="chip toggle" type="button" aria-pressed="false" onClick={() => setClassic(true)}>
          VERSION TEXTE
        </button>
      ) : (
        <button className="chip toggle" type="button" aria-busy="true" onClick={() => setClassic(true)}>
          CHARGEMENT 3D…
        </button>
      )}
      {issue && (
        <p className="world-issue" role="status">
          {issue.reason} Le contenu reste disponible ci-dessous.
        </p>
      )}
    </header>
  );
}
