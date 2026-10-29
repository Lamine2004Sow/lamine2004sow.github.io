import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <p className="kicker">ERREUR 404</p>
      <h1 id="titre">Page introuvable</h1>
      <p className="lede">Cette adresse n’existe pas, ou elle a disparu avec l’ancien design.</p>
      <p className="joke">« Le solveur a exploré toutes les branches. Cette page n’est dans aucune. »</p>
      <div className="links">
        <Link className="btn primary" href="/">
          RETOUR À L’ACCUEIL
        </Link>
      </div>
    </>
  );
}
