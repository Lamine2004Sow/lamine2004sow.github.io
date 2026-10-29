import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.title, description: p.description } : {};
}

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const formatDate = (d: string) => {
  const [y, m] = d.split('-').map(Number);
  return m ? `${MONTHS[m - 1]} ${y}` : String(y);
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  return (
    <article className="body" style={{ display: 'contents' }}>
      <p className="kicker">
        <Link href="/projets/">← PROJETS</Link> · {p.kind === 'stage' ? 'STAGE' : 'PROJET'}
      </p>
      <h1 id="titre">{p.title}</h1>
      <p className="lede">{p.description}</p>
      <p className="note">{p.result}</p>
      <div className="tags">
        {p.tags.map((t) => (
          <span key={t}>{t.toUpperCase()}</span>
        ))}
      </div>
      <div className="rows">
        {p.role && (
          <div>
            <span>Rôle</span>
            <b>{p.role}</b>
          </div>
        )}
        <div>
          <span>{p.duree ? 'Période' : 'Date'}</span>
          <b>{p.duree ?? formatDate(p.date)}</b>
        </div>
        <div>
          <span>Statut</span>
          <b>{p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Terminé'}</b>
        </div>
      </div>
      {(p.github || p.demo) && (
        <div className="links">
          {p.demo && (
            <a className="btn primary" href={p.demo} target="_blank" rel="noreferrer">
              VOIR LA DÉMO ↗
            </a>
          )}
          {p.github && (
            <a className={p.demo ? 'btn' : 'btn primary'} href={p.github} target="_blank" rel="noreferrer">
              CODE SUR GITHUB ↗
            </a>
          )}
        </div>
      )}
      <div className="body" dangerouslySetInnerHTML={{ __html: p.html }} />
      {p.joke && <p className="joke">« {p.joke} »</p>}
      <p>
        <Link href="/projets/">← Tous les projets</Link>
      </p>
    </article>
  );
}
