'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ZONES, zoneFromPath } from '@/lib/site';
import { useStore } from '@/store';

export function Nav() {
  const zone = zoneFromPath(usePathname());
  const classic = useStore((s) => s.classic);
  const setClassic = useStore((s) => s.setClassic);
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
        Lamine SOW <small>ML · RO</small>
      </Link>
      <nav className="zones" aria-label="Zones du portfolio">
        {ZONES.map((z, i) => (
          <Link key={z.id} href={z.href} aria-current={i === zone ? 'page' : undefined}>
            {z.label}
          </Link>
        ))}
      </nav>
      <button className="chip toggle" type="button" aria-pressed={classic} onClick={() => setClassic(!classic)}>
        {classic ? 'RETOUR AU MONDE' : 'MODE CLASSIQUE'}
      </button>
    </header>
  );
}
