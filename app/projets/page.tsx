import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Projets de machine learning, LLM, MLOps et recherche opérationnelle, avec leurs résultats chiffrés.',
};

export default function Projets() {
  const projects = getProjects();
  return (
    <>
      <p className="kicker">PROJETS</p>
      <h1 id="titre">Ce que j’ai construit</h1>
      <p className="lede">Machine learning, LLM, MLOps et recherche opérationnelle. Chaque fiche donne le contexte, la méthode et des résultats vérifiables.</p>
      <ul className="cards">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link href={`/projets/${p.slug}/`}>
              <span className="kicker">
                {p.kind === 'stage' ? 'STAGE' : 'PROJET'} · {p.short}
                {p.status ? ` · ${p.status.toUpperCase()}` : ''}
              </span>
              <strong>{p.title}</strong>
              <small>{p.result}</small>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
