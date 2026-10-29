import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { PROFILE } from '@/lib/site';

export default function Home() {
  const featured = getProjects().slice(0, 4);
  return (
    <>
      <p className="kicker">PORTFOLIO</p>
      <h1 id="titre">{PROFILE.name}</h1>
      <p className="lede">{PROFILE.title}</p>
      <p>
        Élève-ingénieur en dernière année à Sup Galilée (Université Sorbonne Paris Nord). Je travaille à l’interface du machine learning et de la
        recherche opérationnelle : prédire avec des modèles, puis décider avec la PLNE et les métaheuristiques. Mis en pratique chez Orange
        (Sonatel), sur le challenge ROADEF/EURO 2020 de RTE, et sur des projets de LLM et de MLOps.
      </p>
      <p className="note">{PROFILE.availability}.</p>
      <div className="links">
        <Link className="btn primary" href="/projets/">
          VOIR LES PROJETS →
        </Link>
        <Link className="btn" href="/contact/">
          ME CONTACTER
        </Link>
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
