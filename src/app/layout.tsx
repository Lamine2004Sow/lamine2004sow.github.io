import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mouhamadou Lamine SOW — Étudiant Ingénieur en IA/ML",
  description:
    "Portfolio de Mouhamadou Lamine SOW, étudiant ingénieur en IA/ML à l'Université Sorbonne Paris Nord. Intelligence Artificielle, Machine Learning, Traitement Automatique des Langues (NLP/TAL), Computer Vision, Vision par Ordinateur, Optimisation et Recherche Opérationnelle (RO).",
  keywords: [
    "Mouhamadou Lamine SOW",
    "Lamine SOW",
    "Mouhamadou SOW",
    "Lamine Sow",
    "IA/ML",
    "Intelligence Artificielle",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "TAL",
    "Traitement Automatique des Langues",
    "Computer Vision",
    "Vision par Ordinateur",
    "Optimisation",
    "Recherche Opérationnelle",
    "RO",
    "Python",
    "Portfolio",
    "Sorbonne Paris Nord",
    "Sup Galilée",
  ],
  authors: [{ name: "Mouhamadou Lamine SOW" }],
  openGraph: {
    title: "Mouhamadou Lamine SOW — Étudiant Ingénieur en IA/ML",
    description:
      "Étudiant Ingénieur en IA/ML · Machine Learning · NLP · Computer Vision · Optimisation & RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mouhamadou Lamine SOW — Étudiant Ingénieur en IA/ML",
    description:
      "Étudiant Ingénieur en IA/ML · Machine Learning · NLP · Computer Vision · Optimisation & RO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
