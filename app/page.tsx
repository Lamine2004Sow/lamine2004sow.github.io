import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { CV, PROFILE } from '@/lib/site';

export default function Home() {
  const featured = getProjects().slice(0, 4);
  return (
    <>
      <p className="kicker">PORTFOLIO</p>
      <h1 id="titre">{PROFILE.name}</h1>
      <p className="lede">{PROFILE.title}</p>
      <p>
        Élève-ingénieur en dernière année à Sup Galilée (Université Sorbonne Paris Nord), orienté AI engineering : IA générative (LLM, RAG,
        agents), machine learning, optimisation et mise en production, avec des modèles évalués avant d’être utilisés. Concrètement : un agent
        LLM juridique qui vérifie ses citations, une plateforme MLOps qui se réentraîne seule, un modèle de risque réseau chez Orange (Sonatel)
        et le challenge ROADEF/EURO 2020 de RTE.
      </p>
      <p className="note">{PROFILE.availability}.</p>
      <div className="links">
        <Link className="btn primary" href="/projets/">
          VOIR LES PROJETS →
        </Link>
        <Link className="btn" href="/contact/">
          ME CONTACTER
        </Link>
        <a className="btn" href={CV.href}>
          CV (PDF)
        </a>
      </div>
      <h2>En bref</h2>
      <ul className="cards">
        {featured.map((p) => (
          <li key={p.slug}>
            <Link href={`/projets/${p.slug}/`}>
              <strong>{p.title}</strong>
              <small>{p.result}</small>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
