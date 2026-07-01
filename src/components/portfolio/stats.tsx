'use client'

import { motion } from 'framer-motion'
import { Star, GitFork, Users, BookOpen, Award, Clock } from 'lucide-react'
import { githubStats } from '@/lib/portfolio-data'

const stats = [
  {
    icon: BookOpen,
    value: githubStats.publicRepos,
    label: 'Dépôts publics',
    description: 'Projets académiques & personnels',
  },
  {
    icon: Star,
    value: githubStats.stars,
    label: 'Étoiles reçues',
    description: 'Sur l\'ensemble des dépôts',
  },
  {
    icon: Users,
    value: githubStats.followers,
    label: 'Followers',
    description: 'Communauté GitHub',
  },
  {
    icon: Award,
    value: 6,
    label: 'Projets phares',
    description: 'ML · Optimisation · Vision',
  },
]

export function Stats() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative rounded-3xl border border-border/40 bg-gradient-to-br from-emerald-500/10 via-card/40 to-amber-500/10 backdrop-blur-sm p-8 md:p-12 overflow-hidden">
          <div
            className="absolute inset-0 bg-grid opacity-30 pointer-events-none"
          />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="grid place-items-center h-12 w-12 rounded-2xl bg-background/60 border border-emerald-500/30 text-emerald-500 mb-1">
                  <s.icon className="h-5 w-5" />
                </div>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                  className="text-4xl md:text-5xl font-bold tracking-tight"
                >
                  {s.value}
                </motion.span>
                <span className="text-sm font-semibold">{s.label}</span>
                <span className="text-xs text-muted-foreground max-w-[160px]">
                  {s.description}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="relative mt-8 pt-8 border-t border-border/40 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-mono">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              Membre GitHub depuis {githubStats.joinedYear}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GitFork className="h-3.5 w-3.5 text-emerald-500" />
              {githubStats.following} following
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-emerald-500" />
              Mise à jour quotidienne
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
