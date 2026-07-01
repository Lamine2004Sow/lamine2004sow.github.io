'use client'

import { Github, ArrowUp, Heart } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative mt-auto border-t border-border/40 bg-background/60 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white font-mono text-sm shadow-lg shadow-emerald-500/20">
              ML
            </span>
            <div className="flex flex-col">
              <span className="font-semibold leading-tight">
                Mouhamadou Lamine SOW
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Data Science · ML · Optimisation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Lamine2004Sow"
              target="_blank"
              rel="noopener noreferrer"
              className="grid place-items-center h-10 w-10 rounded-full border border-border/40 bg-background/60 hover:bg-accent hover:border-emerald-500/40 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="grid place-items-center h-10 w-10 rounded-full border border-border/40 bg-background/60 hover:bg-accent hover:border-emerald-500/40 transition-colors"
              aria-label="Haut de page"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            © {year} Mouhamadou Lamine SOW. Tous droits réservés.
          </p>
          <p className="inline-flex items-center gap-1.5">
            Construit avec
            <Heart className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
            en Next.js, TypeScript &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
