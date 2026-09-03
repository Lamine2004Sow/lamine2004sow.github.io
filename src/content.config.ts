import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projets' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    github: z.string().optional(),
    demo: z.string().optional(),
  }),
});

const redactions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/redactions' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const rapports = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rapports' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    entreprise: z.string().optional(),
    duree: z.string().optional(),
  }),
});

export const collections = { projets, redactions, rapports };
