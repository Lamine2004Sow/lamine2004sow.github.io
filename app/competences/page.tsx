import type { Metadata } from 'next';
import { CERTIFICATION, LANGUAGES, SKILL_GROUPS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Compétences',
  description: 'Python, machine learning, deep learning, LLM et RAG, MLOps, recherche opérationnelle : les outils que j’utilise.',
};

export default function Competences() {
  return (
    <>
      <p className="kicker">COMPÉTENCES</p>
      <h1 id="titre">Ce que j’utilise</h1>
      <p className="lede">Uniquement des outils que j’ai mis en œuvre dans un projet, un stage ou un TP. Dans le monde, chaque cube est une techno : clique dessus.</p>
      <div className="rows">
        {SKILL_GROUPS.map((s) => (
          <div key={s.label}>
            <span>{s.label}</span>
            <b>{s.value}</b>
          </div>
        ))}
      </div>
      <h2>Langues & certification</h2>
      <div className="rows">
        <div>
          <span>Langues</span>
          <b>{LANGUAGES}</b>
        </div>
        <div>
          <span>Certification</span>
          <b>{CERTIFICATION}</b>
        </div>
      </div>
    </>
  );
}
