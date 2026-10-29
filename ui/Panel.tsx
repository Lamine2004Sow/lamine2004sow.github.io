'use client';

import type { ReactNode } from 'react';
import { ZONES } from '@/lib/site';
import { useStore } from '@/store';

// Fenêtre de contenu. En mode classique (ou avant le chargement du monde), c'est la page elle-même ;
// dans le monde, elle s'ouvre quand le perso arrive dans la zone.
export function Panel({ children, shorts }: { children: ReactNode; shorts: Record<string, string> }) {
  const zone = useStore((s) => s.zone);
  const project = useStore((s) => s.project);
  const open = useStore((s) => s.panelZone != null && s.panelZone === s.zone && s.zone !== 0);
  const close = useStore((s) => s.closePanel);
  const kicker = project && shorts[project] ? `PROJET · ${shorts[project]}` : ZONES[zone].label;
  return (
    <main id="contenu" className={open ? 'panel open' : 'panel'} aria-labelledby="titre" tabIndex={-1}>
      <div className="head">
        <i>
          <b />
          <b />
          <b />
        </i>
        <span>{kicker}</span>
        <button className="close" type="button" aria-label="Fermer la fenêtre" onClick={close}>
          FERMER ✕
        </button>
      </div>
      <div className="body">{children}</div>
    </main>
  );
}
