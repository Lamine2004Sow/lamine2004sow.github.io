'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-col gap-3 mb-12 md:mb-16',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-base md:text-lg text-muted-foreground max-w-2xl text-pretty',
            align === 'center' ? 'mx-auto' : ''
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  )
}
