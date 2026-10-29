import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { z } from 'zod';

// Un fichier Markdown par projet dans content/projets, validé par ce schéma à la compilation.
const schema = z.object({
  title: z.string(),
  short: z.string().max(14),
  description: z.string(),
  result: z.string(),
  date: z.string(),
  order: z.number(),
  tags: z.array(z.string()).default([]),
  kind: z.enum(['projet', 'stage']).default('projet'),
  status: z.string().optional(),
  role: z.string().optional(),
  duree: z.string().optional(),
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  joke: z.string().optional(),
});

export type ProjectMeta = z.infer<typeof schema> & { slug: string };
export type Project = ProjectMeta & { html: string };

const DIR = path.join(process.cwd(), 'content/projets');

function load(file: string): Project {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'));
  const slug = file.replace(/\.md$/, '');
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error(`content/projets/${file} : ${parsed.error.message}`);
  return { ...parsed.data, slug, html: marked.parse(content, { async: false }) };
}

export function getProjects(): Project[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map(load)
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

// Version légère (sans le HTML) pour le monde 3D côté client.
export function getProjectMetas(): ProjectMeta[] {
  return getProjects().map(({ html: _html, ...meta }) => meta);
}
