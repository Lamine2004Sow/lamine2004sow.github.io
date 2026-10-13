import type { Lang } from './ui';

export const SECTION_PATH = {
  projets: '/projets',
  redactions: '/redactions',
  rapports: '/rapports',
} as const;

/** Prefix a French-root path with the language folder. French stays at the root. */
export function url(lang: Lang, path: string): string {
  if (lang === 'fr') return path;
  return path === '/' ? '/en/' : `/en${path}`;
}

/** Remove the /en prefix from a pathname: returns the French-root equivalent. */
export function stripLang(pathname: string): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** Language of a pathname, from its /en prefix. */
export function langOf(pathname: string): Lang {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'fr';
}

/** Trailing slash removed, except for the root. */
export function normalize(pathname: string): string {
  return pathname.replace(/\/$/, '') || '/';
}
