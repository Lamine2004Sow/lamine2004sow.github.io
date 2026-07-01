'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from './section-heading'
import { Card, CardContent } from '@/components/ui/card'
import { skillCategories } from '@/lib/portfolio-data'

const techMarquee = [
  'Python',
  'Scikit-learn',
  'PyTorch',
  'NumPy',
  'Pandas',
  'PuLP',
  'Gurobi',
  'SQL',
  'Spark',
  'Matplotlib',
  'Seaborn',
  'Jupyter',
  'Git',
  'HTML',
  'CSS',
  'JavaScript',
  'PLNE',
  'Gradient Descent',
  'Classification',
  'Régression',
  'VLM',
  'NLP',
  'Optimisation Combinatoire',
  'Big Data',
]

export function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div
        className="blob bg-emerald-500/15"
        style={{ top: '20%', right: '-15%', width: 500, height: 500 }}
      />

      <div className="container mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        <SectionHeading
          eyebrow="Compétences"
          title="Une boîte à outils data complète"
          description="Du Machine Learning à la Recherche Opérationnelle, en passant par le Big Data et la visualisation. Voici les technologies et méthodes que je pratique au quotidien."
        />

        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Card className="h-full border-border/40 bg-card/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
                <CardContent className="p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 text-emerald-500 border border-emerald-500/20">
                      <cat.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold leading-tight">
                      {cat.title}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {cat.skills.map((s, i) => (
                      <div key={s.name} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">
                            {s.level}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.level}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: 0.2 + i * 0.08,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative -mx-4 md:-mx-6"
        >
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="flex gap-3 animate-marquee whitespace-nowrap py-2">
            {[...techMarquee, ...techMarquee].map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-mono border border-border/40 bg-card/40 backdrop-blur-sm text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
