'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Target, Lightbulb, Code2, Quote } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Card, CardContent } from '@/components/ui/card'

const highlights = [
  {
    icon: GraduationCap,
    title: 'Formation académique',
    description:
      "Étudiant ingénieur à l'Université Sorbonne Paris Nord — Sup Galilée, spécialisé en IA/ML, Machine Learning et Recherche Opérationnelle.",
  },
  {
    icon: Target,
    title: 'Approche problème → modèle',
    description:
      "J'aime partir d'un problème métier concret (risque de crédit, prédiction de marché, optimisation de réseau) pour construire un système complet : de la donnée brute à la décision.",
  },
  {
    icon: Lightbulb,
    title: 'Curiosité & rigueur',
    description:
      "Implémenter les algorithmes from scratch pour comprendre, puis utiliser les librairies pour produire. Toujours chercher le bon compromis entre performance et interprétabilité.",
  },
  {
    icon: Code2,
    title: 'Stack pratique',
    description:
      "Python au quotidien (NumPy, Pandas, Scikit-learn, PyTorch), PLNE avec PuLP/Gurobi, SQL, Git. Connaissances en HTML/CSS/JS pour le prototypage web.",
  },
]

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="À propos"
          title="Transformer la donnée en décisions"
          description="Étudiant passionné par l'IA, le Machine Learning et l'optimisation. Mon objectif : bâtir des systèmes intelligents qui résolvent des problèmes concrets."
        />

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 h-8 w-8 text-emerald-500/30" />
              <p className="text-lg md:text-xl leading-relaxed text-pretty pl-8">
                Je suis{' '}
                <span className="font-semibold text-foreground">
                  Mouhamadou Lamine SOW
                </span>
                , étudiant ingénieur en IA/ML à l'Université Sorbonne Paris Nord — Sup
                Galilée. Mon parcours est animé par une conviction simple : les
                données racontent une histoire, et le Machine Learning est l'outil qui
                permet de l'écouter.
              </p>
            </div>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
              Au fil de mes projets, j'ai exploré des terrains variés — de la
              classification du risque de crédit à la prédiction de rendements
              boursiers, en passant par l'optimisation combinatoire de réseaux de
              transport et la vision par ordinateur. Chacun m'a appris qu'un bon
              modèle ne suffit pas : il faut comprendre le contexte métier, maîtriser
              la donnée, et savoir communiquer les résultats.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
              Je m'intéresse particulièrement à l'intersection entre{' '}
              <span className="text-emerald-500 font-medium">Machine Learning</span> et{' '}
              <span className="text-amber-500 font-medium">
                Recherche Opérationnelle
              </span>{' '}
              — deux disciplines qui, combinées, transforment des prédictions en
              décisions optimales. C'est exactement ce que j'ai mis en œuvre dans mon
              projet sur l'optimisation de portefeuille de prêts.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <InfoChip label="Localisation" value="Île-de-France, France" />
              <InfoChip label="Éducation" value="Sorbonne Paris Nord" />
              <InfoChip label="Focus" value="ML · Optimisation · IA" />
              <InfoChip label="Disponible" value="Stages & projets" highlight />
            </div>
          </motion.div>

          {/* Highlights grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {highlights.map((h, i) => (
              <Card
                key={h.title}
                className="group relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors duration-300"
              >
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                    <h.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold leading-tight">{h.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {h.description}
                  </p>
                </CardContent>
                <span className="absolute top-3 right-3 text-xs font-mono text-muted-foreground/40">
                  0{i + 1}
                </span>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function InfoChip({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-0.5 p-3 rounded-xl border ${
        highlight
          ? 'border-emerald-500/40 bg-emerald-500/10'
          : 'border-border/40 bg-card/40'
      }`}
    >
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
