'use client'

import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, ArrowUpRight, Send, MapPin } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const channels = [
  {
    icon: Github,
    label: 'GitHub',
    value: '@Lamine2004Sow',
    href: 'https://github.com/Lamine2004Sow',
    description: 'Tous mes projets open source et académiques',
    accent: 'emerald',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'Contacter par email',
    href: 'mailto:contact@example.com?subject=Contact%20depuis%20le%20portfolio',
    description: 'Pour stages, collaborations ou simples échanges',
    accent: 'amber',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Mouhamadou Lamine SOW',
    href: 'https://www.linkedin.com/in/mouhamadou-lamine-sow-118097334',
    description: 'Mon parcours professionnel et réseau',
    accent: 'blue',
  },
]

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="blob bg-emerald-500/20"
        style={{ bottom: '-10%', left: '-5%', width: 500, height: 500 }}
      />
      <div
        className="blob bg-amber-500/15"
        style={{ top: '10%', right: '-10%', width: 420, height: 420 }}
      />

      <div className="container mx-auto max-w-5xl px-4 md:px-6 relative z-10">
        <SectionHeading
          eyebrow="Contact"
          title="Construisons quelque chose ensemble"
          description="Ouvert aux stages, aux projets collaboratifs et aux discussions autour de l'IA/ML, du Machine Learning et de l'optimisation."
        />

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-10">
          {channels.map((c, idx) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block"
            >
              <Card className="group h-full border-border/40 bg-card/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1">
                <CardContent className="p-6 md:p-8 flex items-start gap-5">
                  <div
                    className={`grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br ${
                      c.accent === 'emerald'
                        ? 'from-emerald-500/20 to-emerald-500/5 text-emerald-500 border-emerald-500/20'
                        : c.accent === 'blue'
                        ? 'from-blue-500/20 to-blue-500/5 text-blue-500 border-blue-500/20'
                        : 'from-amber-500/20 to-amber-500/5 text-amber-500 border-amber-500/20'
                    } border group-hover:scale-110 transition-transform`}
                  >
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        {c.label}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-lg font-semibold truncate">{c.value}</p>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {c.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card/40 to-amber-500/10 backdrop-blur-sm p-8 md:p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="relative flex flex-col items-center gap-5">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Disponible
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-balance max-w-xl">
              Une idée de projet data en tête ?
            </h3>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl text-pretty">
              Que ce soit pour un stage, un projet académique ou une collaboration
              open source — n'hésitez pas à me contacter.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://github.com/Lamine2004Sow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="rounded-full h-12 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/25 border-0"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Démarrer une conversation
                </Button>
              </a>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-emerald-500" />
                Île-de-France, France
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
