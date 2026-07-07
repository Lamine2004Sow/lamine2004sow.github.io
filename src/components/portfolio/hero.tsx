'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, MapPin, Sparkles, Star, GitFork, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { githubStats } from '@/lib/portfolio-data'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />
      <div
        className="blob animate-blob bg-emerald-500/40"
        style={{ top: '-10%', left: '-5%', width: 420, height: 420 }}
      />
      <div
        className="blob animate-blob bg-amber-500/30"
        style={{
          bottom: '-10%',
          right: '-5%',
          width: 480,
          height: 480,
          animationDelay: '4s',
        }}
      />

      <div className="container mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-center"
        >
          {/* Left: Text */}
          <div className="flex flex-col gap-6">
            <motion.div variants={item} className="inline-flex items-center gap-2 self-start">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                <Sparkles className="h-3 w-3" />
                Disponible pour stages & collaborations
              </span>
            </motion.div>

            <motion.div variants={item} className="flex flex-col gap-3">
              <p className="text-base md:text-lg text-muted-foreground font-mono">
                Bonjour, je suis
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.05]">
                Mouhamadou Lamine{' '}
                <span className="text-gradient">SOW</span>
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-muted-foreground text-balance">
                Étudiant ingénieur en IA/ML · Optimisation
              </h2>
            </motion.div>

            <motion.p
              variants={item}
              className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty"
            >
              Passionné par l'intelligence artificielle, la modélisation prédictive et la
              recherche opérationnelle. J'aime construire des systèmes qui transforment des
              données complexes en décisions actionable — du scoring de crédit à la prédiction
              de marchés financiers.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-3">
              <a href="#projects">
                <Button
                  size="lg"
                  className="rounded-full h-12 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/25 border-0"
                >
                  Voir mes projets
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-6 border-border/60 backdrop-blur-md bg-background/40"
                >
                  Me contacter
                </Button>
              </a>
              <a
                href="https://github.com/Lamine2004Sow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full h-12 px-6 text-muted-foreground hover:text-foreground"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </a>
            </motion.div>

            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2"
            >
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-500" />
                Université Sorbonne Paris Nord — Sup Galilée
              </span>
            </motion.div>
          </div>

          {/* Right: Avatar + Stats card */}
          <motion.div variants={item} className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 via-transparent to-amber-500/20 blur-2xl" />

              <div className="relative glass rounded-[2rem] p-6 md:p-8 flex flex-col items-center gap-6 animate-float">
                {/* Avatar */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 blur-md opacity-60" />
                  <img
                    src="https://avatars.githubusercontent.com/u/207840111?v=4"
                    alt="Photo de Mouhamadou Lamine SOW"
                    className="relative h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-background/80 shadow-2xl"
                    loading="eager"
                  />
                  <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background" />
                </div>

                <div className="text-center">
                  <p className="text-lg font-bold">@Lamine2004Sow</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    Ingénieur IA/ML en formation
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 w-full gap-2 pt-2 border-t border-border/40">
                  <Stat icon={Star} value={githubStats.stars} label="stars" />
                  <Stat
                    icon={Users}
                    value={githubStats.followers}
                    label="followers"
                  />
                  <Stat
                    icon={GitFork}
                    value={githubStats.publicRepos}
                    label="repos"
                  />
                </div>

                <a
                  href="https://github.com/Lamine2004Sow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-11 border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Voir le profil GitHub
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
          <div className="h-10 w-6 rounded-full border-2 border-border/60 flex items-start justify-center p-1">
            <motion.span
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="h-2 w-1 rounded-full bg-emerald-500"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: number
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <Icon className="h-4 w-4 text-emerald-500" />
      <span className="text-xl font-bold">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
