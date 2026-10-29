import Link from 'next/link';

// Ancienne adresse conservée : redirection immédiate (l'export statique n'a pas de redirection serveur).
export function Redirect({ to }: { to: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <link rel="canonical" href={to} />
      <h1 id="titre">Cette page a déménagé</h1>
      <p>
        <Link href={to}>Continuer vers la nouvelle adresse →</Link>
      </p>
    </>
  );
}
