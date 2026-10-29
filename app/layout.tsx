import type { Metadata, Viewport } from 'next';
import { Pixelify_Sans, Rethink_Sans, Silkscreen } from 'next/font/google';
import type { ReactNode } from 'react';
import { getProjectMetas } from '@/lib/content';
import { PROFILE } from '@/lib/site';
import { Bubble } from '@/ui/Bubble';
import { Hint } from '@/ui/Hint';
import { Nav } from '@/ui/Nav';
import { Panel } from '@/ui/Panel';
import { WorldShell } from '@/ui/WorldShell';
import './globals.css';

const pixel = Pixelify_Sans({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-pixel' });
const body = Rethink_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-body' });
const silk = Silkscreen({ subsets: ['latin'], weight: '400', variable: '--font-silk' });

export const metadata: Metadata = {
  metadataBase: new URL(PROFILE.site),
  title: { default: `${PROFILE.name} · Portfolio`, template: `%s · ${PROFILE.name}` },
  description: `${PROFILE.name}, élève-ingénieur et AI Engineer : IA générative (LLM, RAG, agents), machine learning, optimisation et MLOps. ${PROFILE.availability}.`,
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', locale: 'fr_FR', siteName: PROFILE.name },
};

export const viewport: Viewport = { themeColor: '#f6f1e8', viewportFit: 'cover' };

// Applique le mode classique mémorisé avant le premier affichage (évite un flash du monde).
const classicScript = `try{if(localStorage.getItem('classic')==='1')document.documentElement.dataset.classic='1'}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  const projects = getProjectMetas();
  const shorts = Object.fromEntries(projects.map((p) => [p.slug, p.short]));
  return (
    <html lang="fr" className={`${pixel.variable} ${body.variable} ${silk.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: classicScript }} />
      </head>
      <body>
        <Nav />
        <WorldShell labels={shorts} />
        <Bubble />
        <Panel shorts={shorts}>{children}</Panel>
        <Hint />
      </body>
    </html>
  );
}
