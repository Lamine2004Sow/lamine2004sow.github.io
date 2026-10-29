import type { Metadata } from 'next';
import { CV, PROFILE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contacter Mouhamadou Lamine SOW pour un stage de fin d’études de 6 mois en AI engineering (IA générative, machine learning, MLOps), dès mars 2027.',
};

export default function Contact() {
  return (
    <>
      <p className="kicker">CONTACT</p>
      <h1 id="titre">On en parle ?</h1>
      <p className="lede">Je cherche un stage de fin d’études de 6 mois d’AI Engineer : IA générative, machine learning, MLOps ou optimisation, à partir de mars 2027.</p>
      <div className="rows">
        <div>
          <span>E-mail</span>
          <b>
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          </b>
        </div>
        <div>
          <span>GitHub</span>
          <b>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              github.com/Lamine2004Sow
            </a>
          </b>
        </div>
        <div>
          <span>LinkedIn</span>
          <b>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              mouhamadou-lamine-sow
            </a>
          </b>
        </div>
        <div>
          <span>Lieu</span>
          <b>{PROFILE.location}</b>
        </div>
      </div>
      <h2>CV</h2>
      <div className="rows">
        <div>
          <span>{CV.label}</span>
          <b>
            <a href={CV.href}>Français</a> · <a href={CV.hrefEn}>English</a>
          </b>
        </div>
      </div>
      <div className="links">
        <a className="btn primary" href={`mailto:${PROFILE.email}`}>
          M’ÉCRIRE
        </a>
        <a className="btn" href={CV.href}>
          TÉLÉCHARGER LE CV
        </a>
      </div>
    </>
  );
}
