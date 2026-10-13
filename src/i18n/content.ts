import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './ui';

export type CollectionName = 'projets' | 'redactions' | 'rapports';

/**
 * Content entry in one language. Ids follow the layout `<lang>/<slug>`
 * (e.g. `fr/dermtriage`, `en/dermtriage`), so `slug` drops the language folder.
 */
export type LocalizedEntry = CollectionEntry<CollectionName> & { slug: string };

const time = (date: string) => new Date(date).getTime();

/** Entries of one collection in one language, most recent first. */
export async function getEntries(collection: CollectionName, lang: Lang): Promise<LocalizedEntry[]> {
  const prefix = `${lang}/`;
  const entries = await getCollection(collection, (entry) => entry.id.startsWith(prefix));
  return entries
    .map((entry) => ({ ...entry, slug: entry.id.split('/').slice(1).join('/') }) as LocalizedEntry)
    .sort((a, b) => time(b.data.date) - time(a.data.date));
}
