'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from './section-heading'
import { Badge } from '@/components/ui/badge'
import { timeline } from '@/lib/portfolio-data'

export function Timeline() {
  return (
    <section id="timeline" className="relative py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Parcours"
          title="Une trajectoire orientée data"
          description="De la première ligne de Python aux projets de Machine Learning appliqué à la finance — voici les étapes clés de mon parcours."
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/60 via-border to-transparent md:-translate-x-1/2" />

          <div className="flex flex-col gap-12 md:gap-16">
            {timeline.map((item, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 md:items-center`}
                >
                  {/* Dot */}
                  <span className="absolute left-4 md:left-1/2 top-1.5 -translate-x-1/2 grid place-items-center h-8 w-8 rounded-full bg-background border-2 border-emerald-500 z-10">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </span>

                  {/* Card */}
                  <div
                    className={`${
                      isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-2'
                    }`}
                  >
                    <div className="inline-block rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 md:p-6 hover:border-emerald-500/40 transition-colors w-full">
                      <span className="inline-block text-xs font-mono uppercase tracking-widest text-emerald-500 mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground mt-1">
                        {item.subtitle}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-3 text-pretty">
                        {item.description}
                      </p>
                      <div
                        className={`flex flex-wrap gap-1.5 mt-4 ${
                          isLeft ? 'md:justify-end' : ''
                        }`}
                      >
                        {item.tags.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="font-mono text-[11px] font-normal bg-muted/60"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
