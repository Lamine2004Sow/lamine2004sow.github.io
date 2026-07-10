'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Star, Github } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { projects, type Project } from '@/lib/portfolio-data'

const categoryColors: Record<Project['category'], string> = {
  'Machine Learning': 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
  Optimisation: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
  'IA & Vision': 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
  'Big Data': 'text-amber-500 border-amber-500/30 bg-amber-500/10',
  'Data Science': 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
}

export function Projects() {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Projets"
          title="Projets réalisés et à venir"
          description="Mes trois réalisations principales : un stage Data Science chez Sonatel consacré aux PBO FTTH, le problème d'optimisation Ring-Star et la prédiction des rendements d'indices boursiers."
        />

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {projects.map((p, idx) => (
            <ProjectCard key={p.name} project={p} index={idx} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex justify-center"
        >
          <a
            href="https://github.com/Lamine2004Sow?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-6 border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500"
            >
              <Github className="mr-2 h-4 w-4" />
              Voir tous les dépôts sur GitHub
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isFeatured = index < 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.55,
        delay: (index % 2) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={isFeatured ? 'md:col-span-2' : ''}
    >
      <Card className="group relative h-full overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
        {/* Top decorative gradient bar */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-500 opacity-70 group-hover:opacity-100 transition-opacity" />

        <CardContent className={`p-6 md:p-8 ${isFeatured ? 'md:flex md:gap-8' : ''}`}>
          {/* Icon block */}
          <div
            className={`mb-5 ${isFeatured ? 'md:mb-0 md:flex-shrink-0' : ''}`}
          >
            <div className="relative inline-grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-amber-500/15 border border-emerald-500/20 text-emerald-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <project.icon className="h-6 w-6" />
              {project.stars > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-md">
                  <Star className="h-2.5 w-2.5 fill-white" />
                  {project.stars}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${categoryColors[project.category]}`}
              >
                {project.category}
              </span>
              {isFeatured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border border-foreground/20 text-muted-foreground">
                  Projet phare
                </span>
              )}
              {project.status && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border border-amber-500/40 bg-amber-500/10 text-amber-500">
                  {project.status}
                </span>
              )}
            </div>

            <h3 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
              {project.title}
            </h3>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
              {isFeatured ? project.longDescription : project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-mono text-[11px] font-normal bg-muted/60 hover:bg-muted"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {project.url && <div className="pt-3 mt-auto">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors group/link"
              >
                <Github className="h-4 w-4" />
                Explorer le dépôt
                <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
