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
  title: "Mouhamadou Lamine SOW — Data Science & Machine Learning",
  description:
    "Portfolio de Mouhamadou Lamine SOW, étudiant en Data Science et Intelligence Artificielle à l'Université Sorbonne Paris Nord. Machine Learning, Optimisation, Vision par Ordinateur.",
  keywords: [
    "Mouhamadou Lamine SOW",
    "Data Science",
    "Machine Learning",
    "Optimisation",
    "Python",
    "Portfolio",
    "Sorbonne Paris Nord",
    "Sup Galilée",
  ],
  authors: [{ name: "Mouhamadou Lamine SOW" }],
  openGraph: {
    title: "Mouhamadou Lamine SOW — Data Science & ML",
    description:
      "Étudiant en Data Science & IA · Machine Learning · Optimisation · Vision par Ordinateur",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mouhamadou Lamine SOW — Data Science & ML",
    description:
      "Étudiant en Data Science & IA · Machine Learning · Optimisation",
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
