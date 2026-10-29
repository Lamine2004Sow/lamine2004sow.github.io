import type { Metadata } from 'next';
import Link from 'next/link';
import { EDUCATION, EXPERIENCES, PROFILE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Parcours de Mouhamadou Lamine SOW : Sup Galilée, stages chez Orange (Sonatel), machine learning et recherche opérationnelle.',
};

export default function APropos() {
  return (
    <>
      <p className="kicker">À PROPOS</p>
      <h1 id="titre">Prédire, puis décider</h1>
      <p className="lede">
        Je suis {PROFILE.name}, élève-ingénieur en informatique. Ce qui me plaît, c’est d’aller au bout de la chaîne : un modèle qui prédit bien
        ne sert à rien si personne ne peut décider avec.
      </p>
      <p>
        C’est ce qui m’a mené au croisement du machine learning et de la recherche opérationnelle. Chez Orange (Sonatel), j’ai prédit quels
        équipements du réseau fibre allaient saturer pour aider les équipes à planifier leurs interventions. Sur le challenge ROADEF/EURO 2020,
        j’ai planifié la maintenance du réseau électrique de RTE. Entre les deux, j’essaie de faire des projets qu’on peut vérifier : des
        protocoles fixés à l’avance, des tests, et des chiffres qu’on peut rejouer.
      </p>
      <h2>Expérience</h2>
      {EXPERIENCES.map((e) => (
        <div className="entry" key={e.title}>
          <strong>{e.title}</strong>
          <span>{e.meta}</span>
          <p>{e.text}</p>
          {e.href && <Link href={e.href}>Lire la fiche du stage →</Link>}
        </div>
      ))}
      <h2>Formation</h2>
      {EDUCATION.map((e) => (
        <div className="entry" key={e.title}>
          <strong>{e.title}</strong>
          <span>{e.meta}</span>
          <p>{e.text}</p>
        </div>
      ))}
    </>
  );
}
