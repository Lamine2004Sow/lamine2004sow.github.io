import type { Metadata } from 'next';
import { CVS, PROFILE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contacter Mouhamadou Lamine SOW pour un stage de fin d’études de 6 mois en machine learning ou recherche opérationnelle, dès mars 2027.',
};

export default function Contact() {
  return (
    <>
      <p className="kicker">CONTACT</p>
      <h1 id="titre">On en parle ?</h1>
      <p className="lede">Je cherche un stage de fin d’études de 6 mois en machine learning, data science ou recherche opérationnelle, à partir de mars 2027.</p>
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
        {CVS.map((cv) => (
          <div key={cv.label}>
            <span>{cv.label}</span>
            <b>
              <a href={cv.fr}>FR</a> · <a href={cv.en}>EN</a>
            </b>
          </div>
        ))}
      </div>
      <div className="links">
        <a className="btn primary" href={`mailto:${PROFILE.email}`}>
          M’ÉCRIRE
        </a>
      </div>
    </>
  );
}
