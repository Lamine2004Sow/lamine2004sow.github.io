import type { Metadata } from 'next';
import Link from 'next/link';
import { EDUCATION, EXPERIENCES, PROFILE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Parcours de Mouhamadou Lamine SOW : Sup Galilée, stages chez Orange (Sonatel), AI engineering, IA générative, machine learning et optimisation.',
};

export default function APropos() {
  return (
    <>
      <p className="kicker">À PROPOS</p>
      <h1 id="titre">Construire, déployer, prouver</h1>
      <p className="lede">
        Je suis {PROFILE.name}, élève-ingénieur en informatique, orienté AI engineering. Ce qui me plaît, c’est d’aller au bout de la chaîne :
        construire un système d’IA, le mettre en production, et montrer avec des chiffres qu’il fait ce qu’on attend de lui.
      </p>
      <p>
        Côté IA générative, j’ai construit un agent LLM juridique (LangGraph, RAG hybride FAISS + BM25) avec un garde-fou, des citations vérifiées
        et un banc d’évaluation qui échoue si un prompt change sans que l’évaluation soit rejouée. Je fine-tune maintenant un modèle d’embeddings
        pour améliorer sa recherche. Côté mise en production, une plateforme MLOps sur Kubernetes détecte seule la dégradation de son modèle et
        le réentraîne.
      </p>
      <p>
        En parallèle, je fais aussi du machine learning classique et de l’optimisation mathématique (la recherche opérationnelle). Chez Orange
        (Sonatel), j’ai prédit les risques sur le réseau fibre pour aider les équipes à prioriser leurs interventions. Sur le challenge
        ROADEF/EURO 2020, j’ai planifié la maintenance du réseau électrique de RTE. Dans tous mes projets, je fixe la méthode d’évaluation avant de
        commencer, j’écris des tests et je publie des chiffres que chacun peut vérifier.
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
